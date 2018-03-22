import React from 'react';
import Style from '../components/style';
import { connect } from 'react-redux';

import {
  getDOMNodes,
  getVisibleNodes,
  getTextNodes,
} from '../core/utils/html';
import { getVisible } from '../core/models/ui/selectors';
import { getTypographyCategories } from '../core/models/page/selectors';

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
      ...this.props.visible.map(key => ({ selector: `.${key}`, css: 'background: #aaeeaa !important; }' })),
      // { selector: 'img', css: 'background: #aae !important; object-position: -99999px 99999px; }' },
      // { selector: 'svg', css: 'background: #f171ea !important; fill: transparent !important; color: transparent !important' },
      // { selector: '*[style*="background-image:"]', css: 'background: #00beef !important; }' },
      // { selector: '*[style*="background:url"]', css: 'background: #00beef !important; }' },
      // { selector: '.dsxray-text-node', css: 'background: #aaeeaa !important; }' },
    ]

    const overwrites = _.chain(this.props.typography.overwrites).map((style, key) => [
      this.selector(`.${key}`), cleanCSS(style)
    ]).fromPairs().value();

    const visible = _.chain(this.props.visible).map(key => [
      this.selector(`.${key}`), {background: '#aaeeaa !important'}
    ]).fromPairs().value();

    return (
      <div>
        <Style css={{ [this.selector('.no-scroll', true)]: { overflow: 'hidden !important' } }} />
        <Style css={overwrites} />
        <Style css={visible} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visible: getVisible(state),
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