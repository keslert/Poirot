import { createSelector } from 'reselect';
import { 
  getNodes, 
  getTreeprints, 
  getOverwrites,
} from '../page/selectors';
import filter from 'lodash/filter';
import { pageSpecificSelector } from '../../utils/redux';
import { getStyle } from '../../utils/page';

export function getUI(state, _url) {
  return pageSpecificSelector(state, 'ui', _url);
}

export function getVisible(state, _url) {
  return getUI(state, _url).visible;
}

export function getShowSpacing(state, _url) {
  return getUI(state, _url).showSpacing;
}

export function getShowRedline(state, _url) {
  return getUI(state, _url).showRedline;
}

export function getHideChanges(state, _url) {
  return getUI(state, _url).hideChanges;
}

export function getSelectedNode(state, _url) {
  return getUI(state, _url).selectedNode;
}

export function getSelectedControl(state, _url) {
  return getUI(state, _url).selectedControl;
}

export function getCustomControl(state, _url) {
  return getUI(state, _url).customControl;
}

export function getMouseInsideMenu(state, _url) {
  return getUI(state, _url).mouseInsideMenu;
}

export function getSelectionMode(state, _url) {
  return getUI(state, _url).selectionMode;
}

export function getPasteNode(state, _url) {
  return getUI(state, _url).pasteNode;
}

export const getPseudoSelectedNodes = createSelector(
  getNodes,
  getSelectedNode,
  getSelectionMode,
  getTreeprints,
  getOverwrites,
  (nodes, selected, mode, treeprints, overwrites) => {
    if(!selected || mode === 'individual') {
      return [];
    }

    if(selected.isTextNode) {
      const matchStyles = [
        'fontFamily', 'fontWeight', 'fontSize', 'color', 'backgroundColor',
        // 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 
        // 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
      ]
      return filterMatches(selected, nodes, matchStyles, overwrites);
    }

    const siblings = _.filter(selected.siblings.map(uid => nodes[uid]), Boolean);
    const matchStyles = [
      'backgroundColor', 'boxShadow',
      'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 
      'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
    ]
    const siblingMatches = filterMatches(selected, siblings, matchStyles, overwrites);
    const sizeMatches = _.filter(nodes, node => 
      !node.isTextNode && 
      Math.abs(node.bb.width - selected.bb.width) < 2 && 
      Math.abs(node.bb.height - selected.bb.height) < 2
    );
    const matches = _.uniqBy([...siblingMatches, ...sizeMatches], 'uid');
    return matches;

    /* Tree Selection
    const uids = [selected.uid, ...selected.parentUids];
    const treeprintNodeUid = _.find(uids, uid => treeprints[nodes[uid].treeprint]);
    if(treeprintNodeUid) {
      const index = uids.indexOf(treeprintNodeUid)
      const pathToTreeprintNode = selected.parentNodeNames.slice(0, index);
      const treeprintNode = nodes[treeprintNodeUid];
      const treeprintNodes = treeprints[treeprintNode.treeprint].filter(n => n.uid !== selected.uid);
      return treeprintNodes;
    }
    */
  }
)

export const getSelectedChildNodes = createSelector(
  getNodes,
  getSelectedNode,
  (nodes, selected) => {
    return selected ? filter(nodes, ({ parentUids }) => parentUids.includes(selected.uid)) : []
  }
)

function filterMatches(selected, nodes, matchStyles, overwrites) {
  const style = getStyle(selected, overwrites); 
  const matches = _.filter(nodes, node => {
    const nodeStyle = getStyle(node, overwrites);
    return node.nodeName === selected.nodeName && 
      _.every(matchStyles, key => nodeStyle[key] === style[key]) &&
      selected.uid !== node.uid
  })
  return matches;
}