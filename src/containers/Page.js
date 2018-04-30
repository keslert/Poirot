import React from 'react';
import Style from '../components/style';
import { connect } from 'react-redux';
import theme from '../styles/rebass-theme';
import { Box } from 'rebass';
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
  getTextNodes,
  getEphemerals,
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
    this.updateText(this.props);
    this.updateImages(this.props);
    this.updateRedlines(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateText(props);
    this.updateImages(props);
    if (!_.isEqual(props.overwrites, this.props.overwrites)) {
      this.updateRedlines(props);
    }
  }

  updateText = props => {
    props.textNodes.forEach(node => {
      const overwrites = props.overwrites[node.uid] || {};
      const innerHTML = props.hideChanges ? node.innerHTML : (overwrites.innerHTML || node.innerHTML);
      if(innerHTML !== node._innerHTML) {
        const el = document.querySelector(`.${node.uid}`);
        el.innerHTML = innerHTML;
        this.props._updateNode(node, { _innerHTML: innerHTML });
      }
    })
  }

  updateImages = props => {
    props.imageNodes.forEach(node => {
      const overwrites = props.overwrites[node.uid] || {};
      // Image src can't be overwritten in stylesheets so we have to manually override it.
      // We store src in _src so we can do reduce querySelectors.
      const src = props.hideChanges ? node.src : (overwrites.src || node.src);

      if (src !== node._src) {
        const el = document.querySelector(`.${node.uid}`);
        el.src = src;
        el.srcset = src;
        this.props._updateNode(node, { _src: src });
      }
    })
  }

  updateRedlines = props => {
    // Let the stylesheets update first so we know the new bounding boxes
    setTimeout(() => {
      const redlines = _.map(props.overwrites, (style, selector) => {
        const _style = _.pickBy({
          ..._.omit(style, ['backgroundImage', 'src', 'innerHTML']),
          image: (style.src || style.backgroundImage) ? 'updated' : undefined,
          text: (style.innerHTML) ? 'updated' : undefined,
        }, i => i);
        const el = document.querySelector(`.${selector}`);
        return {
          ...getBB(el),
          text: _.map(_style, (v, k) => `${camelcaseToHyphenated(k)}: ${v}`).join(', '),
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

    const _overwrites = _.merge(this.props.overwrites, this.props.ephemerals);
    const overwrites = _.chain(hideChanges ? {} : _overwrites).map((style, key) => [
      this.selector(`.${key}`), cleanCSS(style)
    ]).fromPairs().value();

    const visible = _.chain(this.props.visible).map(key => [
      this.selector(`.${key}`), {background: '#aaeeaaaa !important'}
    ]).fromPairs().value();

    const nodes = showSpacing ? [selectedNode, ...selectedChildNodes] : [];
    const spacing = _.chain(nodes).map(node => {
      const overwrites = this.props.overwrites[node.uid] || {};
      const ephemerals = this.props.ephemerals[node.uid] || {};
      const style = {...node.style, ...overwrites, ...ephemerals}
      return [
        this.selector(`.${node.uid}`), {
          'box-shadow': `
            ${style.boxShadow === 'none' ? '' : `${style.boxShadow},`}
            
            ${style.marginTop !== "0px" ? `0 -${style.marginTop} 0 0 ${theme.colors.marginTL}99,` : ''}
            ${style.marginBottom !== "0px" ? `0 ${style.marginBottom} 0 0 ${theme.colors.marginBR}99,` : ''}
            ${style.marginLeft !== "0px" ? `-${style.marginLeft} 0 0 0 ${theme.colors.marginTL}99,` : ''}
            ${style.marginRight !== "0px" ? `${style.marginRight} 0 0 0 ${theme.colors.marginBR}99,` : ''}

            ${style.paddingTop !== "0px" ? `inset 0 ${style.paddingTop} 0 0 ${theme.colors.paddingTL}99,` : ''}
            ${style.paddingBottom !== "0px" ? `inset 0 -${style.paddingBottom} 0 0 ${theme.colors.paddingBR}99,` : ''}
            ${style.paddingLeft !== "0px" ? `inset ${style.paddingLeft} 0 0 0 ${theme.colors.paddingTL}99,` : ''}
            ${style.paddingRight !== "0px" ? `inset -${style.paddingRight} 0 0 0 ${theme.colors.paddingBR}99,` : ''}
          `.trim().slice(0, -1)
        }
      ]
    }).fromPairs().value();

    return (
      <div>
        <Style css={{
          [this.selector('.dsxray-no-scroll', true)]: { overflow: 'hidden !important' },
          '.dsxray-contenteditable:focus, .dsxray-contenteditable:active': { outline: 'none' },
          '.dsxray-contenteditable::selection': { background: 'rgba(122,122,122,.15)' },
          '.Select-menu-outer': { 
            top: 'auto', 
            bottom: '100%',
            'border-bottom-right-radius': '0px',
            'border-bottom-left-radius': '0px',
            'border-top-right-radius': '4px',
            'border-top-left-radius': '4px',
            'border-bottom': 'none',
          },
          '.Select.is-open > .Select-control': {
            'border-bottom-right-radius': '4px',
            'border-bottom-left-radius': '4px',
            'border-top-right-radius': '0px',
            'border-top-left-radius': '0px',
          }
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
  textNodes: getTextNodes(state),
  selectedNode: getSelectedNode(state),
  selectedChildNodes: getSelectedChildNodes(state),
  showSpacing: getShowSpacing(state),
  showRedline: getShowRedline(state),
  hideChanges: getHideChanges(state),
  typography: getTypographyCategories(state),
  overwrites: getOverwrites(state),
  ephemerals: getEphemerals(state),
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