import React from 'react';
import { Box, Flex, Absolute, Relative } from 'rebass';
import theme from '../styles/rebass-theme';

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
`


class MarginPaddingUI extends React.Component {
  render() {
    const spacing = 2;
    const thickness = 16;
    const vLength = thickness * 5;
    const hLength = thickness * 7;
    const textOffset = thickness + 4;
    const width = hLength + thickness * 2 + spacing * 2;
    const height = vLength + thickness * 2 + spacing * 2;

    return (
      <Box p={textOffset + 4}>
        <Relative style={{width, height, fontSize: 12}}>
          <Absolute style={{top: 0, left: spacing}}>
            <Flex>
              <STriangle size={thickness} show="top" hide="left" color={theme.colors.marginTL} />
              <SBar style={{ width: hLength, height: thickness }} bg={theme.colors.marginTL}>
                <Relative style={{ top: -textOffset }} children="0" />
              </SBar>
              <STriangle size={thickness} show="top" hide="right" color={theme.colors.marginTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: thickness + vLength + spacing * 2, left: spacing }}>
            <Flex>
              <STriangle size={thickness} show="bottom" hide="left" color={theme.colors.marginBR} />
              <SBar style={{ width: hLength, height: thickness }} bg={theme.colors.marginBR}>
                <Relative style={{ bottom: -textOffset }} children="0" />
              </SBar>
              <STriangle size={thickness} show="bottom" hide="right" color={theme.colors.marginBR} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: spacing, left: 0 }}>
            <Flex direction="column">
              <STriangle size={thickness} show="left" hide="top" color={theme.colors.marginTL} />
              <SBar style={{ width: thickness, height: vLength }} bg={theme.colors.marginTL}>
                <Relative style={{ left: -textOffset }} children="0" />
              </SBar>
              <STriangle size={thickness} show="left" hide="bottom" color={theme.colors.marginTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: spacing, left: thickness + hLength + spacing * 2 }}>
            <Flex direction="column">
              <STriangle size={thickness} show="right" hide="top" color={theme.colors.marginBR} />
              <SBar style={{ width: thickness, height: vLength }} bg={theme.colors.marginBR}>
                <Relative style={{ right: -textOffset }} children="0" />
              </SBar>
              <STriangle size={thickness} show="right" hide="bottom" color={theme.colors.marginBR} />
            </Flex>
          </Absolute>



          <Absolute style={{ top: thickness, left: thickness + spacing }}>
            <Flex>
              <STriangle size={thickness} show="top" hide="left" color={theme.colors.paddingTL} />
              <SBar style={{ width: hLength - thickness * 2, height: thickness }} bg={theme.colors.paddingTL}>
                <Relative style={{ top: textOffset }} children={0} />
              </SBar>
              <STriangle size={thickness} show="top" hide="right" color={theme.colors.paddingTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: vLength + spacing * 2, left: thickness + spacing }}>
            <Flex>
              <STriangle size={thickness} show="bottom" hide="left" color={theme.colors.paddingBR} />
              <SBar style={{ width: hLength - thickness * 2, height: thickness }} bg={theme.colors.paddingBR}>
                <Relative style={{ bottom: textOffset }} children={0} />
              </SBar>
              <STriangle size={thickness} show="bottom" hide="right" color={theme.colors.paddingBR} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: thickness + spacing, left: thickness }}>
            <Flex direction="column">
              <STriangle size={thickness} show="left" hide="top" color={theme.colors.paddingTL} />
              <SBar style={{ width: thickness, height: vLength - thickness * 2 }} bg={theme.colors.paddingTL}>
                <Relative style={{ left: textOffset }} children={0} />
              </SBar>
              <STriangle size={thickness} show="left" hide="bottom" color={theme.colors.paddingTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: thickness + spacing, left: hLength + spacing * 2 }}>
            <Flex direction="column">
              <STriangle size={thickness} show="right" hide="top" color={theme.colors.paddingBR} />
              <SBar style={{ width: thickness, height: vLength - thickness * 2 }} bg={theme.colors.paddingBR}>
                <Relative style={{ right: textOffset }} children={0} />
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