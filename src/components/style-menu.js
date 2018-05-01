import React from 'react';
import { connect } from 'react-redux';
import { Box, Flex, Text, Subhead } from 'rebass';
import MarginPaddingUI from './margin-padding';
import ColorPicker from './color-picker';
import ColorSwatch from './color-swatch';
import ShadowPicker from './shadow-picker';
import TypographyPicker from './typography-picker';
import Icon from './icon';
import theme from '../styles/rebass-theme';
import Toggle from './toggle';


const SLabel = Text.extend`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
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
  color: ${props => props.theme.colors[props.active ? 'red' : 'gray']};
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
    this.props.updateSelectedOverwrites(changes)
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

  handleResetBoxShadow = () => this.handleSetBoxShadow(null);
  handleSetBoxShadow = boxShadow => this.updateSelected({boxShadow});

  handleToggleCustomControl = _.memoize(key => () => this.props.toggleCustomControl(key));
  handleSetSelectedControl = _.memoize(key => () => this.props.setSelectedControl(key));
  handleSetSelectionMode = _.memoize(key => () => this.props.setSelectionMode(key));
  
  _key = (key) => `${this.props.selected.uid}-${key}`

  render() {
    const { typography, selected, overwrites, customControl, selectedControl, selectionMode } = this.props;
    if(!selected) {
      return null;
    }

    const style = {...selected.style, ...(overwrites[selected.uid] || {})}

    const groups = _.flatMap(this.props.typography.categories, cat => cat.groups)
    
    const symbolSelected = selectionMode === 'symbol';

    return (
      <Flex px={2} py={1} direction="column">
        <Flex mb={2} direction="column">
          <Flex align="center" mb={1}>
            <Subhead children={selected.nodeName} />
            <Box mx={1}><Icon name="chevron" size={10} /></Box>
            <Toggle
              color={theme.colors.purple}
              checked={symbolSelected}
              onClick={() => this.props.setSelectionMode(symbolSelected ? 'individual' : 'symbol')}
            />
            <Text ml={1}>Edit Similar Instances</Text>
            
          </Flex>
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

        {!selected.isTextNode && 
          <Flex mb={2} direction="column">
            <Flex justify="space-between">
              <Flex>
                <SLabel 
                  active={selectedControl === 'boxShadow'}
                  onClick={this.handleSetSelectedControl('boxShadow')}
                  children="Drop Shadow" 
                />
                {selected.style.boxShadow !== style.boxShadow && 
                  <SReset children="reset" onClick={this.handleResetBoxShadow} />
                }
              </Flex>
              <SCustom 
                active={customControl[this._key('boxShadow')]}
                onClick={this.handleToggleCustomControl(this._key('boxShadow'))}
                children="allow custom" />
            </Flex>
            <ShadowPicker 
              swatches={this.state.colorSwatches}
              value={style.boxShadow}
              onChange={this.handleSetBoxShadow}
              options={this.props.ds.shadows.defaults}
              allowCustom={customControl[this._key('boxShadow')]}
            />
          </Flex>
        }
        
      </Flex>
    )
  }
}

export default StyleMenu;

const allSpacing = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight']