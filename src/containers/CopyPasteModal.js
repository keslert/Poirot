import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getCopyNode } from '../core/models/clipboard/selectors';
import { getPasteNode } from '../core/models/ui/selectors';
import { setPasteNode } from '../core/models/ui/actions';
import { getOverwrites } from '../core/models/page/selectors';
import { 
  updateSelectedOverwrites,
  clearSelectedOverwrites,
} from '../core/models/page/actions';
import { getBB } from '../core/utils/html';
import { getTextString } from '../core/utils/text';
import { Fixed, Absolute, Box, Flex, Subhead, Text } from 'rebass';
import theme from '../styles/rebass-theme';

import Button from '../components/button';
import Toggle from '../components/toggle';


class CopyPasteModal extends React.Component {

  state = {}

  handleCancel = () => {
    const { pasteNode } = this.props;
    this.props.clearSelectedOverwrites(true);
    this.props.setPasteNode(null);
  }

  handleAccept = () => {
    const { pasteNode } = this.props;

    const style = this.getStyle();
    this.props.updateSelectedOverwrites(style);
    this.props.clearSelectedOverwrites(true);
    this.props.setPasteNode(null);
  }

  handleToggle = key => {
    const { pasteNode } = this.props;
    const newState = {controls: {...this.state.controls, [key]: !this.state.controls[key]}};
    this.setState(newState);

    const style = this.getStyle(this.props, newState);
    this.props.clearSelectedOverwrites(true);
    this.props.updateSelectedOverwrites(style, true);
  }

  getStyle = (props=this.props, state=this.state) => {
    const keys = [];
    if(state.controls.margin) {
      keys.push('marginTop', 'marginBottom', 'marginLeft', 'marginRight');
    }
    if(state.controls.padding) {
      keys.push('paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight');
    }
    if(state.controls.text && props.copyNode.isTextNode && props.pasteNode.isTextNode) {
      keys.push('fontFamily', 'fontWeight', 'fontSize');
    }
    if(state.controls.color) {
      keys.push('color');
    }
    if(state.controls.backgroundColor) {
      keys.push('backgroundColor');
    }

    return _.pick(props.copyStyle, keys);
  }

  componentWillReceiveProps(props) {
    const { copyNode, pasteNode } = this.props;

    if(props.visible && !this.props.visible) {
      const controls = {
        margin: true,
        padding: true,
        text: true,
        color: true,
        backgroundColor: true,
      }
      
      const style = this.getStyle(props, {controls});
      props.updateSelectedOverwrites({[props.pasteNode.uid]: style}, true);
      this.setState({controls});
    }
  }

  renderSpacing = (key, label) => {
    const { copyStyle, pasteStyle } = this.props;
    return (
      <Flex align="center" py={2}>
        <Toggle checked={this.state.controls[key]} onClick={() => this.handleToggle(key)} />
        <Subhead f={2} mx={2} children={label} />
        <Text color="#999" children={`${pasteStyle[`${key}Top`]} ${pasteStyle[`${key}Right`]} ${pasteStyle[`${key}Bottom`]} ${pasteStyle[`${key}Left`]}`} />
        <Text mx={2} children="→" />
        <Text children={`${copyStyle[`${key}Top`]} ${copyStyle[`${key}Right`]} ${copyStyle[`${key}Bottom`]} ${copyStyle[`${key}Left`]}`} />
      </Flex>
    )
  }

  renderColor = (key, label) => {
    const { copyStyle, pasteStyle } = this.props;
    return (
      <Flex align="center" py={2}>
        <Toggle checked={this.state.controls[key]} onClick={() => this.handleToggle(key)} />
        <Subhead f={2} mx={2} children={label} />
        <Text color="#999" children={pasteStyle[key]} />
        <Text mx={2} children="→" />
        <Text children={copyStyle[key]} />
      </Flex>
    )
  }

  renderText = () => {
    const { copyNode, pasteNode, copyStyle, pasteStyle } = this.props;
    if(!copyNode.isTextNode || !pasteNode.isTextNode) {
      return null;
    }
    return (
      <Flex align="center" py={2}>
        <Toggle checked={this.state.controls['text']} onClick={() => this.handleToggle('text')} />
        <Subhead f={2} mx={2} children="Text" />
        <Text color="#999" children={getTextString(pasteStyle)} />
        <Text mx={2} children="→" />
        <Text children={getTextString(copyStyle)} />
      </Flex>
    )
  }

  render() {
    const { copyStyle, pasteStyle, pasteNode, visible } = this.props;
    
    if(!visible) {
      return null;
    }
    const el = document.querySelector(`.${pasteNode.uid}`);
    if(!el) {
      return null;
    }

    const bb = getBB(el)
    return (
      <div>
        <Fixed style={{top:0, left: 0, right: 0, bottom: 0}} onClick={this.handleCancel} />
        <Absolute style={{top: bb.top + bb.height + 30, left: bb.left}}>
          <Flex direction="column" bg="#fff" style={{boxShadow: theme.shadows.heavy, borderRadius: 4, overflow: 'hidden'}}>
            <Flex direction="column" p={3}>
              {this.renderSpacing('margin', 'Margin (T R B L)')}
              {this.renderSpacing('padding', 'Padding (T R B L)')}
              {this.renderText()}
              {this.renderColor('color', 'Color')}
              {this.renderColor('backgroundColor', 'Background Color')}
            </Flex>
            <Flex justify="flex-end" p={2} bg="#f4f4f4">
              <Button mr={2} color="#999" children="Cancel" onClick={this.handleCancel} />
              <Button bg={theme.colors.blue} color="#fff" children="Apply Styles" />
            </Flex>
          </Flex>
        </Absolute>
      </div>
    )
  }
}

const mapStateToProps = createSelector(
  getCopyNode,
  getPasteNode,
  getOverwrites,
  (copyNode, pasteNode, overwrites) => {
    if(!copyNode || ! pasteNode) {
      return {visible: false};
    }

    const copyStyle = {...copyNode.style, ...(overwrites[copyNode.uid] || {})};
    const pasteStyle = {...pasteNode.style, ...(overwrites[pasteNode.uid] || {})};

    return {
      visible: true,
      copyStyle,
      pasteStyle,
      copyNode,
      pasteNode,
    }
  }
)

const mapDispatchToProps = {
  setPasteNode,
  updateSelectedOverwrites,
  clearSelectedOverwrites,
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyPasteModal);