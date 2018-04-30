import { createSelector } from 'reselect';
import filter from 'lodash/filter';
import { pageSpecificSelector } from '../../utils/redux';

export function getPage(state, _url) {
  return pageSpecificSelector(state, 'page', _url);
}

export function getNodes(state, url) {
  return getPage(state, url).nodes;
}

export function getOverwrites(state, url) {
  return getPage(state, url).overwrites;
}

export function getEphemerals(state, url) {
  return getPage(state, url).ephemerals;
}

export function getTreeprints(state, url) {
  return getPage(state, url).treeprints;
}

export const getTextNodes = createSelector(
  getNodes,
  (nodes) => {
    return filter(nodes, node => node.isTextNode);
  }
)

export const getImageNodes = createSelector(
  getNodes,
  (nodes) => filter(nodes, node => node.isImageNode)
)
