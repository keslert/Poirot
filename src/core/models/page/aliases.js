import { ALIAS_UPDATE_OVERWRITES } from './action-types';
import { TOGGLE_HIDE_CHANGES } from '../ui/action-types';
import { getNodes, getOverwrites } from './selectors';
import { normalizeColor } from '../../utils/color';
import mapValues from 'lodash/mapValues';
import fromPairs from 'lodash/fromPairs';
import { 
  getSelectedNode, 
  getSelectedControl, 
} from '../ui/selectors';
import { getDS } from '../ds/selectors';

export function updateOverwrites({payload: overwrites}) {
  return (dispatch, getState) => {
    const uids = Object.keys(overwrites);
    const nodes = getNodes(getState());

    const _overwrites = fromPairs(uids.map(uid => {
      const style = overwrites[uid];
      const node = nodes[uid];
      return [
        uid,
        // If the overwrite value is the same as the original, set it to null
        mapValues(style, (value, key) => node.style[key] === value ? null : value)
      ]
    }))

    dispatch({type: ALIAS_UPDATE_OVERWRITES, payload: _overwrites});
    dispatch({type: TOGGLE_HIDE_CHANGES, payload: false});
  }
}

export function popOverwrite({payload: action}) {
  return (dispatch, getState) => {
    const state = getState();
    const selected = getSelectedNode(state);
    const selectedControl = getSelectedControl(state);
    const overwrites = getOverwrites(state);

    const style = {...selected.style, ...(overwrites[selected.uid] || {})}
    const ds = getDS(state);
    const changes = (() => {
      if(_.startsWith(selectedControl, 'margin')) {
        return popSpacing('margin', style, ds, action, selectedControl);
      } else if(_.startsWith(selectedControl, 'padding')) {
        return popSpacing('padding', style, ds, action, selectedControl);
      } else if(selectedControl === 'backgroundColor') {
        return popColor('backgroundColor', style, ds, action);
      } else if(selectedControl === 'color') {
        return popColor('color', style, ds, action);
      } else if(selectedControl === 'text') {
        return popText(style, ds, action);
      }
    })()
    dispatch(updateOverwrites({
      payload: {[selected.uid]: changes}
    }))
  }
}

const SIDES = {T: 'Top', B: 'Bottom', L: 'Left', R: 'Right'}
function popSpacing(type, style, ds, action, control) {
  const sides = control.slice(type.length).split('').map(s => `${type}${SIDES[s]}`);
  const current = Number.parseInt(style[sides[0]]) || 0;
  const spacing = ds.spacing.defaults;
  const closest = _.sortBy(spacing, n => Math.abs(n - current))[0]

  const value = `${getValue(action, closest, spacing)}px`;
  return _.fromPairs(sides.map(side => [side, value]));
}

function popText(style, ds, action) {
  return {};
}

function popColor(type, style, ds, action) {
  const color = normalizeColor(style[type]) === 'none' 
    ? normalizeColor('#ffffff')
    : normalizeColor(style[type])
  
  const {swatchKey, index} = _.find(ds.colors.flattened, c => c.value === color);
  const swatch = ds.colors.swatches[swatchKey];
  const colors = swatch.colors.map(c => c.value);

  const value = getValue(action, color, colors);
  return {[type]: value};
}

function getValue(action, currentValue, options) {
  const index = _.isNumber(action.level) 
    ? action.level
    : options.indexOf(currentValue) + action.step

  return options[_.clamp(index, 0, options.length - 1)];
}