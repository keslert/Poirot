export function getDS(state) {
  return state.ds;
}

export function getActiveDS(state) {
  const ds = getDS(state);
  return ds.list[ds.activeIndex];
}