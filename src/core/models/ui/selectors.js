export function getUI(state) {
  return state.ui;
}

export function getVisible(state) {
  return getUI(state).visible;
}