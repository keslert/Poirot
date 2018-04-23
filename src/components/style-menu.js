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
  color: ${props => props.theme.colors[props.active ? 'blue' : 'black']};
  cursor: pointer;
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

class StyleMenu extends React.Component {

  state = {}

  componentDidMount() {
    this.updateSwatches(this.props.ds);
  }

  componentWillReceiveProps(props) {
    if(props.ds !== this.props.ds) {
      this.updateSwatches(props.ds);
    }
  }

  updateSwatches = ds => {
    this.setState({
      backgroundSwatches: _.map(ds.colors.swatches, swatch => swatch.colors.map(c => c.value)),
      colorSwatches: _.map(ds.colors.swatches, swatch => swatch.colors.map(c => c.value)),
    })

  }

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

  handleToggleCustomControl = key => _.memoize(() => this.props.toggleCustomControl(key))
  handleSetSelectedControl = key => _.memoize(() => this.props.setSelectedControl(key));
  
  _key = (key) => `${this.props.selected.uid}-${key}`

  render() {
    const { typography, selected, overwrites, customControl, selectedControl } = this.props;
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
              children="allow custom" 
            />
          </Flex>
          <Flex justify="center">
            <MarginPaddingUI
              activeControls={{
                margin: _.startsWith(selectedControl, 'margin') ? selectedControl.slice(6).split('') : {},
                padding: _.startsWith(selectedControl, 'padding') ? selectedControl.slice(7).split('') : {},
              }}
              allowCustom={customControl[this._key('margin-padding')]}
              onChange={this.handleSetMarginPadding}
              spacing={this.props.ds.spacing.defaults}
              style={style}
            />
          </Flex>
        </Flex>

        {selected.isTextNode && 
          <Flex mb={2} direction="column">
            <Flex justify="space-between">
              <Flex>
                <SLabel 
                  active={selectedControl === 'text'}
                  onClick={this.handleSetSelectedControl('text')}
                  children="Text" 
                />
                {_.some(['fontFamily', 'fontWeight', 'fontSize'], f => selected.style[f] !== style[f]) &&
                  <SReset children="reset" onClick={this.handleResetTypography} />
                }
              </Flex>
              <SCustom 
                active={customControl[this._key('text')]}
                onClick={this.handleToggleCustomControl(this._key('text'))}
                children="allow custom" 
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
                <SLabel 
                  active={selectedControl === 'color'}
                  onClick={this.handleSetSelectedControl('color')}
                  children="Text Color" 
                />
                {selected.style.color !== style.color && 
                  <SReset children="reset" onClick={this.handleResetColor} />
                }
              </Flex>
              <SCustom 
                active={customControl[this._key('color')]}
                onClick={this.handleToggleCustomControl(this._key('color'))}
                children="allow custom" />
            </Flex>
            <ColorPicker 
              swatches={this.state.colorSwatches} 
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
                <SLabel 
                  active={selectedControl === 'backgroundColor'}
                  onClick={this.handleSetSelectedControl('backgroundColor')}
                  children="Background" 
                />
                {selected.style.backgroundColor !== style.backgroundColor && 
                  <SReset children="reset" onClick={this.handleResetBackground} />
                }
              </Flex>
              <SCustom 
                active={customControl[this._key('backgroundColor')]}
                onClick={this.handleToggleCustomControl(this._key('backgroundColor'))}
                children="allow custom" />
            </Flex>
            <ColorPicker 
              swatches={this.state.backgroundSwatches} 
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