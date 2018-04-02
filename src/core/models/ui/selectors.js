export function getUI(state) {
  return state.ui;
}

export function getVisible(state) {
  return getUI(state).visible;
}

export function getSelectedElements(state) {
  return getUI(state).selectedElements;
}

export function getShowSpacing(state) {
  return getUI(state).showSpacing;
}