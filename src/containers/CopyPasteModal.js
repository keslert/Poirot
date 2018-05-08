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
    this.props.clearSelectedOverwrites(true);
    this.props.setPasteNode(null);
  }

  handleAccept = () => {
    const style = this.getStyle();
    this.props.updateSelectedOverwrites(style);
    this.props.clearSelectedOverwrites(true);
    this.props.setPasteNode(null);
  }

  handleToggle = key => {
    const newState = {controls: {...this.state.controls, [key]: !this.state.controls[key]}};
    this.setState(newState);

    const style = this.getStyle(this.props, newState);
    this.props.clearSelectedOverwrites(true);
    this.props.updateSelectedOverwrites(style, true);
  }

  getStyle = (props=this.props, state=this.state) => {
    const keys = [];
    console.log('getStyle');
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
      props.updateSelectedOverwrites(style, true);
      this.setState({controls});
    }
  }

  renderSpacing = (key, label) => {
    const sides = ['Top', 'Right', 'Bottom', 'Left']
    return this.renderRow({
      key,
      label,
      copyValue: sides.map(side => this.props.copyStyle[`${key}${side}`]).join(' '),
      pasteValue: sides.map(side => this.props.pasteStyle[`${key}${side}`]).join(' '),
    })
  }

  renderColor = (key, label) => {
    return this.renderRow({
      key,
      label,
      copyValue: this.props.copyStyle[key],
      pasteValue: this.props.pasteStyle[key],
    })
  }

  renderText = () => {
    const { copyNode, pasteNode, copyStyle, pasteStyle } = this.props;
    if(!copyNode.isTextNode || !pasteNode.isTextNode) {
      return null;
    }

    return this.renderRow({
      key: 'text',
      label: 'Text',
      copyValue: getTextString(copyStyle),
      pasteValue: getTextString(pasteStyle),
    })
  }

  renderRow({key, label, copyValue, pasteValue}) {
    const checked = this.state.controls[key];
    const isEqual = pasteValue === copyValue;
    return (
      <Flex align="center" py={2} style={{opacity: isEqual ? .3 : 1, order: isEqual ? 2 : 1}}>
        <Toggle 
          disabled={isEqual} 
          checked={checked} 
          onClick={() => !isEqual && this.handleToggle(key)} 
        />
        <Subhead f={2} mx={2} children={label} />
        <Text color="#999" children={pasteValue} />
        <Text mx={2} children="→" />
        <Text children={copyValue} style={{textDecoration: isEqual ? 'line-through' : 'none'}} />
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
        <Absolute style={{top: bb.top + bb.height + 10, left: bb.left}}>
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
              <Button bg={theme.colors.blue} color="#fff" children="Apply Styles" onClick={this.handleAccept} />
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

    // console.log(overwrites);

    const copyStyle = {...copyNode.style, ...(overwrites[copyNode.uid] || {})};
    const pasteStyle = {...pasteNode.style, ...(overwrites[pasteNode.uid] || {})};
    // console.log('pasteStyle', pasteStyle);
    // console.log('overwrites', overwrites[pasteNode.uid]);

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