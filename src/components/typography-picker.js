import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass'; 
import FontFamilyPicker from './font-family-picker';
import FontWeightPicker from './font-weight-picker';
import NumericPicker from './numeric-picker';
import theme from '../styles/rebass-theme';
import { getTextString } from '../core/utils/text';


const SOption = Box.extend`
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.colors.lightBlue}
  }
`

class TypographyPicker extends React.Component {

  renderCustom() {
    const { value, onChange } = this.props;

    return (
      <Flex>
        <Box flex={2}>
          <FontFamilyPicker 
            value={value.fontFamily}
            onChange={fontFamily => onChange({...value, fontFamily})}
          />
        </Box>
        <Box flex={2}>
          <FontWeightPicker
            value={value.fontWeight}
            onChange={fontWeight => onChange({ ...value, fontWeight })}
          />
        </Box>
        <Box flex={1}>
          <NumericPicker
            min={8}
            max={100}
            unit="px"
            value={value.fontSize}
            onChange={fontSize => onChange({ ...value, fontSize })}
          />
        </Box>
      </Flex>
    )
  }

  renderOption(props) {
    return (
      <SelectOption
        style={props.style}
        onHover={() => null}
        selectValue={props.selectValue}
        option={props.option}
        focusedOption={props.focusedOption}
        focusOption={props.focusOption}
      />
    );
  }

  handleOptionHeight = ({option}) => {
    return option.header ? 30 : 36;
  }

  render() {
    const { typography, value, onChange, allowCustom } = this.props;

    const options = _.flatMap(typography.categories, cat => [
      {label: cat.label, header: true},
      ...cat.groups,
    ])

    return (
      allowCustom
      ? this.renderCustom()
      : <VirtualizedSelect
          onChange={({ value }) => onChange(value)}
          options={options}
          optionRenderer={this.renderOption}
          optionHeight={this.handleOptionHeight}
          clearable={false}
          value={{ label: getTextString(value), value }}
          scrollMenuIntoView={false}
        />
    )
  }
}
export default TypographyPicker;


class SelectOption extends React.PureComponent {

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.selectValue({value: this.props.option});
  }

  renderHeader = () => {
    return (
      <Box 
        p={2}
        style={{...this.props.style, textTransform: 'uppercase', fontSize: 11, fontWeight: 700}} 
        bg={theme.colors.nearWhite}
        children={this.props.option.label}
      />
    )
  }

  renderOption = () => {
    const { option } = this.props;
    const label = option.unknown
      ? getTextString(option)
      : `${option.label}: ${getTextString(option)}`

    return (
      <SOption 
        py={2} 
        px={3}
        style={{...this.props.style, fontWeight: option.fontWeight}}
        onClick={this.handleClick}
        children={label}
      />
    );
  }

  render() {
    return this.props.option.header 
      ? this.renderHeader() 
      : this.renderOption();
  }
}

const focusedKeys = ['fontFamily', 'fontWeight', 'fontSize']
function isFocused(a, b) {
  return _.every(focusedKeys, key => a[key] === b[key]);
}