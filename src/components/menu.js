import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Flex, Box, Text } from 'rebass';
import { getActiveDS } from '../core/models/ds/selectors';
import { getTypographyGroups } from '../core/models/page/selectors';
import { getVisibleItems } from '../core/models/ui/selectors';
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
    const { typography } = this.props; 
    return (
      <SMenu>
        {this.renderHeader()}
        <TypographyTable typography={typography} />
      </SMenu>
    )
  }
}

const mapStateToProps = createSelector(
  getActiveDS,
  getTypographyGroups,
  (ds, typography) => ({
    typography,
  })
)

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);