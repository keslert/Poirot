import React from 'react';
import Style from '../components/style';
import { connect } from 'react-redux';
import theme from '../styles/rebass-theme';

import { 
  getVisible,
  getShowSpacing,
} from '../core/models/ui/selectors';

import { 
  getTypographyCategories, 
  getSelectedNodes,
  getSelectedChildNodes,
} from '../core/models/page/selectors';

import { addPage } from '../core/models/page/actions';
import { parseAndTagPage } from '../core/utils/ds';

class Page extends React.Component {

  componentWillMount() {
    const id = document.body.id || 'dsxray-body'
    document.body.id = id;
    // Some sites like to use !important liberally, so let's try and win
    // this specificity battle with 10 chained ids _and_ !important :)
    this.superSpecificHammerTime = `#${id}`.repeat(10);

    const page = parseAndTagPage();
    this.props.addPage(page);
  }

  selector(selector, noSpace) {
    return `${this.superSpecificHammerTime}${noSpace ? '' : ' '}${selector}`
  }

  render() {
    const { selectedNodes, selectedChildNodes, showSpacing } = this.props;

    const overwrites = _.chain(this.props.typography.overwrites).map((style, key) => [
      this.selector(`.${key}`), cleanCSS(style)
    ]).fromPairs().value();

    const visible = _.chain(this.props.visible).map(key => [
      this.selector(`.${key}`), {background: '#aaeeaaaa !important'}
    ]).fromPairs().value();

    const nodes = showSpacing ? [...selectedNodes, ...selectedChildNodes] : [];
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visible: getVisible(state),
  selectedNodes: getSelectedNodes(state),
  selectedChildNodes: getSelectedChildNodes(state),
  showSpacing: getShowSpacing(state),
  typography: getTypographyCategories(state),
})

const mapDispatchToProps = {
  addPage,
}

function cleanCSS(style) {
  return _.chain(style).map((value, key) => [
    camelcaseToHyphenated(key),
    key === 'fontFamily' ? `'${value}'` : value
  ]).fromPairs().value();
}

function camelcaseToHyphenated(str) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);