import React from 'react';
import ReactDOM from 'react-dom';
import { Flex, Box, Text } from 'rebass';
import Rotate from './rotate';
import Toggle from './toggle';
import Input from './input';
import difference from 'lodash/difference';
import FontPicker from './font-picker';

const Table = Box.extend`
  border-collapse: separate;
  border-spacing: 0 1px;
  width: 100%;
  td {
    padding: 4px;
  }
  th {
    padding: 4px;
    font-size: 10px;
    text-align: left;
    text-transform: uppercase;
    font-weight: bold;
    background: #ddd;
  }
`

class TypographyTable extends React.Component {

  state = {
    open: {
      unknown: true,
      // 'dsxray-lato-600-14px': true,
    },
  }

  handleToggleOpen = (key) => {
    this.setState({open: {...this.state.open,
      [key]: !this.state.open[key]
    }})
  }

  handleToggleVisible = (key) => {
    this.props.toggleVisible([key]);
  }

  handleToggleCategoryVisibile = (cat) => {
    const groups = cat.groups.map(g => g.key);
    const notVisible = difference(groups, this.props.visible)
    this.props.toggleVisible(notVisible.length ? notVisible : groups)
  }

  handleScrollToNode = (node) => {
    const el = document.querySelector(`.${node.uid}`)
    el.scrollIntoView();
  }

  handleCategoryUpdate = (category, key, value) => {

  }

  handleGroupUpdate = (group, key, value) => {

  }

  renderHeader() {
    return (
      <tr>
        <th colSpan={3} />
        <th>Font</th>
        <th>Size</th>
        <th>Weight</th>
        <th>L.Height</th>
        <th>L.Spacing</th>
      </tr>
    )
  }

  renderCategoryRow = (category, hideToggle) => {
    const key = category.key;
    const isVisible = category.groups && difference(category.groups.map(g => g.key), this.props.visible).length === 0
    return (
      <tr style={{background: '#f4f4f4'}} key={key}>
        <td style={{ fontSize: 12, textAlign: 'center', cursor: 'pointer' }} onClick={() => this.handleToggleOpen(key)}>
          {category.groups && <Rotate rotated={this.state.open[key]}>▶</Rotate>}
        </td>
        <td>{!hideToggle && 
          <Toggle checked={isVisible} onClick={() => this.handleToggleCategoryVisibile(category)} />
        }</td>
        <td style={{fontSize: 15, fontWeight: 'bold'}}>
          {category.label} <Text is="span" fontWeight={400}>{category.groups ? `(${category.groups.length})` : ''}</Text>
        </td>
        <td>
          <FontPicker 
            value={category.fontFamily}
            onChange={(e) => this.handleCategoryUpdate(key, 'font', e.target.value)} 
          />
        </td>
        <td>
          <Input
            value={category.fontSize} 
            onChange={(e) => this.handleCategoryUpdate(key, 'size', e.target.value)} 
          />
        </td>
        <td>
          <Input 
            value={category.fontWeight} 
            onChange={(e) => this.handleCategoryUpdate(key, 'weight', e.target.value)} 
          />
        </td>
        <td>
          <Input 
            value={category.lineHeight} 
            onChange={(e) => this.handleCategoryUpdate(key, 'lineHeight', e.target.value)} 
          />
        </td>
        <td>
          <Input 
            value={category.letterSpacing} 
            onChange={(e) => this.handleCategoryUpdate(key, 'letterSpacing', e.target.value)} 
          />
        </td>
      </tr>
    )
  }

  renderGroupRow = (group) => {
    const key = group.key;
    const hasNodes = group.nodes && !!group.nodes.length;
    return (
      <tr key={key}>
        <td style={{ fontSize: 10, textAlign: 'center', cursor: 'pointer' }} onClick={() => this.handleToggleOpen(key)}>
          {hasNodes && <Rotate rotated={this.state.open[key]}>▶</Rotate>}
        </td>
        <td>
          {hasNodes && 
            <Toggle checked={this.props.visible.includes(key)} onClick={() => this.handleToggleVisible(key)} />
          }
        </td>
        <td style={{ fontSize: 13, fontWeight: 'bold'}}>
          {group.label} <Text is="span" fontWeight={400}>{group.nodes ? `(${group.nodes.length})` : ''}</Text>
        </td>
        <td>
          <Input
            value={group.fontFamily}
            onChange={(e) => this.handleGroupUpdate(key, 'font', e.target.value)}
          />
        </td>
        <td>
          <Input
            value={group.fontSize}
            onChange={(e) => this.handleGroupUpdate(key, 'size', e.target.value)}
          />
        </td>
        <td>
          <Input
            value={group.fontWeight}
            onChange={(e) => this.handleGroupUpdate(key, 'weight', e.target.value)}
          />
        </td>
        <td>
          <Input
            value={group.lineHeight}
            onChange={(e) => this.handleGroupUpdate(key, 'lineHeight', e.target.value)}
          />
        </td>
        <td>
          <Input
            value={group.letterSpacing}
            onChange={(e) => this.handleGroupUpdate(key, 'letterSpacing', e.target.value)}
          />
        </td>
      </tr>
    )
  }

  renderNodeRow = (node) => {
    return (
      <tr key={node.uid}>
        <td />
        <td style={{cursor: 'pointer'}} onClick={() => this.handleScrollToNode(node)}>
          <img src="https://icon.now.sh/find_in_page" />
        </td>
        <td colSpan={6}>
          ≣ {node.name}&#9;{node.text}
        </td>
      </tr>
    )
  }

  renderCategory = (cat) => {
    const { open } = this.state;

    const rows = [
      this.renderCategoryRow(cat),
      (open[cat.key] && cat.groups || []).map(group => [
        this.renderGroupRow(group),
        (open[group.key] && group.nodes || []).map(this.renderNodeRow)
      ])
    ]
    return rows;
  }

  render() {
    const { typography } = this.props;

    const columns = [30, 30, 150, 140, 60, 60, 60, 60];

    return (
      <div>
        <Table is="table">
          <colgroup>
            {columns.map((width, i) => <col width={width} key={i} />)}
          </colgroup>
          <thead>
            {this.renderHeader()}
          </thead>
        </Table>
        <div style={{maxHeight: 300, overflowY: 'auto'}}>    
          <Table is="table">
            <colgroup>
              {columns.map((width, i) => <col width={width} key={i} />)}
            </colgroup>
            <tbody style={{maxHeight: 100, overflowY: 'scroll'}}>
              {this.renderCategoryRow(typography.body, true)}
              {this.renderCategory(typography.headers)}
              {this.renderCategory(typography.copy)}
              {this.renderCategory(typography.unknown)}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

export default TypographyTable;