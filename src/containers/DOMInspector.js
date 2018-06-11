import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Text } from 'rebass';
import { getBB } from '../core/utils/html';
import { getSelectedNode, getPseudoSelectedNodes, getMouseInsideMenu } from '../core/models/ui/selectors';
import { getNodes, getOverwrites } from '../core/models/page/selectors';
import { 
  updateSelectedOverwrites,
  updateOverwrites,
  popOverwrite,
} from '../core/models/page/actions';
import { 
  setPasteNode,
  setSelectedNode,
  setSelectedControl,
  toggleShowSpacing,
} from '../core/models/ui/actions';
import { 
  setCopyNode,
} from '../core/models/clipboard/actions';
import { getWeightString } from '../core/utils/text';

import theme from '../styles/rebass-theme';

const SFrame = Box.extend`
  position: absolute;
  ${props => `
    color: ${props.color};
    background: ${props.color}08;
    border: 1px solid ${props.color}99;
    ${props.fade && `
      animation: dsxray-fade 1s forwards;
      animation-delay: .3s;
    `}
  `}
  z-index: 2147483646;
  pointer-events: none;
  transition: all 200ms;
`
SFrame.propTypes = {
  fade: PropTypes.bool,
}

const SToolbar = Box.extend`
  position: absolute;
  height: 30px;
  top: -34px;
  left: 0px;
  background: #00beef;
  width: 400px;
`

const SDescriptor = Box.extend`
  position: absolute;
  top: -16px;
  left: 0px;
  font-weight: bold;
  font-size: 12px;
  background: rgba(255,255,255,.8);
  white-space: nowrap;
`

const keyCodes = {
  left: 37,
  right: 39,
  down: 40,
  up: 38,
  enter: 13,
  a: 65,
  b: 66,
  c: 67,
  l: 76,
  m: 77,
  p: 80,
  r: 82,
  s: 83,
  t: 84,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
}
const resetBB = {top: 0, left: 0, width: 0, height: 0}
const DBL_CLICK_MS = 300;
class DOMInspector extends React.Component {

  state = {
    hoverBB: resetBB,
    editingElement: null,
    lastClick: 0,
    lastKeyPress: null,
  }

  componentDidMount() {
    document.onmouseover = (e) => this.handleMouseOver(e);
    document.onclick = (e) => this.handleClick(e);
    document.onkeydown = (e) => this.handleKeyDown(e);
  }

  componentWillUnmount() {
    document.onmouseover = null;
    document.onclick = null;
    document.onkeydown = null;
  }

  updateSelected = changes => {
    this.props.updateSelectedOverwrites(changes)
  }

  handleDeselect = () => {
    const { selected } = this.props;
    const { editingElement } = this.state;
    
    const el = document.querySelector(`.${selected.uid}`);
    
    if(editingElement === selected.uid) {
      el.setAttribute('contenteditable', 'false');
      el.classList.remove('dsxray-contenteditable');
      this.setState({ editingElement: null });

      if(selected.isTextNode && selected.innerHTML !== el.innerHTML) {
        this.props.updateOverwrites({[selected.uid]: { innerHTML: el.innerHTML }});
      }
    }
    this.props.setSelectedNode(null);
  }

  handleKeyDown = (e) => {
    if(!this.props.selected || e.target.isContentEditable || e.target.nodeName === 'INPUT') {
      if (e.which === keyCodes.enter && !e.shiftKey) {
        this.handleDeselect();
        e.preventDefault();
      }
      return;
    }
    const { lastKeyPress } = this.state;
    this.setState({lastKeyPress: e.which});
    
    if(e.altKey && this.handleControlHotkeys(e, lastKeyPress)) {
      e.preventDefault();
      return;
    }
    this.handleNextElementSelection(e);
    this.handleCopyPaste(e);
  }

  handleCopyPaste = (e) => {
    const { selected} = this.props;
    if(selected && e.metaKey && e.which === keyCodes.c) {
      this.props.setCopyNode(selected);
    } else if(selected && e.metaKey && e.which === keyCodes.v) {
      this.props.setPasteNode(selected);
    }
  }

