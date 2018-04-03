import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Flex, Box, Text } from 'rebass';
import { getTypographyCategories } from '../core/models/page/selectors';
import { toggleVisible } from '../core/models/ui/actions';
import { getVisible, getSelectedElements } from '../core/models/ui/selectors';
import { updateDSTypography } from '../core/models/ds/actions';
import MenuItem from './menu-item';
import TypographyTable from './typography-table';
import domtoimage from 'dom-to-image';


import { addPage } from '../core/models/page/actions';
import { parseAndTagPage } from '../core/utils/ds';

const SOpenMenu = Box.extend`
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px 2px rgba(0,0,0,0.20);
  height: auto;
  background-color: #fff;
  border-radius: 4px;
  font-size: 14px;
`;

const SClosedMenu = Box.extend`
  width: 40px;
  height: 40px;
  line-height: 38px;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  background-color: #fff;
  cursor: pointer;
  &:hover {
    background: #f9f9f9;
  }
  img {
    vertical-align: middle;
  }
`;

class Menu extends React.Component {

  state = {
    open: true,
    menu: 'Typography',
  }

  handleRefresh = () => {
    const page = parseAndTagPage();
    this.props.addPage(page);
  }

  handleSnapshot = () => {
    this.props.selected.forEach(({uid}) => {
      domtoimage.toJpeg(document.querySelector(`.${uid}`), { quality: 0.95, bgcolor: '#fff', })
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = `${uid}.jpg`;
          link.href = dataUrl;
          link.click();
        });
    })
  }

  renderHeader = (str) => {
    return (
      <Flex p="12px" pt={2}>
        <Box flex={1}>
          <Text is="span" bold children="Designer Tools" />
        </Box>
        <Text center bold>{this.state.menu} <Text is="span" f="8px" children="▼" /></Text>
        <Flex flex={1} justify="flex-end" m={-1}>
          <Box p={1} style={{ cursor: 'pointer' }} onClick={this.handleSnapshot}>
            <img src="https://icon.now.sh/photo_camera/18" />
          </Box>
          <Box p={1} style={{ cursor: 'pointer' }} onClick={this.handleRefresh}>
            <img src="https://icon.now.sh/refresh/18" />
          </Box>
          <Box p={1} style={{ cursor: 'pointer' }} onClick={() => (this.setState({ open: false }), this.handleMouseLeave())}>
            <img src="https://icon.now.sh/x/12" />
          </Box>
        </Flex>
      </Flex>
    )
  }

  renderMenuItem = (item) => {
    return (
      <MenuItem item={item} key={item.label} />
    )
  }

  handleMouseEnter = () => {
    document.body.classList.add('dsxray-no-scroll');
  }
  handleMouseLeave = () => {
    document.body.classList.remove('dsxray-no-scroll');
  }

  render() {
    const { open } = this.state;
    return (
      <div>
        <SOpenMenu 
          onMouseEnter={this.handleMouseEnter} 
          onMouseLeave={this.handleMouseLeave}
          style={{display: open ? 'block' : 'none'}}
        >
          {this.renderHeader()}
          <TypographyTable 
            toggleVisible={this.props.toggleVisible}
            typography={this.props.typography} 
            updateTypography={this.props.updateDSTypography}
            visible={this.props.visible}
          />
        </SOpenMenu>
        <SClosedMenu 
          onClick={() => this.setState({open: true})}
          style={{ display: open ? 'none' : 'block' }}
        >
          <img src="https://icon.now.sh/grid" />
        </SClosedMenu>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  visible: getVisible(state),
  typography: getTypographyCategories(state),
  selected: getSelectedElements(state),
})

const mapDispatchToProps = {
  toggleVisible,
  updateDSTypography,
  addPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);