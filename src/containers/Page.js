import React from 'react';
import Style from '../components/style';
import { connect } from 'react-redux';

import { getVisible } from '../core/models/ui/selectors';
import { getTypographyCategories, getNodes } from '../core/models/page/selectors';

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

    const styles = [
      // { selector: 'img', css: 'background: #aae !important; object-position: -99999px 99999px; }' },
      // { selector: 'svg', css: 'background: #f171ea !important; fill: transparent !important; color: transparent !important' },
      // { selector: '*[style*="background-image:"]', css: 'background: #00beef !important; }' },
      // { selector: '*[style*="background:url"]', css: 'background: #00beef !important; }' },
    ]

    const overwrites = _.chain(this.props.typography.overwrites).map((style, key) => [
      this.selector(`.${key}`), cleanCSS(style)
    ]).fromPairs().value();

    const visible = _.chain(this.props.visible).map(key => [
      this.selector(`.${key}`), {background: '#aaeeaaaa !important'}
    ]).fromPairs().value();

    const marginColor = 'rgba(255,152,0,.25)';
    const paddingColor = 'rgba(169,248,77,.25)';
    const spacing = _.chain(this.props.nodes).map(node => [
      this.selector(`.${node.uid}`), {
        'box-shadow': `
          ${node.style.boxShadow === 'none' ? '' : `${node.style.boxShadow},`}
          
          ${node.style.marginTop !== "0px" ? `0 -${node.style.marginTop} 0 0 #f7b1b699,` : ''}
          ${node.style.marginBottom !== "0px" ? `0 ${node.style.marginBottom} 0 0 #fad2b699,` : ''}
          ${node.style.marginLeft !== "0px" ? `-${node.style.marginLeft} 0 0 0 #f7b1b699,` : ''}
          ${node.style.marginRight !== "0px" ? `${node.style.marginRight} 0 0 0 #fad2b699,` : ''}

          ${node.style.paddingTop !== "0px" ? `inset 0 ${node.style.paddingTop} 0 0 #abd5d499,` : ''}
          ${node.style.paddingBottom !== "0px" ? `inset 0 -${node.style.paddingBottom} 0 0 #a2d09199,` : ''}
          ${node.style.paddingLeft !== "0px" ? `inset ${node.style.paddingLeft} 0 0 0 #abd5d499,` : ''}
          ${node.style.paddingRight !== "0px" ? `inset -${node.style.paddingRight} 0 0 0 #a2d09199,` : ''}
        `.trim().slice(0, -1)
      }
    ]).fromPairs().value();

    return (
      <div>
        <Style css={{ [this.selector('.dsxray-no-scroll', true)]: { overflow: 'hidden !important' } }} />
        <Style css={overwrites} />
        <Style css={visible} />
        {false && <Style css={spacing} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visible: getVisible(state),
  nodes: getNodes(state),
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