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
`


const colors = ['#00beef', '#c0ffee', '#fff000']
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

  render() {
    const { typography, selected, overwrites } = this.props;
    if(!selected) {
      return null;
    }

    const style = {...selected.style, ...(overwrites[selected.uid] || {})}

    const groups = flatMap(this.props.typography.categories, cat => cat.groups)

    return (
      <Flex p={2} direction="column">
        <Flex justify="center">
          <MarginPaddingUI 
            style={style}
          />
        </Flex>

        {selected.isTextNode && 
          <Flex mb={2} direction="column">
            <Flex>
              <SLabel children="Text" />
              {(selected.style.fontFamily !== style.fontFamily || selected.style.fontWeight !== style.fontWeight || selected.style.fontSize !== style.fontSize) && 
                <SReset children="reset" onClick={this.handleResetTypography} />
              }
              <SCustom children="custom" />
            </Flex>
            <Box flex={1}>
              <TypographyPicker 
                value={style}
                options={groups}
                onChange={this.handleSetTypography}
              />
            </Box>
          </Flex>
        }

        {selected.isTextNode && 
          <Flex mb={2} direction="column">
            <Flex>
              <SLabel children="Text Color" />
              {selected.style.color !== style.color && 
                <SReset children="reset" onClick={this.handleResetColor} />
              }
              <SCustom children="custom" />
            </Flex>
            <ColorPicker colors={colors} color={style.color} onChange={this.handleSetColor}>
              <ColorSwatch color={style.color} />
            </ColorPicker>
          </Flex>
        }

        {!selected.isImageNode && 
          <Flex mb={2} direction="column">
            <Flex>
              <SLabel children="Background" />
              {selected.style.backgroundColor !== style.backgroundColor && 
                <SReset children="reset" onClick={this.handleResetBackground} />
              }
              <SCustom children="custom" />
            </Flex>
            <ColorPicker colors={colors} color={style.backgroundColor} onChange={this.handleSetBackground}>
              <ColorSwatch color={style.backgroundColor} />
            </ColorPicker>
          </Flex>
        }
        
      </Flex>
    )
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(StyleMenu);