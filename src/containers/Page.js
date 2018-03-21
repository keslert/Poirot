import React from 'react';
import Style from '../components/style';
import { connect } from 'react-redux';

import {
  getDOMNodes,
  getVisibleNodes,
  getTextNodes,
} from '../core/utils/html';

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

  render() {
    const styles = [
      // { selector: '*', css: 'background: transparent !important; color: #444 !important; }' },
      // { selector: 'img', css: 'background: #aae !important; object-position: -99999px 99999px; }' },
      // { selector: 'svg', css: 'background: #f171ea !important; fill: transparent !important; color: transparent !important' },
      // { selector: '*[style*="background-image:"]', css: 'background: #00beef !important; }' },
      // { selector: '*[style*="background:url"]', css: 'background: #00beef !important; }' },
      // { selector: '.dsxray-text-node', css: 'background: #aaeeaa !important; }' },
    ]

    return (
      <div>
        {styles.map(({selector, css}) => 
          <Style 
            key={selector}
            selector={this.superSpecificHammerTime + ` ${selector}`} 
            css={css} 
          />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  addPage,
}

export default connect(undefined, mapDispatchToProps)(Page);