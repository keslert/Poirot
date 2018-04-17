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

export function updateOverwrites(overwrites) {
  const fontFamilies = _.chain(overwrites).map(v => v.fontFamily).filter(Boolean).uniq().value();
  fontFamilies.forEach(loadWebFont);
  
  return {
    type: types.UPDATE_OVERWRITES,
    payload: overwrites,
  }
}

export function _updateNode(node, changes) {
  return {
    type: types.UPDATE_NODE,
    payload: {node, changes},
  }
}