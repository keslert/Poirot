import React from 'react';
import { connect } from 'react-redux';
import { Box, Flex, Text } from 'rebass';
import MarginPaddingUI from './margin-padding';
import Select from 'react-select';
import TypographyPicker from './typography-picker';
import flatMap from 'lodash/flatMap';

import ColorPicker from './color-picker';
import ColorSwatch from './color-swatch';


const SLabel = Text.extend`
  text-transform: uppercase;
  font-size: 12px;
`
const SReset = Text.extend`
  font-size: 12px;
  color: ${props => props.theme.colors.red};
  margin-left: 4px;
  cursor: pointer;
`
const SCustom = Text.extend`
  font-size: 12px;
  margin-left: 4px;
  cursor: pointer;
  color: ${props => props.theme.colors[props.active ? 'red' : 'grey']};
`


const swatches = [
  ['#ffffff'],
  ['#000000', '#0d0e0e', '#252729', '#3d4144', '#555a5f', '#6e7479'],
  ['#747476', '#8e8e8f', '#a7a7a9', '#c1c1c2', '#dbdbdb', '#f4f4f5'],
  ['#d39100', '#ffb107', '#ffc13a', '#ffd16d', '#ffe1a0', '#fff1d3'],
  ['#21465d', '#2e6383', '#3b7fa9', '#5499c3', '#7ab0d0', '#a0c6dd', '#c5ddeb'],
  ['#812020', '#aa2a2a', '#ce3939', '#d86262', '#e28b8b', '#ecb4b4', '#f6dddd'],
  ['#223d3e', '#355e5e', '#477e7f', '#599FA0', '#78b3b4', '#99c6c6', '#bad8d8'],
]
class StyleMenu extends React.Component {

  updateSelected = changes => {
    const { selected, updateOverwrites } = this.props;
    updateOverwrites({[selected.uid]: changes})
  }

  handleResetTypography = () => this.handleSetTypography({fontFamily: null, fontWeight: null, fontSize: null});
  handleSetTypography = typography => {
    this.updateSelected({
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight,
      fontSize: typography.fontSize,
    })
  }

  handleResetColor = () => this.handleSetColor(null);
  handleSetColor = color => {
    this.updateSelected({color});
  }

  handleResetBackground = () => this.handleSetBackground(null);
  handleSetBackground = backgroundColor => {
    this.updateSelected({ backgroundColor });
  }

  handleResetMarginPadding = () => this.handleSetMarginPadding(_.fromPairs(allSpacing.map(s => [s, null])))
  handleSetMarginPadding = (changes) => {
    this.updateSelected(changes);
  }

  handleToggleCustomControl = key => _.memoize(() => {
    return this.props.toggleCustomControl(key);
  })

  _key = (key) => `${this.props.selected.uid}-${key}`

  render() {
    const { typography, selected, overwrites, customControl } = this.props;
    if(!selected) {
      return null;
    }

    const style = {...selected.style, ...(overwrites[selected.uid] || {})}

    const groups = flatMap(this.props.typography.categories, cat => cat.groups)

    return (
      <Flex p={2} direction="column">
        <Flex mb={2} direction="column">
          <Flex justify="space-between">
            <Flex>
              <SLabel children="Margin & Padding" />
              {_.some(allSpacing, spacing => selected.style[spacing] !== style[spacing]) &&
                <SReset children="reset" onClick={this.handleResetMarginPadding} />
              }
            </Flex>
            <SCustom 
              active={customControl[this._key('margin-padding')]} 
              onClick={this.handleToggleCustomControl(this._key('margin-padding'))}
              children="custom" 
            />
          </Flex>
          <Flex justify="center">
            <MarginPaddingUI 
              allowCustom={customControl[this._key('margin-padding')]}
              onChange={this.handleSetMarginPadding}
              style={style}
            />
          </Flex>
        </Flex>

        {selected.isTextNode && 
          <Flex mb={2} direction="column">
            <Flex justify="space-between">
              <Flex>
                <SLabel children="Text" />
                {_.some(['fontFamily', 'fontWeight', 'fontSize'], f => selected.style[f] !== style[f]) &&
                  <SReset children="reset" onClick={this.handleResetTypography} />
                }
              </Flex>
              <SCustom 
                active={customControl[this._key('text')]}
                onClick={this.handleToggleCustomControl(this._key('text'))}
                children="custom" 
              />
            </Flex>
            <Box flex={1}>
              <TypographyPicker 
                allowCustom={customControl[this._key('text')]}
                value={style}
                options={groups}
                onChange={this.handleSetTypography}
              />
            </Box>
          </Flex>
        }

        {selected.isTextNode && 
          <Flex mb={2} direction="column">
            <Flex justify="space-between">
              <Flex>
                <SLabel children="Text Color" />
                {selected.style.color !== style.color && 
                  <SReset children="reset" onClick={this.handleResetColor} />
                }
              </Flex>
              <SCustom 
                active={customControl[this._key('color')]}
                onClick={this.handleToggleCustomControl(this._key('color'))}
                children="custom" />
            </Flex>
            <ColorPicker 
              swatches={swatches} 
              color={style.color}
              onChange={this.handleSetColor}
              allowCustom={customControl[this._key('color')]}
            >
              <ColorSwatch color={style.color} />
            </ColorPicker>
          </Flex>
        }

        {!selected.isImageNode && 
          <Flex mb={2} direction="column">
            <Flex justify="space-between">
              <Flex>
                <SLabel children="Background" />
                {selected.style.backgroundColor !== style.backgroundColor && 
                  <SReset children="reset" onClick={this.handleResetBackground} />
                }
              </Flex>
              <SCustom 
                active={customControl[this._key('backgroundColor')]}
                onClick={this.handleToggleCustomControl(this._key('backgroundColor'))}
                children="custom" />
            </Flex>
            <ColorPicker 
              swatches={swatches} 
              color={style.backgroundColor}
              onChange={this.handleSetBackground}
              allowCustom={customControl[this._key('backgroundColor')]}
            >
              <ColorSwatch color={style.backgroundColor} />
            </ColorPicker>
          </Flex>
        }
        
      </Flex>
    )
  }
}

export default StyleMenu;

const allSpacing = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight']