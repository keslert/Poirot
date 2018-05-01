import { 
  ALIAS_UPDATE_OVERWRITES, 
  ALIAS_CLEAR_SELECTED_OVERWRITES,
} from './action-types';
import { TOGGLE_HIDE_CHANGES } from '../ui/action-types';
import { getNodes, getOverwrites } from './selectors';
import { normalizeColor } from '../../utils/color';
import mapValues from 'lodash/mapValues';
import fromPairs from 'lodash/fromPairs';
import { 
  getSelectedNode, 
  getSelectedControl,
  getPseudoSelectedNodes, 
} from '../ui/selectors';
import { getDS } from '../ds/selectors';


export function updateSelectedOverwrites({payload: {overwrites, isEphemeral}, _sender}) {
  return (dispatch, getState) => {
    const state = getState();
    const selected = getSelectedNode(state, _sender.url);
    const psuedoSelected = getPseudoSelectedNodes(state, _sender.url);

    const overwrites_ = _.fromPairs([selected, ...psuedoSelected].map(node => [node.uid, overwrites]));
    dispatch(updateOverwrites({
      payload: {overwrites: overwrites_, isEphemeral},
      _sender,
    }))
  }
}

export function clearSelectedOverwrites({payload: {isEphemeral}, _sender}) {
  return (dispatch, getState) => {
    const state = getState();
    const selected = getSelectedNode(state, _sender.url);
    const psuedoSelected = getPseudoSelectedNodes(state, _sender.url);
    const uids = [selected, ...psuedoSelected].map(node => node.uid);
    dispatch({
      type: ALIAS_CLEAR_SELECTED_OVERWRITES,
      payload: {uids, isEphemeral},
      _sender,
    })
  }
}

export function updateOverwrites({payload: {overwrites, isEphemeral}, _sender}) {
  return (dispatch, getState) => {
    const state = getState();
    const nodes = getNodes(state, _sender.url);
    const currentOverwrites = getOverwrites(state, _sender.url);
    
    const uids = Object.keys(overwrites);
    const _overwrites = fromPairs(uids.map(uid => {
      const node = nodes[uid];
      const style = {...node.style, ...((isEphemeral && currentOverwrites[node.uid]) || {})}
      
      return [
        uid,
        // If the overwrite value is the same as the original, set it to null
        mapValues(overwrites[uid], (value, key) => style[key] === value ? null : value)
      ]
    }))

    dispatch({
      type: ALIAS_UPDATE_OVERWRITES, 
      payload: {overwrites: _overwrites, isEphemeral}, 
      _sender,
    });
    dispatch({type: TOGGLE_HIDE_CHANGES, payload: false, _sender});
  }
}

export function popOverwrite({payload: action, _sender}) {
  return (dispatch, getState) => {
    const state = getState();
    const selected = getSelectedNode(state, _sender.url);
    const selectedControl = getSelectedControl(state, _sender.url);
    const overwrites = getOverwrites(state, _sender.url);
    const ds = getDS(state, _sender.url);
    const style = {...selected.style, ...(overwrites[selected.uid] || {})}
    
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
    dispatch(updateSelectedOverwrites({
      payload: {overwrites: changes},
      _sender,
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