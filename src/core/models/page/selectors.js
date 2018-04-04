import { createSelector } from 'reselect';
import filter from 'lodash/filter';

export function getPage(state) {
  return state.page;
}

export function getNodes(state) {
  return getPage(state).nodes;
}

export const getTextNodes = createSelector(
  getNodes,
  (nodes) => {
    return filter(nodes, node => node.isTextNode);
  }
)