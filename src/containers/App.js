import React from 'react';
import DesignSystem from '../data/we-work';
import Page from './Page';
import { Flex, Fixed } from 'rebass';
import { Provider as Rebass } from 'rebass';
import theme from '../styles/rebass-theme';

import Menu from '../components/menu';

class App extends React.Component {

  render() {
    return (
      <Rebass theme={theme}>
        <Fixed style={{ bottom: 16, left: 16, zIndex: 2147483647 }}>
          <Menu ds={DesignSystem} />
        </Fixed>
        <Page />
      </Rebass>
    );
  }
}

export default App;