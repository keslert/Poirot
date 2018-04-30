import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Flex, Box, Text } from 'rebass';
import { updateDSTypography } from '../core/models/ds/actions';
import { addPage, updateSelectedOverwrites } from '../core/models/page/actions';
import { 
  setSelectedControl,
  setMouseInsideMenu,
  setSelectionMode,
  toggleVisible,
  toggleHideChanges,
  toggleShowRedline,
  toggleCustomControl,
  toggleShowSpacing,
} from '../core/models/ui/actions';
import { getTypographyCategories, getDS } from '../core/models/ds/selectors';
import { getOverwrites } from '../core/models/page/selectors';
import { 
  getVisible, 
  getSelectedNode,
  getHideChanges,
  getShowRedline,
  getCustomControl,
  getSelectedControl,
  getShowSpacing,
  getSelectionMode,
} from '../core/models/ui/selectors';
import MenuItem from '../components/menu-item';
import TypographyTable from '../components/typography-table';
import StyleMenu from '../components/style-menu';
import domtoimage from 'dom-to-image';
import { parseAndTagPage } from '../core/utils/page';
import Icon from '../components/icon';
import HoverMenu from '../components/hover-menu';

const SOpenMenu = Box.extend`
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.shadows.heavy};
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

const SHoverMenuItem = Flex.extend`
  white-space: nowrap;
  ${props => `
    ${props.onClick && `
      cursor: pointer; 
      &:hover {
        background: #f4f4f4;
      }
    `}
  `}
`

class Menu extends React.Component {

  state = {
    open: true,
    menu: 'Style',
    hovered: false,
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
      <Flex px={2} py={1}>
        <Text center bold>{this.state.menu} <Text is="span" f="6px" children="▼" style={{position:'relative', top: -1}} /></Text>
        <Flex flex={1} justify="flex-end" align="center" m={-1}>

          <HoverMenu renderMenu={() => (
            <Flex bg="#fff" direction="column">
              <SHoverMenuItem p={2} style={{ cursor: 'pointer' }} onClick={this.props.toggleHideChanges}>
                <Icon name="visibility_off" selected={this.props.hideChanges} />
                <Text ml={1} children="Hide changes" />
              </SHoverMenuItem>
              <SHoverMenuItem p={2} style={{ cursor: 'pointer' }} onClick={this.props.toggleShowRedline}>
                <Icon name="mode_edit" selected={this.props.showRedline} />
                <Text ml={1} children="Show redlines" />
              </SHoverMenuItem>
              <SHoverMenuItem p={2} style={{ cursor: 'pointer' }} onClick={this.props.toggleShowSpacing}>
                <Icon name="vertical_align_center" selected={this.props.showSpacing} />
                <Text ml={1} children="Show margin & padding" />
              </SHoverMenuItem>
            </Flex>
          )}>
            <Box p={1} style={{ cursor: 'pointer' }} onClick={this.handleRefresh}>
              <Icon name="visibility" />
            </Box>
          </HoverMenu>

          <HoverMenu renderMenu={() => (
            <Flex bg="#fff" direction="column">
              <SHoverMenuItem p={2} style={{ cursor: 'pointer' }} onClick={this.handleSnapshot}>
                <Icon name="photo_camera" />
                <Text ml={1} children="Capture Snapshot" />
              </SHoverMenuItem>
              <SHoverMenuItem p={2} style={{ cursor: 'pointer' }} onClick={this.handleRefresh}>
                <Icon name="refresh" /> 
                <Text ml={1} children="Retag Page" />
              </SHoverMenuItem>
              <SHoverMenuItem p={2} style={{ cursor: 'pointer' }} onClick={this.handleGenerateReport}>
                <Icon name="file_download" /> 
                <Text ml={1} children="Export Page" />
              </SHoverMenuItem>
              <SHoverMenuItem p={2} style={{ cursor: 'pointer' }} onClick={this.handleGenerateReport}>
                <Icon name="file_upload" /> 
                <Text ml={1} children="Import Page" />
              </SHoverMenuItem>
            </Flex>
          )}>
            <Box p={1} style={{ cursor: 'pointer' }} onClick={this.handleRefresh}>
              <Icon name="import_export" />
            </Box>
          </HoverMenu>


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
    // document.body.classList.add('dsxray-no-scroll');
    this.props.setMouseInsideMenu(true);
  }

  handleMouseLeave = () => {
    // document.body.classList.remove('dsxray-no-scroll');
    this.props.setMouseInsideMenu(false);
  }

  renderMenu() {
    switch(this.state.menu) {
      case 'Style':
        return <StyleMenu
          ds={this.props.ds}
          customControl={this.props.customControl}
          overwrites={this.props.overwrites}
          selected={this.props.selected}
          selectionMode={this.props.selectionMode}
          typography={this.props.typography}
          toggleCustomControl={this.props.toggleCustomControl}
          updateSelectedOverwrites={this.props.updateSelectedOverwrites}
          selectedControl={this.props.selectedControl}
          setSelectedControl={this.props.setSelectedControl}
          setSelectionMode={this.props.setSelectionMode}
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
      <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <SOpenMenu style={{display: open ? 'block' : 'none'}}>
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
  ds: getDS(state),
  visible: getVisible(state),
  typography: getTypographyCategories(state),
  selected: getSelectedNode(state),
  overwrites: getOverwrites(state),
  hideChanges: getHideChanges(state),
  showRedline: getShowRedline(state),
  customControl: getCustomControl(state),
  selectedControl: getSelectedControl(state),
  showSpacing: getShowSpacing(state),
  selectionMode: getSelectionMode(state),
})

const mapDispatchToProps = {
  toggleVisible,
  updateDSTypography,
  addPage,
  updateSelectedOverwrites,
  toggleHideChanges,
  toggleShowRedline,
  toggleCustomControl,
  setSelectedControl,
  setMouseInsideMenu,
  toggleShowSpacing,
  setSelectionMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);