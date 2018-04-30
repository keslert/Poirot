import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';

class NumericPicker extends React.Component {

  render() {
    const { value, onChange, min, max, unit } = this.props;

    const options = getOptions(min, max, unit);
    return (
      <div>
        <VirtualizedSelect
          onChange={({ value }) => onChange(value)}
          options={options}
          clearable={false}
          value={{ label: value, value }}
          scrollMenuIntoView={false}
        />
      </div>
    )
  }
}
export default NumericPicker;

const getOptions = _.memoize((min, max, unit='') => (
  _.range(min, max).map(size => ({ label: `${size}${unit}`, value: `${size}${unit}` }))
))