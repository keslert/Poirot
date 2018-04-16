import React from 'react';
import Select from 'react-select';
import range from 'lodash/range';

const sizes = range(8, 100).map(size => ({ label: `${size}px`, value: `${size}px` }));

class FontSizePicker extends React.Component {

  render() {
    const { value, onChange } = this.props;
    return (
      <div>
        <Select
          onChange={({ value }) => onChange(value)}
          options={sizes}
          clearable={false}
          value={{ label: value, value }}
          scrollMenuIntoView={false}
        />
      </div>
    )
  }
}
export default FontSizePicker;