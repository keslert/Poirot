import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Flex, Box, Text } from 'rebass';
import { updateDSTypography } from '../core/models/ds/actions';
import { addPage, updateOverwrites } from '../core/models/page/actions';
import { 
  toggleVisible,
  toggleHideChanges,
  toggleShowRedline,
} from '../core/models/ui/actions';
import { getTypographyCategories } from '../core/models/ds/selectors';
import { getOverwrites } from '../core/models/page/selectors';
import { 
  getVisible, 
  getSelectedNode,
  getHideChanges,
  getShowRedline,
} from '../core/models/ui/selectors';
import MenuItem from './menu-item';
import TypographyTable from './typography-table';
import StyleMenu from './style-menu';
import domtoimage from 'dom-to-image';
import { parseAndTagPage } from '../core/utils/ds';
import Icon from './icon';

const SOpenMenu = Box.extend`
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px 2px rgba(0,0,0,0.20);
  height: auto;
  background-color: #fff;
  border-radius: 4px;
  font-size: 14px;
  min-width: 350px;
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
    menu: 'Style',
  }

  componentDidMount() {
    this.handleRefresh();
  }

  handleRefresh = () => {
    const page = parseAndTagPage();
    this.props.addPage(page);
  }

  handleSnapshot = () => {
    const uid = this.props.selected.uid;
    domtoimage.toJpeg(document.querySelector(`.${uid}`), { quality: 0.95, bgcolor: '#fff', })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = `${uid}.jpg`;
        link.href = dataUrl;
        link.click();
      });
  }

  handleGenerateReport = () => {

  }

  renderHeader = (str) => {
    return (
      <Flex p={2}>
        <Text center bold>{this.state.menu} <Text is="span" f="6px" children="▼" style={{position:'relative', top: -1}} /></Text>
        <Flex flex={1} justify="flex-end" m={-1}>
          <Box p={1} style={{ cursor: 'pointer' }} onClick={this.handleGenerateReport}>
            <Icon name="file_download" />
          </Box>
          <Box p={1} style={{ cursor: 'pointer' }} onClick={this.props.toggleHideChanges}>
            <Icon name="visibility_off" selected={this.props.hideChanges} />
          </Box>
          <Box p={1} style={{ cursor: 'pointer' }} onClick={this.props.toggleShowRedline}>
            <Icon name="brush" selected={this.props.showRedline} />
          </Box>
          <Box p={1} style={{ cursor: 'pointer' }} onClick={this.handleSnapshot}>
            <Icon name="photo_camera" />
          </Box>
          <Box p={1} style={{ cursor: 'pointer' }} onClick={this.handleRefresh}>
            <Icon name="refresh" />
          </Box>
          <Box p={1} style={{ cursor: 'pointer' }} onClick={() => (this.setState({ open: false }), this.handleMouseLeave())}>
            <Icon name="x" size="12" />
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

  renderMenu() {
    switch(this.state.menu) {
      case 'Style':
        return <StyleMenu 
          selected={this.props.selected}
          typography={this.props.typography}
          updateOverwrites={this.props.updateOverwrites}
          overwrites={this.props.overwrites}
        />
      case 'Typography':
        return <TypographyTable
          toggleVisible={this.props.toggleVisible}
          typography={this.props.typography}
          updateTypography={this.props.updateDSTypography}
          visible={this.props.visible}
        />
      default:
        return <div>Not a menu...</div>
    }
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
          {this.renderMenu()}
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
  selected: getSelectedNode(state),
  overwrites: getOverwrites(state),
  hideChanges: getHideChanges(state),
  showRedline: getShowRedline(state),
})

const mapDispatchToProps = {
  toggleVisible,
  updateDSTypography,
  addPage,
  updateOverwrites,
  toggleHideChanges,
  toggleShowRedline,
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);