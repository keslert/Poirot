import { createSelector } from 'reselect';
import { getNodes } from '../page/selectors';
import filter from 'lodash/filter';

export function getUI(state) {
  return state.ui;
}

export function getVisible(state) {
  return getUI(state).visible;
}

export function getShowSpacing(state) {
  return getUI(state).showSpacing;
}

export function getSelectedNode(state) {
  return getUI(state).selectedNode;
}

export const getSelectedChildNodes = createSelector(
  getNodes,
  getSelectedNode,
  (nodes, selected) => {
    return selected ? filter(nodes, ({ parents }) => parents.includes(selected.uid)) : []
  }
)