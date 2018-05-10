import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducer';
import { composeWithDevTools } from 'remote-redux-devtools';
import { alias } from 'react-chrome-redux';
import aliases from '../aliases';

const enhancer = composeWithDevTools(
  applyMiddleware(
    alias(aliases),
    thunk
  ),
);

export default function (initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducer', () => {
      const nextRootReducer = require('../reducer');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
