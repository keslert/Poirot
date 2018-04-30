import * as types from './action-types';
import WebFont from 'webfontloader';

const webFontCache = {};
function loadWebFont(fontFamily) {
  if(!webFontCache[fontFamily]) {
    webFontCache[fontFamily] = true;
    WebFont.load({ google: { families: [fontFamily] } })
  }
}

export function addPage(page) {
  return {
    type: types.ADD_PAGE,
    payload: page,
  }
}

export function updateSelectedOverwrites(overwrites, isEphemeral) {
  loadFonts({_: overwrites});
  return {
    type: types.UPDATE_SELECTED_OVERWRITES,
    payload: { overwrites, isEphemeral },
  }
}

export function updateOverwrites(overwrites, isEphemeral) {
  loadFonts(overwrites);
  return {
    type: types.UPDATE_OVERWRITES,
    payload: { overwrites, isEphemeral },
  }
}

export function clearSelectedOverwrites(isEphemeral) {
  return {
    type: types.CLEAR_SELECTED_OVERWRITES,
    payload: { isEphemeral },
  }
}

export function _updateNode(node, changes) {
  return {
    type: types.UPDATE_NODE,
    payload: {node, changes},
  }
}

export function popOverwrite(action) {
  return {
    type: types.POP_OVERWRITE,
    payload: action,
  }
}

function loadFonts(overwrites) {
  const fontFamilies = _.chain(overwrites).map(v => v.fontFamily).filter(Boolean).uniq().value();
  fontFamilies.forEach(loadWebFont);
}