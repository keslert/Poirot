export function getUI(state) {
  return state.ui;
}

export function getVisibleItems(state) {
  return getUI(state).visible;
}