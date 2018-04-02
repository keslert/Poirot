import React from 'react';
import ReactDOM from 'react-dom';
import { Flex, Box, Text } from 'rebass';
import Rotate from './rotate';
import Table from './table';
import Toggle from './toggle';
import Input from './input';
import difference from 'lodash/difference';
import FontPicker from './font-picker';
import WebFont from 'webfontloader';

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
    const groups = category.groups.filter(g => g[key] === category[key]).map(g => g.key);
    this.props.updateTypography(groups, {[key]: value});
    
    if(key === 'fontFamily') {
      this.loadWebFont(value)
    }
  }

  handleGroupUpdate = (group, key, value) => {
    this.props.updateTypography([group.key], {[key]: value})
    if(key === 'fontFamily') {
      this.loadWebFont(value);
    }
  }

  webFontCache = {};
  loadWebFont(fontFamily) {
    if (!this.webFontCache[fontFamily]) {
      this.webFontCache[fontFamily] = true;
      WebFont.load({ google: { families: [fontFamily] } })
    }
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

  renderBodyRow = (body) => {
    return (
      <tr style={{ background: '#f4f4f4' }}>
        <td />
        <td />
        <td style={{ fontSize: 15, fontWeight: 'bold' }}>
          Body
        </td>
        <td>
          <FontPicker
            value={body.fontFamily}
            onChange={value => this.handleCategoryUpdate(key, 'fontFamily', value)}
          />
        </td>
        <td>
          <Input
            value={body.fontSize}
            onChange={(e) => this.handleCategoryUpdate(key, 'fontSize', e.target.value)}
          />
        </td>
        <td>
          <Input
            value={body.fontWeight}
            onChange={(e) => this.handleCategoryUpdate(key, 'fontWeight', e.target.value)}
          />
        </td>
        <td>
          <Input
            value={body.lineHeight}
            onChange={(e) => this.handleCategoryUpdate(key, 'lineHeight', e.target.value)}
          />
        </td>
        <td>
          <Input
            value={body.letterSpacing}
            onChange={(e) => this.handleCategoryUpdate(key, 'letterSpacing', e.target.value)}
          />
        </td>
      </tr>
    )
  }

  renderCategoryRow = (category) => {
    const key = category.key;
    const isVisible = category.groups && difference(category.groups.map(g => g.key), this.props.visible).length === 0
    return (
      <tr style={{background: '#f4f4f4'}} key={key}>
        <td style={{ fontSize: 12, textAlign: 'center', cursor: 'pointer' }} onClick={() => this.handleToggleOpen(key)}>
          {category.groups && <Rotate rotated={this.state.open[key]}>▶</Rotate>}
        </td>
        <td>
          <Toggle checked={isVisible} onClick={() => this.handleToggleCategoryVisibile(category)} />
        </td>
        <td style={{fontSize: 15, fontWeight: 'bold'}}>
          {category.label} <Text is="span" fontWeight={400}>{category.groups ? `(${category.groups.length})` : ''}</Text>
        </td>
        <td>
          <FontPicker 
            value={category.fontFamily}
            onChange={value => this.handleCategoryUpdate(category, 'fontFamily', value)} 
          />
        </td>
        <td colSpan="4" />
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
          <FontPicker
            value={group.fontFamily}
            onChange={value => this.handleGroupUpdate(group, 'fontFamily', value)}
          />
        </td>
        <td>
          <Input
            value={group.fontSize}
            onChange={(e) => this.handleGroupUpdate(group, 'fontSize', e.target.value)}
          />
        </td>
        <td>
          <Input
            value={group.fontWeight}
            onChange={(e) => this.handleGroupUpdate(group, 'fontWeight', e.target.value)}
          />
        </td>
        <td>
          <Input
            value={group.lineHeight}
            onChange={(e) => this.handleGroupUpdate(group, 'lineHeight', e.target.value)}
          />
        </td>
        <td>
          <Input
            value={group.letterSpacing}
            onChange={(e) => this.handleGroupUpdate(group, 'letterSpacing', e.target.value)}
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
          ≣ {node.name}&#9;{node.textContent}
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
              {this.renderBodyRow(typography.body)}
              {typography.categories.map(this.renderCategory)}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

export default TypographyTable;