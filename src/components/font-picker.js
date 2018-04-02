import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import GoogleFonts from '../data/google-fonts';
import { Box } from 'rebass';

const fonts = GoogleFonts.map(font => ({ label: font, value: font }));

class FontPicker extends React.Component {
  
  render() {
    const { value, onChange } = this.props;
    return (
      <div>
        <Select
          onChange={({ value }) => onChange(value)}
          options={fonts}
          clearable={false}
          value={{ label: value, value }}
          scrollMenuIntoView={false}
        />
      </div>
    )
  }
}
export default FontPicker;
// loadOptions={(input, cb) => cb(null, {options: fonts})}