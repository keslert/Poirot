import React from 'react';
import Style from '../components/style';
import { connect } from 'react-redux';
import theme from '../styles/rebass-theme';
import { Box } from 'rebass';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { getBB } from '../core/utils/html';

const SRedline = Box.extend`
  position: absolute;
  pointer-events: none;
  ${props => `
    background: ${props.theme.colors.red}08;
    border: 1px solid ${props.theme.colors.red};
    &:after {
      content: "${props.text}";
      position: absolute;
      top: -18px;
      left: 0;
      color: ${props.theme.colors.red};
      font-size: 10px;
      background: rgba(255,255,255,0.8);
      white-space: nowrap;
    }
  `}
`

import { 
  getVisible,
  getShowSpacing,
  getSelectedNode,
  getSelectedChildNodes,
  getHideChanges,
  getShowRedline,
} from '../core/models/ui/selectors';

import { 
  getTypographyCategories, 
} from '../core/models/ds/selectors';

import { 
  getImageNodes,
  getOverwrites,
} from '../core/models/page/selectors';
import { 
  _updateNode,
} from '../core/models/page/actions';

class Page extends React.Component {

  state = {
    redlines: [],
  }

  componentDidMount() {
    const id = document.body.id || 'dsxray-body'
    document.body.id = id;
    // Some sites like to use !important liberally, so let's try and win
    // this specificity battle with 10 chained ids _and_ !important :)
    this.superSpecificHammerTime = `#${id}`.repeat(10);
    this.updateImages(this.props);
    this.updateRedlines(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateImages(props);
    if (!isEqual(props.overwrites, this.props.overwrites)) {
      this.updateRedlines(props);
    }
  }

  updateImages(props) {
    props.imageNodes.forEach(node => {
      const overwrites = props.overwrites[node.uid] || {};
      // Image src can't be overwritten in stylesheets so we have to manually override it.
      // We store src in _src so we can do reduce querySelectors.
      const src = props.hideChanges ? node.src : overwrites.src;

      if (src !== node._src) {
        const _src = src || node.src;
        const el = document.querySelector(`.${node.uid}`);
        el.src = _src;
        el.srcset = _src;
        this.props._updateNode(node, { _src });
      }
    })
  }

  updateRedlines(props) {
    // We need to update the stylesheets before we know the new bounding boxes
    setTimeout(() => {
      const redlines = map(props.overwrites, (style, selector) => {
        const el = document.querySelector(`.${selector}`);
        return {
          ...getBB(el),
          text: map(style, (v, k) => `${camelcaseToHyphenated(k)}: ${v}`).join(', '),
        }
      })
      this.setState({ redlines });
    }, 1)
  }

  selector(selector, noSpace) {
    return `${this.superSpecificHammerTime}${noSpace ? '' : ' '}${selector}`
  }

  render() {
    const { selectedNode, selectedChildNodes, showSpacing, showRedline, hideChanges } = this.props;

    // const overwrites = _.chain(this.props.typography.overwrites).map((style, key) => [
    //   this.selector(`.${key}`), cleanCSS(style)
    // ]).fromPairs().value();

    const overwrites = _.chain(hideChanges ? {} : this.props.overwrites).map((style, key) => [
      this.selector(`.${key}`), cleanCSS(style)
    ]).fromPairs().value();

    const visible = _.chain(this.props.visible).map(key => [
      this.selector(`.${key}`), {background: '#aaeeaaaa !important'}
    ]).fromPairs().value();

    const nodes = showSpacing ? [selectedNode, ...selectedChildNodes] : [];
    const spacing = _.chain(nodes).map(node => [
      this.selector(`.${node.uid}`), {
        'box-shadow': `
          ${node.style.boxShadow === 'none' ? '' : `${node.style.boxShadow},`}
          
          ${node.style.marginTop !== "0px" ? `0 -${node.style.marginTop} 0 0 ${theme.colors.marginTL}99,` : ''}
          ${node.style.marginBottom !== "0px" ? `0 ${node.style.marginBottom} 0 0 ${theme.colors.marginBR}99,` : ''}
          ${node.style.marginLeft !== "0px" ? `-${node.style.marginLeft} 0 0 0 ${theme.colors.marginTL}99,` : ''}
          ${node.style.marginRight !== "0px" ? `${node.style.marginRight} 0 0 0 ${theme.colors.marginBR}99,` : ''}

          ${node.style.paddingTop !== "0px" ? `inset 0 ${node.style.paddingTop} 0 0 ${theme.colors.paddingTL}99,` : ''}
          ${node.style.paddingBottom !== "0px" ? `inset 0 -${node.style.paddingBottom} 0 0 ${theme.colors.paddingBR}99,` : ''}
          ${node.style.paddingLeft !== "0px" ? `inset ${node.style.paddingLeft} 0 0 0 ${theme.colors.paddingTL}99,` : ''}
          ${node.style.paddingRight !== "0px" ? `inset -${node.style.paddingRight} 0 0 0 ${theme.colors.paddingBR}99,` : ''}
        `.trim().slice(0, -1)
      }
    ]).fromPairs().value();

    return (
      <div>
        <Style css={{
          [this.selector('.dsxray-no-scroll', true)]: { overflow: 'hidden !important' },
          '.dsxray-contenteditable:focus, .dsxray-contenteditable:active': { outline: 'none' },
          '.dsxray-contenteditable::selection': { background: 'rgba(122,122,122,.15)' },
          '.react-select__menu': { top: 'auto', bottom: '100%' },
        }} />
        <style>
          {`@keyframes dsxray-fade {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }`}
        </style>
        <Style css={overwrites} />
        <Style css={visible} />
        <Style css={spacing} />

        {showRedline && this.state.redlines.map((r, i) => 
          <SRedline key={r.uid} text={r.text} style={r} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visible: getVisible(state),
  imageNodes: getImageNodes(state),
  selectedNode: getSelectedNode(state),
  selectedChildNodes: getSelectedChildNodes(state),
  showSpacing: getShowSpacing(state),
  showRedline: getShowRedline(state),
  hideChanges: getHideChanges(state),
  typography: getTypographyCategories(state),
  overwrites: getOverwrites(state),
})

const mapDispatchToProps = {
  _updateNode,
}

function cleanCSS(style) {
  return _.chain(style).map((value, key) => [
    camelcaseToHyphenated(key),
    key === 'fontFamily' ? `'${value}' !important` : `${value} !important`,
  ]).fromPairs().value();
}

function camelcaseToHyphenated(str) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);