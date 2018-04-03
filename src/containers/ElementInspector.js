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
    background: ${props.color}08;
    border: 1px solid ${props.color}99;
  `}
  z-index: 2147483646;
  pointer-events: none;
  transition: all 200ms;
`

const SToolbar = Box.extend`
  position: absolute;
  height: 30px;
  top: -32px;
  left: -2px;
  background: #00beef;
  width: 400px;
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
const DBL_CLICK_MS = 200;
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
    const elData = getElementData(el);
    const selected = this.props.selected[0];
    const { editingElement, lastClick } = this.state;

    if(editingElement && editingElement !== elData.uid) {
      const el_ = document.querySelector(`.${editingElement}`);
      el_.setAttribute('contenteditable', 'false');
      el_.classList.remove('dsxray-contenteditable');
      this.setState({editingElement: null});
    }

    
    const time = new Date();
    const isDblClick = (time - lastClick) < DBL_CLICK_MS;
    const isSameElement = elData.uid === selected.uid;
    if(isDblClick && isSameElement && elData.isTextNode) {
      el.setAttribute('contenteditable', 'true');
      el.classList.add('dsxray-contenteditable');
      this.setState({editingElement: elData.uid});
      el.focus();
    }
    
    this.setState({lastClick: time});
    
    if (!hasParentWithUid(el, 'dsxray')) {
      this.props.setSelectedElements([elData]);
    }
    return e.shiftKey;
  }

  handleMouseOver = (e) => {
    const el = e.target;
    if(!hasParentWithUid(el, 'dsxray')) {
      this.setBB('hoverBB', el.getBoundingClientRect());
    }
  }

  handleMouseOut = (e) => {
    this.setBB('hoverBB', resetBB)
  }
  
  setBB = (key, bb) => {
    this.setState({[key]: {
      width: bb.width,
      height: bb.height,
      top: bb.top + window.scrollY,
      left: bb.left + window.scrollX,
    }})
  }

  render() {
    const { selected } = this.props;
    return (
      <div>
        <SFrame color="#888888" style={this.state.hoverBB} />,
        {selected.map(bb => 
          <SFrame color={bb.uid === this.state.editingElement ? "#e91e63" : "#00beef"} style={bb} key={bb.uid}>
            {false && <SToolbar />}
          </SFrame>,
        )}
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
    width: bb.width,
    height: bb.height,
    top: bb.top + window.scrollY,
    left: bb.left + window.scrollX,
  }
}