  handleControlHotkeys(e, lastKeyPress) {
    const keyCombos = [
      {lastKey: keyCodes.m, key: keyCodes.t, control: 'marginT'},
      {lastKey: keyCodes.m, key: keyCodes.b, control: 'marginB'},
      {lastKey: keyCodes.m, key: keyCodes.l, control: 'marginL'},
      {lastKey: keyCodes.m, key: keyCodes.r, control: 'marginR'},
      {lastKey: keyCodes.m, key: keyCodes.x, control: 'marginLR'},
      {lastKey: keyCodes.m, key: keyCodes.y, control: 'marginTB'},
      {lastKey: keyCodes.m, key: keyCodes.a, control: 'marginTBLR'},

      {lastKey: keyCodes.p, key: keyCodes.t, control: 'paddingT'},
      {lastKey: keyCodes.p, key: keyCodes.b, control: 'paddingB'},
      {lastKey: keyCodes.p, key: keyCodes.l, control: 'paddingL'},
      {lastKey: keyCodes.p, key: keyCodes.r, control: 'paddingR'},
      {lastKey: keyCodes.p, key: keyCodes.x, control: 'paddingLR'},
      {lastKey: keyCodes.p, key: keyCodes.y, control: 'paddingTB'},
      {lastKey: keyCodes.p, key: keyCodes.a, control: 'paddingTBLR'},

      {key: keyCodes.t, control: 'text'},
      {key: keyCodes.s, control: 'font-size'},
      {key: keyCodes.w, control: 'font-weight'},
      {key: keyCodes.c, control: 'color'},
      {key: keyCodes.b, control: 'backgroundColor'},

      {key: keyCodes.up, action: {step: 1}},
      {key: keyCodes.down, action: {step: -1}},
      {key: keyCodes['0'], action: {level: 0}},
      {key: keyCodes['1'], action: {level: 1}},
      {key: keyCodes['2'], action: {level: 2}},
      {key: keyCodes['3'], action: {level: 3}},
      {key: keyCodes['4'], action: {level: 4}},
      {key: keyCodes['5'], action: {level: 5}},
      {key: keyCodes['6'], action: {level: 6}},
      {key: keyCodes['7'], action: {level: 7}},
      {key: keyCodes['8'], action: {level: 8}},
      {key: keyCodes['9'], action: {level: 9}},
    ]
    const validCombo = _.find(keyCombos, combo => (
      e.which === combo.key && (!combo.lastKey || combo.lastKey === lastKeyPress)
    ))
    if(validCombo) {
      if(validCombo.control) {
        this.props.setSelectedControl(validCombo.control);
      } else if(validCombo && validCombo.action) {
        this.props.popOverwrite(validCombo.action);
      }
    }

    return !!validCombo;
  }

  handleNextElementSelection(e) {
    const el = document.querySelector(`.${this.props.selected.uid}`) || {};
    let nextEl;
    if(e.which === keyCodes.left && el.previousElementSibling) {
      nextEl = el.previousElementSibling;
    } else if(e.which === keyCodes.right && el.nextElementSibling) {
      nextEl = el.nextElementSibling;
    } else if(e.which === keyCodes.up && el.parentElement) {
      nextEl = el.parentElement;
    } else if(e.which === keyCodes.down && el.firstElementChild) {
      nextEl = el.firstElementChild;
    }
    
    if(nextEl) {
      this.props.setSelectedNode(this.props.nodes[nextEl.dataset.uid]);
      e.preventDefault();
    }
  }

  handleClick = (e) => {
    const el = e.target;
    const node = this.props.nodes[el.dataset.uid];
    // isTrusted is false for simulated clicks
    if(!e.isTrusted || !node) 
      return;

    const { selected } = this.props;
    const { lastClick } = this.state;
    
    const time = new Date();
    const isDblClick = (time - lastClick) < DBL_CLICK_MS;
    const isSameElement = selected && selected.uid === node.uid;
    if(selected && !isSameElement) {
      this.handleDeselect();
    } else if(isDblClick && isSameElement && (node.isTextNode || node.isImageNode)) {
      if(node.isTextNode) {
        el.setAttribute('contenteditable', 'true');
        el.focus();
      } else if(node.isImageNode) {
        this.inputFile.click();
      }
      el.classList.add('dsxray-contenteditable');
      this.setState({editingElement: node.uid});
    }
    this.setState({lastClick: time});
    this.props.setSelectedNode(node);

    return e.shiftKey;
  }

  handleMouseOver = (e) => {
    const el = e.target;
    const node = this.props.nodes[el.dataset.uid];
    if(node) {
      this.setState({hoverBB: getBB(el)})
    }
  }

  handleMouseOut = (e) => {
    this.setState({hoverBB: resetBB})
  }

  handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    e.target.value = null;

    const { selected } = this.props;
    reader.onload = () => {
      if(selected.nodeName === 'img') {
        this.props.updateOverwrites({[selected.uid]: {src: reader.result}})
      } else {
        this.props.updateOverwrites({[selected.uid]: {backgroundImage: `url(${reader.result})`}})
      }
    };

    if(file) {
      reader.readAsDataURL(file);
    }
  }

  renderHiddenFileInput() {
    return (
      <input 
        type="file"
        id="dsxray-file-import"
        onChange={this.handleFile} style={{position: 'absolute', top: '-100em'}} 
        ref={ref => this.inputFile = ref}
      />
    )
  }

  render() {
    const { selected, nodes, mouseInsideMenu, overwrites } = this.props;
    const { hoverBB } = this.state;
    const hNode = nodes[hoverBB.uid]

    const style = hNode && {
      ...hNode.style,
      ...(overwrites[hNode.uid] || {})
    }
    return (
      <div>
        {hNode && 
          <SFrame color="#888888" style={this.state.hoverBB} fade={mouseInsideMenu}>
            <SDescriptor>
              {hNode.nodeName}
              {hNode.isTextNode &&
                <Text
                  is="span"
                  ml={1}
                  children={`${style.fontFamily} ${getWeightString(style.fontWeight)} ${style.fontSize}`}
                />
              }
            </SDescriptor>
          </SFrame>
        }
        {this.renderHiddenFileInput()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selected: getSelectedNode(state),
  overwrites: getOverwrites(state),
  nodes: getNodes(state),
  mouseInsideMenu: getMouseInsideMenu(state),
})

const mapDispatchToProps = {
  setSelectedNode,
  toggleShowSpacing,
  updateSelectedOverwrites,
  updateOverwrites,
  setSelectedControl,
  popOverwrite,
  setPasteNode,
  setCopyNode,
}

export default connect(mapStateToProps, mapDispatchToProps)(DOMInspector);