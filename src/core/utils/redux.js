export const REGISTER_PAGE = 'REGISTER_PAGE';
import URL from 'url-parse';

export const pageSpecificReducer = reducer => (state={}, action) => {
  const url = action.type === REGISTER_PAGE
    ? action.payload
    : action._sender && (new URL(action._sender.url));

  if(url) {
    const page = url.hostname + url.pathname;
    return {
      ...state,
      [page]: reducer(state[page], action)
    }
  }
  return state;
}

export const pageSpecificSelector = (state, key, _url) => {
  const url = _.isString(_url) ? new URL(_url) : document.location;
  return state[key][url.hostname + url.pathname];
}

export const hostnameSpecificReducer = reducer => (state={}, action) => {
  const url = action.type === REGISTER_PAGE
    ? action.payload
    : action._sender && (new URL(action._sender.url));

  if(url) {
    return {
      ...state,
      [url.hostname]: reducer(state[url.hostname], action)
    }
  }
  return state;
}

export const hostnameSpecificSelector = (state, key, _url) => {
  const url = _.isString(_url) ? new URL(_url) : document.location;
  return state[key][url.hostname];
}