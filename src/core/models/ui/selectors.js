import { createSelector } from 'reselect';
import { getNodes, getTreeprints } from '../page/selectors';
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

export function getShowRedline(state) {
  return getUI(state).showRedline;
}

export function getHideChanges(state) {
  return getUI(state).hideChanges;
}

export function getSelectedNode(state) {
  return getUI(state).selectedNode;
}

export function getCustomControl(state) {
  return getUI(state).customControl;
}

export function getSelectionMode(state) {
  return getUI(state).selectionMode;
}

export const getPseudoSelectedNodes = createSelector(
  getNodes,
  getSelectedNode,
  getSelectionMode,
  getTreeprints,
  (nodes, selected, mode, treeprints) => {
    if(!selected) {
      return [];
    } else if(mode === 'individual') {
      return [selected];
    }

    const uids = [selected.uid, ...selected.parentUids];
    const treeprintNodeUid = _.find(uids, uid => treeprints[nodes[uid].treeprint]);
    if(treeprintNodeUid) {
      const index = uids.indexOf(treeprintNodeUid)
      const pathToTreeprintNode = selected.parentNodeNames.slice(0, index);
      const treeprintNode = nodes[treeprintNodeUid];
      const treeprintNodes = treeprints[treeprintNode.treeprint].filter(n => n.uid !== selected.uid);
      return treeprintNodes;
    }
    return [];
  }
)

export const getSelectedChildNodes = createSelector(
  getNodes,
  getSelectedNode,
  (nodes, selected) => {
    return selected ? filter(nodes, ({ parentUids }) => parentUids.includes(selected.uid)) : []
  }
)