import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';

const weights = [100,200,300,400,500,600,700,800,900].map(weight => ({ label: weight, value: weight }));

class FontWeightPicker extends React.Component {

  render() {
    const { value, onChange } = this.props;
    return (
      <div>
        <VirtualizedSelect
          onChange={({ value }) => onChange(value)}
          options={weights}
          clearable={false}
          value={{ label: value, value }}
          scrollMenuIntoView={false}
        />
      </div>
    )
  }
}
export default FontWeightPicker;