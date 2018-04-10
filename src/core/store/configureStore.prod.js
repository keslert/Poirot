import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducer';
import { alias } from 'react-chrome-redux';
import aliases from '../aliases';

const middlewares = applyMiddleware(alias(aliases), thunk);
const enhancer = compose(middlewares);
export default function (initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
