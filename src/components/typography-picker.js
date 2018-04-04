import React from 'react';
import Select from 'react-select';

class TypographyPicker extends React.PureComponent {

  fontLabel = (font) => {
    return `${font.fontFamily} ${font.fontWeight} ${font.fontSize}`; 
  }

  render() {
    const { options=[], value={} } = this.props;
    return (
      <Select
        onChange={({ value }) => onChange(value)}
        options={options.map(value => ({label: this.fontLabel(value), value}))}
        clearable={false}
        value={{ label: this.fontLabel(value), value }}
        scrollMenuIntoView={false}
      />
    )
  }
}
export default TypographyPicker;