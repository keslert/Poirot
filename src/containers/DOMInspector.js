import React from 'react';
import { connect } from 'react-redux';
import { Box, Text } from 'rebass';
import { getBB } from '../core/utils/html';
import { getSelectedNode } from '../core/models/ui/selectors';
import { getNodes } from '../core/models/page/selectors';
import { 
  updateNode, 
  updateOverwrites,
} from '../core/models/page/actions';
import { 
  setSelectedNode,
  toggleShowSpacing,
} from '../core/models/ui/actions';
import theme from '../styles/rebass-theme';

const SFrame = Box.extend`
  position: absolute;
  ${props => `
    color: ${props.color};
    background: ${props.color}08;
    border: 1px solid ${props.color}99;
    ${props.fade && `
      animation: dsxray-fade 1s forwards;
      animation-delay: 2s;
    `}
  `}
  z-index: 2147483646;
  pointer-events: none;
  transition: all 200ms;
`

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
  shift: 65,
  enter: 13,
  m: 77,
}
const resetBB = {top: 0, left: 0, width: 0, height: 0}
const DBL_CLICK_MS = 300;
class DOMInspector extends React.Component {

  state = {
    hoverBB: resetBB,
    selectedBB: resetBB,
    editingElement: null,
    lastClick: 0,
  }

  componentDidMount() {
    document.onmouseover = (e) => this.handleMouseOver(e);
    document.onclick = (e) => this.handleClick(e);
    document.onkeydown = (e) => this.handleKeyDown(e);
  }

  componentWillMount() {
    document.onmouseover = null;
    document.onclick = null;
    document.onkeydown = null;
  }

  componentWillUpdate(props) {
    const { selected } = this.props;

    if(props.selected && (!selected || props.selected.uid !== selected.uid)) {
      const el = document.querySelector(`.${props.selected.uid}`);
      this.setState({selectedBB: getBB(el)});
    }
  }

  updateSelected = changes => {
    const { selected, updateOverwrites } = this.props;
    this.props.updateOverwrites({[selected.uid]: changes})
  }

  handleDeselect() {
    const node = this.props.selected;
    const changes = {};
    const el = document.querySelector(`.${node.uid}`);
    
    if(node.isTextNode && node.textContent !== el.textContent) {
      this.props.updateNode(node, {
        _textContent: el.textContent,
      });
    }
    
    this.props.setSelectedNode(null);
  }

  handleKeyDown = (e) => {
    if(!this.props.selected || e.target.isContentEditable) {
      if (e.which === keyCodes.enter && !e.shiftKey) {
        this.handleDeselect();
        e.preventDefault();
        // TODO: Handle the possibility of new element creation.
      }
      return;
    }
      

    if(e.which === keyCodes.m) {
      this.props.toggleShowSpacing();
    }

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
    const uid = el.dataset.uid;
    const node = this.props.nodes[uid];
    // isTrusted is false for simulated clicks
    if(!e.isTrusted || !node) 
      return;

    const { selected } = this.props;
    const { editingElement, lastClick } = this.state;

    if(editingElement !== node.uid) {
      const el_ = document.querySelector(`.${editingElement}`);
      if(el_) {
        el_.setAttribute('contenteditable', 'false');
        el_.classList.remove('dsxray-contenteditable');
      }
      this.setState({editingElement: null});
    }
    
    const time = new Date();
    const isDblClick = (time - lastClick) < DBL_CLICK_MS;
    const isSameElement = selected && selected.uid === node.uid;
    if(isDblClick && isSameElement && (node.isTextNode || node.isImageNode)) {
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
        this.updateSelected({src: reader.result})
      } else {
        this.updateSelected({backgroundImage: `url(${reader.result})`})
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
    const { selected, nodes } = this.props;
    const { hoverBB, selectedBB } = this.state;
    const hNode = nodes[hoverBB.uid]
    return (
      <div>
        {hNode && 
          <SFrame color="#888888" style={this.state.hoverBB}>
            <SDescriptor>
              {hNode.nodeName}
              {hNode.isTextNode &&
                <Text
                  is="span"
                  ml={1}
                  children={`${hNode.style.fontFamily} ${hNode.style.fontWeight} ${hNode.style.fontSize}`}
                />
              }
            </SDescriptor>
          </SFrame>
        }
        
        {selected && 
          <SFrame 
            color={theme.colors[this.state.editingElement === selected.uid ? 'green' : 'blue']} 
            style={selectedBB}
            key={selected.uid}
            fade={this.state.editingElement !== selected.uid}
          >
            <SDescriptor>
              {selected.nodeName} 
              {selected.isTextNode && 
                <Text 
                  is="span" 
                  ml={1} 
                  children={`${selected.style.fontFamily} ${selected.style.fontWeight} ${selected.style.fontSize}`} 
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
  nodes: getNodes(state),
})

const mapDispatchToProps = {
  setSelectedNode,
  toggleShowSpacing,
  updateNode,
  updateOverwrites,
}

export default connect(mapStateToProps, mapDispatchToProps)(DOMInspector);