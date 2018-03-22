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

  render() {
    const styles = [
      ...this.props.visible.map(key => ({ selector: `.${key}`, css: 'background: #aaeeaa !important; }' })),
      // { selector: 'img', css: 'background: #aae !important; object-position: -99999px 99999px; }' },
      // { selector: 'svg', css: 'background: #f171ea !important; fill: transparent !important; color: transparent !important' },
      // { selector: '*[style*="background-image:"]', css: 'background: #00beef !important; }' },
      // { selector: '*[style*="background:url"]', css: 'background: #00beef !important; }' },
      // { selector: '.dsxray-text-node', css: 'background: #aaeeaa !important; }' },
    ]

    return (
      <div>
        <Style
          selector={`${this.superSpecificHammerTime}.dsxray-no-scroll`}
          css="overflow: hidden !important"
        />
        
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

const mapStateToProps = state => ({
  visible: getVisible(state),
  typography: getTypographyCategories(state),
})

const mapDispatchToProps = {
  addPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);