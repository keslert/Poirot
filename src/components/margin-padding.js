import React from 'react';
import { Box, Flex, Absolute, Relative, Text, Fixed } from 'rebass';
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
  font-weight: 600;
  cursor: ${props => props.vertical ? 'ew' : 'ns'}-resize;
  &:hover {
    opacity: 1;
  }
`


class MarginPaddingUI extends React.Component {

  state = {
    dragging: null,
  }

  componentWillMount() {
    this.updateStyle(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateStyle(props);
  }

  updateStyle(props) {
    this.setState({style: _.pick(props.style, styleKeys)});
  }

  handleDragStart = (e, type, direction, sides) => {
    const startOffset = Number.parseInt(this.props.style[`${type}${_.capitalize(sides[0])}`])

    const _sides = e.shiftKey 
      ? allSides 
      : e.altKey 
        ? _.flatMap(sides, side => [side, opposites[side]])
        : sides

    this.props.setSelectedControl(`${type}${_sides.map(s => _.capitalize(s[0]))}`);
    this.setState({
      dragging: direction,
      point: {x: e.pageX, y: e.pageY},
      startOffset,
      type,
      sides: _sides,
    });
  }

  handleDragEnd = (e) => {
    this.setState({dragging: null});
    this.props.onChange(this.state.style);
  }

  handleDrag = (e) => {
    const { spacing, allowCustom } = this.props;
    const { point, type, sides, dragging, startOffset } = this.state;
    const diff = Math.floor(dragging === 'col' ? e.pageX - point.x : point.y - e.pageY);
    let offset = startOffset + diff;
    if(type === 'padding') {
      offset = Math.max(0, offset);
    }
    
    if(!allowCustom) {
      const absOffset = Math.abs(offset);
      offset = _.sortBy(spacing, s => Math.abs(s - absOffset))[0] * (offset < 0 ? -1 : 1);
    }
    
    const changes = _.fromPairs(sides.map(side => [
      `${type}${_.capitalize(side)}`, `${offset}px`
    ]))

    this.setState({style: {...this.state.style, ...changes}});
  }

  handleDragMT = e => this.handleDragStart(e, 'margin', 'row', ['top']);
  handleDragMB = e => this.handleDragStart(e, 'margin', 'row', ['bottom']);
  handleDragML = e => this.handleDragStart(e, 'margin', 'col', ['left']);
  handleDragMR = e => this.handleDragStart(e, 'margin', 'col', ['right']);
  handleDragPT = e => this.handleDragStart(e, 'padding', 'row', ['top']);
  handleDragPB = e => this.handleDragStart(e, 'padding', 'row', ['bottom']);
  handleDragPL = e => this.handleDragStart(e, 'padding', 'col', ['left']);
  handleDragPR = e => this.handleDragStart(e, 'padding', 'col', ['right']);

  render() {
    const { activeControls } = this.props;
    const { style } = this.state;

    const spacing = 2;
    const thickness = 18;
    const vLength = thickness * 5;
    const hLength = thickness * 8;
    const textOffset = thickness + 12;
    const width = hLength + thickness * 2 + spacing * 2;
    const height = vLength + thickness * 2 + spacing * 2;

    return (
      <Box p={textOffset + 4}>
        <Relative style={{width, height, fontSize: 10, userSelect: 'none'}}>
          <Absolute style={{top: 0, left: spacing}}>
            <Flex>
              <STriangle size={thickness} show="top" hide="left" color={theme.colors.marginTL} />
              <SBar style={{ width: hLength, height: thickness }} bg={theme.colors.marginTL} onMouseDown={this.handleDragMT}>
                <Absolute 
                  style={{ top: -thickness - 4 }} 
                  color={_.includes(activeControls.margin, "T") && theme.colors.blue}
                  children={style.marginTop} 
                />
                <Text f={0} color="rgba(0,0,0,.5)" children="margin" />
              </SBar>
              <STriangle size={thickness} show="top" hide="right" color={theme.colors.marginTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: thickness + vLength + spacing * 2, left: spacing }}>
            <Flex>
              <STriangle size={thickness} show="bottom" hide="left" color={theme.colors.marginBR} />
              <SBar style={{ width: hLength, height: thickness }} bg={theme.colors.marginBR} onMouseDown={this.handleDragMB}>
                <Absolute 
                  style={{ bottom: -thickness - 4 }} 
                  color={_.includes(activeControls.margin, "B") && theme.colors.blue}
                  children={style.marginBottom} 
                />
              </SBar>
              <STriangle size={thickness} show="bottom" hide="right" color={theme.colors.marginBR} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: spacing, left: 0 }}>
            <Flex direction="column">
              <STriangle size={thickness} show="left" hide="top" color={theme.colors.marginTL} />
              <SBar style={{ width: thickness, height: vLength }} bg={theme.colors.marginTL} vertical onMouseDown={this.handleDragML}>
                <Absolute 
                  style={{ left: -textOffset }} 
                  color={_.includes(activeControls.margin, "L") && theme.colors.blue}
                  children={style.marginLeft} 
                />
              </SBar>
              <STriangle size={thickness} show="left" hide="bottom" color={theme.colors.marginTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: spacing, left: thickness + hLength + spacing * 2 }}>
            <Flex direction="column">
              <STriangle size={thickness} show="right" hide="top" color={theme.colors.marginBR} />
              <SBar style={{ width: thickness, height: vLength }} bg={theme.colors.marginBR} vertical onMouseDown={this.handleDragMR}>
                <Absolute 
                  style={{ right: -textOffset }} 
                  color={_.includes(activeControls.margin, "R") && theme.colors.blue}
                  children={style.marginRight} 
                />
              </SBar>
              <STriangle size={thickness} show="right" hide="bottom" color={theme.colors.marginBR} />
            </Flex>
          </Absolute>



          <Absolute style={{ top: thickness, left: thickness + spacing }}>
            <Flex>
              <STriangle size={thickness} show="top" hide="left" color={theme.colors.paddingTL} />
              <SBar style={{ width: hLength - thickness * 2, height: thickness }} bg={theme.colors.paddingTL} onMouseDown={this.handleDragPT}>
                <Absolute 
                  style={{ top: thickness + 4 }} 
                  color={_.includes(activeControls.padding, "T") && theme.colors.blue}
                  children={style.paddingTop} 
                />
                <Text f={0} color="rgba(0,0,0,.5)" children="padding" />
              </SBar>
              <STriangle size={thickness} show="top" hide="right" color={theme.colors.paddingTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: vLength + spacing * 2, left: thickness + spacing }}>
            <Flex>
              <STriangle size={thickness} show="bottom" hide="left" color={theme.colors.paddingBR} />
              <SBar style={{ width: hLength - thickness * 2, height: thickness }} bg={theme.colors.paddingBR} onMouseDown={this.handleDragPB}>
                <Absolute 
                  style={{ bottom: thickness + 4 }} 
                  color={_.includes(activeControls.padding, "B") && theme.colors.blue}
                  children={style.paddingBottom} 
                />
              </SBar>
              <STriangle size={thickness} show="bottom" hide="right" color={theme.colors.paddingBR} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: thickness + spacing, left: thickness }}>
            <Flex direction="column">
              <STriangle size={thickness} show="left" hide="top" color={theme.colors.paddingTL} />
              <SBar style={{ width: thickness, height: vLength - thickness * 2 }} bg={theme.colors.paddingTL} vertical onMouseDown={this.handleDragPL}>
                <Absolute 
                  style={{ left: textOffset }} 
                  color={_.includes(activeControls.padding, "L") && theme.colors.blue}
                  children={style.paddingLeft}
                />
              </SBar>
              <STriangle size={thickness} show="left" hide="bottom" color={theme.colors.paddingTL} />
            </Flex>
          </Absolute>

          <Absolute style={{ top: thickness + spacing, left: hLength + spacing * 2 }}>
            <Flex direction="column">
              <STriangle size={thickness} show="right" hide="top" color={theme.colors.paddingBR} />
              <SBar style={{ width: thickness, height: vLength - thickness * 2 }} bg={theme.colors.paddingBR} vertical onMouseDown={this.handleDragPR}>
                <Absolute 
                  style={{ right: textOffset }} 
                  color={_.includes(activeControls.padding, "R") && theme.colors.blue}
                  children={style.paddingRight} 
                />
              </SBar>
              <STriangle size={thickness} show="right" hide="bottom" color={theme.colors.paddingBR} />
            </Flex>
          </Absolute>
        </Relative>
        {this.state.dragging && 
          <Fixed 
            style={{top: 0, left: 0, height: '100vh', width: '100vw', cursor: `${this.state.dragging}-resize`}} 
            onMouseMove={this.handleDrag} 
            onMouseUp={this.handleDragEnd} 
          />
        }
      </Box>
    )
  }
}

export default MarginPaddingUI;

const allSides = ['top', 'bottom', 'left', 'right'];
const opposites = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const styleKeys = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];