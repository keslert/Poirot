import { createSelector } from 'reselect';
import filter from 'lodash/filter';

export function getPage(state) {
  return state.page;
}

export function getNodes(state) {
  return getPage(state).nodes;
}

export function getOverwrites(state) {
  return getPage(state).overwrites;
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
