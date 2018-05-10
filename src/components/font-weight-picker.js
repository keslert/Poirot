import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';
import { getWeightString } from '../core/utils/text';

const weights = [100,200,300,400,500,600,700,800,900].map(weight => ({ 
  label: getWeightString(weight),
  value: weight,
}));

class FontWeightPicker extends React.Component {

  render() {
    const { value, onChange } = this.props;
    return (
      <div>
        <VirtualizedSelect
          onChange={({ value }) => onChange(value)}
          options={weights}
          clearable={false}
          value={{ label: getWeightString(value), value }}
          scrollMenuIntoView={false}
        />
      </div>
    )
  }
}
export default FontWeightPicker;