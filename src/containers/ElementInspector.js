import React from 'react';
import { connect } from 'react-redux';
import { Box } from 'rebass';
import { hasParentWithUid } from '../core/utils/html';
import { getSelectedElements } from '../core/models/ui/selectors';
import { 
  setSelectedElements,
  toggleSelectedElements, 
  toggleShowSpacing,
  setEditingElements,
} from '../core/models/ui/actions';

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
`


const keyCodes = {
  left: 37,
  right: 39,
  down: 40,
  up: 38,
  shift: 65,
  m: 77,
}
const resetBB = {top: 0, left: 0, width: 0, height: 0}
const DBL_CLICK_MS = 300;
class ElementInspector extends React.Component {

  state = {
    hoverBB: resetBB,
    selectedBB: resetBB,
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

  handleKeyDown = (e) => {
    if (this.props.selected.length !== 1 || e.target.isContentEditable)
      return;

    if(e.which === keyCodes.m) {
      this.props.toggleShowSpacing();
    }

    const el = document.querySelector(`.${this.props.selected[0].uid}`) || {};
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
      this.props.setSelectedElements([getElementData(nextEl)]);
      e.preventDefault();
    }
  }


  handleClick = (e) => {
    const el = e.target;
    
    if(!e.isTrusted || hasParentWithUid(el, 'dsxray')) // isTrusted is false for simulated clicks
      return;

    
    const elData = getElementData(el);
    const selected = this.props.selected[0];
    const { editingElement, lastClick } = this.state;

    if(editingElement && editingElement !== elData.uid) {
      const el_ = document.querySelector(`.${editingElement}`);
      if(el_) {
        el_.setAttribute('contenteditable', 'false');
        el_.classList.remove('dsxray-contenteditable');
      }
      this.setState({editingElement: null});
    }
    
    const time = new Date();
    const isDblClick = (time - lastClick) < DBL_CLICK_MS;
    const isSameElement = elData.uid === selected.uid;
    if(isDblClick && isSameElement && (elData.isTextNode || elData.isImageNode)) {
      if(elData.isTextNode) {
        el.setAttribute('contenteditable', 'true');
        el.focus();
      } else if(elData.isImageNode) {
        this.inputFile.click();
      }
      el.classList.add('dsxray-contenteditable');
      this.setState({editingElement: elData.uid});
    }
    this.setState({lastClick: time});
    this.props.setSelectedElements([elData]);

    return e.shiftKey;
  }

  handleMouseOver = (e) => {
    const el = e.target;
    if(!hasParentWithUid(el, 'dsxray')) {
      this.setBB('hoverBB', getElementData(el));
    }
  }

  handleMouseOut = (e) => {
    this.setBB('hoverBB', resetBB)
  }
  
  setBB = (key, bb) => {
    this.setState({[key]: bb})
  }

  handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    e.target.value = null;
    const { editingElement } = this.state;
    reader.onload = () => {
      const el = document.querySelector(`.${editingElement}`);
      if(el.nodeName.toLowerCase() === 'img') {
        el.src = reader.result;
        el.srcset = reader.result;
      } else {
        el.style.backgroundImage = `url(${reader.result})`;
      }
    };

    if (file) {
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
    const { selected } = this.props;
    const { hoverBB } = this.state;
    return (
      <div>
        <SFrame color="#888888" style={this.state.hoverBB}>
          <SDescriptor>{hoverBB.nodeName}</SDescriptor>
        </SFrame>
        {selected.map(bb => 
          <SFrame 
            color={bb.uid === this.state.editingElement ? "#e91e63" : "#00beef"} 
            style={bb} 
            key={bb.uid}
            fade={bb.uid !== this.state.editingElement}
          >
            <SDescriptor>{bb.nodeName}</SDescriptor>
          </SFrame>
        )}
        {this.renderHiddenFileInput()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selected: getSelectedElements(state),
})

const mapDispatchToProps = {
  setSelectedElements,
  setEditingElements,
  toggleSelectedElements,
  toggleShowSpacing,
}

export default connect(mapStateToProps, mapDispatchToProps)(ElementInspector);

function getElementData(el, bb_) {
  const bb = bb_ || el.getBoundingClientRect();
  return {
    uid: el.dataset.uid,
    isTextNode: el.dataset.textNode,
    isImageNode: el.dataset.imageNode,
    nodeName: el.nodeName.toLowerCase(),
    width: bb.width,
    height: bb.height,
    top: bb.top + window.scrollY,
    left: bb.left + window.scrollX,
  }
}