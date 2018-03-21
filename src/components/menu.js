import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Flex, Box, Text } from 'rebass';
import { getActiveDS } from '../core/models/ds/selectors';
import { getTypographyCategories } from '../core/models/page/selectors';
import { toggleVisible } from '../core/models/ui/actions';
import { getVisible } from '../core/models/ui/selectors';
import MenuItem from './menu-item';
import TypographyTable from './typography-table';

const SMenu = Box.extend`
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px 2px rgba(0,0,0,0.20);
  height: auto;
  background-color: #fff;
  border-radius: 4px;
`

class Menu extends React.Component {

  state = {
    menu: 'Typography',
  }

  renderHeader = (str) => {
    return (
      <Flex p="12px" pt={2}>
        <Text is="span" bold children="DSXray" />
        <Box mx="auto"><Text center bold>{this.state.menu} <Text is="span" f="8px" children="▼" /></Text></Box>
        <Text is="span" bold children="x" />
      </Flex>
    )
  }

  renderMenuItem = (item) => {
    return (
      <MenuItem item={item} key={item.label} />
    )
  }

  render() {
    return (
      <SMenu>
        {this.renderHeader()}
        <TypographyTable 
          toggleVisible={this.props.toggleVisible}
          typography={this.props.typography} 
          visible={this.props.visible}
          />
      </SMenu>
    )
  }
}

const mapStateToProps = state => ({
  visible: getVisible(state),
  typography: getTypographyCategories(state),
})

const mapDispatchToProps = {
  toggleVisible,
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);