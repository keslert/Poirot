import React from 'react';
import { Box, Flex, Absolute, Relative, Text } from 'rebass';
import theme from '../styles/rebass-theme';
import tinycolor from 'tinycolor2';

const STriangle = Box.extend`
	width: 0;
  height: 0;
  ${props => `
    border-${props.show}: ${props.size}px solid ${props.color};
    border-${props.hide}: ${props.size}px solid transparent;
  `}
`

const SBar = Flex.extend`
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  cursor: ${props => props.vertical ? 'col' : 'row'}-resize;
  &:hover {
    opacity: 1;
  }
`


class MarginPaddingUI extends React.Component {
  render() {
    const { style } = this.props;


    const spacing = 2;
    const thickness = 18;
    const vLength = thickness * 6;
    const hLength = thickness * 8;
    const textOffset = thickness + 8;
    const width = hLength + thickness * 2 + spacing * 2;
    const height = vLength + thickness * 2 + spacing * 2;

    return (
      <Box p={textOffset + 4}>
        <Relative style={{width, height, fontSize: 10, userSelect: 'none'}}>
          <Absolute style={{top: 0, left: spacing}}>
            <Flex>
              <STriangle size={thickness} show="top" hide="left" color={theme.colors.marginTL} />
              <SBar style={{ width: hLength, height: thickness }} bg={theme.colors.marginTL}>
                <Absolute style={{ top: -thickness - 4 }} children={style.marginTop} />
                <Text color="rgba(0,0,0,.5)" children="margin" />
              </SBar>
              <STriangle size={thickness} show="top" hide="right" color={theme.colors.marginTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: thickness + vLength + spacing * 2, left: spacing }}>
            <Flex>
              <STriangle size={thickness} show="bottom" hide="left" color={theme.colors.marginBR} />
              <SBar style={{ width: hLength, height: thickness }} bg={theme.colors.marginBR}>
                <Absolute style={{ bottom: -thickness - 4 }} children={style.marginBottom} />
              </SBar>
              <STriangle size={thickness} show="bottom" hide="right" color={theme.colors.marginBR} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: spacing, left: 0 }}>
            <Flex direction="column">
              <STriangle size={thickness} show="left" hide="top" color={theme.colors.marginTL} />
              <SBar style={{ width: thickness, height: vLength }} bg={theme.colors.marginTL} vertical>
                <Absolute style={{ left: -textOffset }} children={style.marginLeft} />
              </SBar>
              <STriangle size={thickness} show="left" hide="bottom" color={theme.colors.marginTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: spacing, left: thickness + hLength + spacing * 2 }}>
            <Flex direction="column">
              <STriangle size={thickness} show="right" hide="top" color={theme.colors.marginBR} />
              <SBar style={{ width: thickness, height: vLength }} bg={theme.colors.marginBR} vertical>
                <Absolute style={{ right: -textOffset }} children={style.marginRight} />
              </SBar>
              <STriangle size={thickness} show="right" hide="bottom" color={theme.colors.marginBR} />
            </Flex>
          </Absolute>



          <Absolute style={{ top: thickness, left: thickness + spacing }}>
            <Flex>
              <STriangle size={thickness} show="top" hide="left" color={theme.colors.paddingTL} />
              <SBar style={{ width: hLength - thickness * 2, height: thickness }} bg={theme.colors.paddingTL}>
                <Absolute style={{ top: thickness + 4 }} children={style.paddingTop} />
                <Text color="rgba(0,0,0,.5)" children="padding" />
              </SBar>
              <STriangle size={thickness} show="top" hide="right" color={theme.colors.paddingTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: vLength + spacing * 2, left: thickness + spacing }}>
            <Flex>
              <STriangle size={thickness} show="bottom" hide="left" color={theme.colors.paddingBR} />
              <SBar style={{ width: hLength - thickness * 2, height: thickness }} bg={theme.colors.paddingBR}>
                <Absolute style={{ bottom: thickness + 4 }} children={style.paddingBottom} />
              </SBar>
              <STriangle size={thickness} show="bottom" hide="right" color={theme.colors.paddingBR} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: thickness + spacing, left: thickness }}>
            <Flex direction="column">
              <STriangle size={thickness} show="left" hide="top" color={theme.colors.paddingTL} />
              <SBar style={{ width: thickness, height: vLength - thickness * 2 }} bg={theme.colors.paddingTL} vertical>
                <Absolute style={{ left: textOffset }} children={style.paddingLeft} />
              </SBar>
              <STriangle size={thickness} show="left" hide="bottom" color={theme.colors.paddingTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: thickness + spacing, left: hLength + spacing * 2 }}>
            <Flex direction="column">
              <STriangle size={thickness} show="right" hide="top" color={theme.colors.paddingBR} />
              <SBar style={{ width: thickness, height: vLength - thickness * 2 }} bg={theme.colors.paddingBR} vertical>
                <Absolute style={{ right: textOffset }} children={style.paddingRight} />
              </SBar>
              <STriangle size={thickness} show="right" hide="bottom" color={theme.colors.paddingBR} />
            </Flex>
          </Absolute>
        </Relative>
      </Box>
    )
  }
}

export default MarginPaddingUI;