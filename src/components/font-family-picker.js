import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import GoogleFonts from '../data/google-fonts';
import { getDS } from '../core/models/ds/selectors';
import VirtualizedSelect from 'react-virtualized-select';

const fonts = GoogleFonts.map(font => ({ label: font, value: font }));

class FontFamilyPicker extends React.Component {
  
  render() {

    const { value, options, onChange } = this.props;
    return (
      <VirtualizedSelect
        onChange={({ value }) => onChange(value)}
        options={options}
        clearable={false}
        value={{ label: value, value }}
        scrollMenuIntoView={false}
      />
    )
  }
}

const mapStateToProps = createSelector(
  getDS,
  (ds) => ({
    options: [
      ..._.chain(ds.typography.categories)
        .flatMap(cat => cat.groups.map(g => g.fontFamily))
        .uniq()
        .map(v => ({label: v, value: v}))
        .value(),
      ...fonts
    ]
  })
)

export default connect(mapStateToProps)(FontFamilyPicker);