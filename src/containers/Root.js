import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import App from './App';

class Root extends React.Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
export default Root;