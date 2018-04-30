export function getClipboard(state) {
  return state.clipboard;
}

export function getCopyNode(state) {
  return getClipboard(state).copyNode;
}