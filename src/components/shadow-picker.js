import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';
import { Flex, Box, Text } from 'rebass'; 
import NumericPicker from './numeric-picker';
import ColorPicker from './color-picker';
import theme from '../styles/rebass-theme';
import { parse, stringify } from 'css-box-shadow';
import ColorSwatch from './color-swatch';
import Toggle from './toggle';

class ShadowPicker extends React.Component {

  getLabel = (font) => {
    return `${font.fontFamily} ${font.fontWeight} ${font.fontSize}`; 
  }

  parseShadow = _.memoize(shadow => {
    if(shadow === 'none') {
      return {inset: false, offsetX: 0, offsetY: 0, blurRadius: 0, spreadRadius: 0, color: 'rgba(0,0,0,0)'};
    }
    return parse(shadow)[0];
  })

  onChange = (key, value) => {
    const shadow = this.parseShadow(this.props.value);
    this.props.onChange(stringify([{...shadow, [key]: value}]))
  }

  renderCustom() {
    const { value, onChange } = this.props;
    const shadow = this.parseShadow(value);
    return (
      <Flex>
        <Box>
          <Text children="Inset" />
          <Toggle 
            checked={shadow.inset}
            onClick={() => this.onChange('inset', !shadow.inset)}
            />
        </Box>
        <Box flex={1}>
          <Text children="Color" />
          <ColorPicker
            allowCustom={true}
            color={shadow.color}
            swatches={this.props.swatches}
            onChange={color => this.onChange('color', color)}
          >
            <ColorSwatch color={shadow.color} />
          </ColorPicker>
        </Box>
        <Box flex={1}>
          <Text children="X" />
          <NumericPicker 
            min={0}
            max={30}
            unit="px"
            value={shadow.offsetX}
            onChange={value => this.onChange('offsetX', value)}
          />
        </Box>
        <Box flex={1}>
          <Text children="Y" />
          <NumericPicker 
            min={0}
            max={30}
            unit="px"
            value={shadow.offsetY}
            onChange={value => this.onChange('offsetY', value)}
          />
        </Box>
        <Box flex={1}>
          <Text children="Blur" />
          <NumericPicker 
            min={0}
            max={30}
            unit="px"
            value={shadow.blurRadius}
            onChange={value => this.onChange('blurRadius', value)}
          />
        </Box>
        <Box flex={1}>
          <Text children="Spread" />
          <NumericPicker 
            min={0}
            max={30}
            unit="px"
            value={shadow.spreadRadius}
            onChange={value => this.onChange('spreadRadius', value)}
          />
        </Box>
      </Flex>
    )
  }

  render() {
    const { options, value, onChange, allowCustom } = this.props;
    return (
      allowCustom
      ? this.renderCustom()
      : <VirtualizedSelect
          onChange={({ value }) => onChange(value)}
          options={options.map(value => ({label: value, value}))}
          clearable={false}
          value={{ label: value, value }}
          scrollMenuIntoView={false}
        />
    )
  }
}
export default ShadowPicker;
