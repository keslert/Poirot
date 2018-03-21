import React from 'react';
import { Flex, Box, Text } from 'rebass';
import Rotate from './rotate';
import Toggle from './toggle';
import Input from './input';

const Table = Box.extend`
  border-collapse: separate;
  border-spacing: 0 1px;
  td {
    padding: 4px;
  }
  td input {
    margin-right: 8px;
  }
  th {
    padding: 0 4px;
    font-size: 10px;
    text-align: left;
    text-transform: uppercase;
    font-weight: bold;
  }
`

class TypographyTable extends React.Component {

  handleGroupUpdate = (groupKey, key, value) => {

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

  renderGroupRow(group) {
    const key = group.key;
    return (
      <tr onClick={() => this.handleGroupUpdate(key, 'open', !group.open)} style={{background: '#f4f4f4'}} key={key}>
        <td style={{fontSize: 12, paddingLeft: 12}}>{group.items &&
          <Rotate rotated={group.open}>▶</Rotate>
        }</td>
        <td>{!group.hideToggle && 
          <Toggle checked={group.visible} onChange={() => this.handleGroupUpdate(key, 'visible', !group.visible)} />
        }</td>
        <td style={{fontSize: 15, fontWeight: 'bold', width: 128}}>
          {group.label} <Text is="span" fw="normal">{group.items ? `(${group.items.length})` : ''}</Text>
        </td>
        <td>
          <Input
            width="128px"
            value={group.fontFamily} 
            onChange={(e) => this.handleGroupUpdate(key, 'font', e.target.value)} 
          />
        </td>
        <td>
          <Input
            width="48px" 
            value={group.fontSize} 
            onChange={(e) => this.handleGroupUpdate(key, 'size', e.target.value)} 
          />
        </td>
        <td>
          <Input 
            width="48px"
            value={group.fontWeight} 
            onChange={(e) => this.handleGroupUpdate(key, 'weight', e.target.value)} 
          />
        </td>
        <td>
          <Input 
            width="48px"
            value={group.lineHeight} 
            onChange={(e) => this.handleGroupUpdate(key, 'lineHeight', e.target.value)} 
          />
        </td>
        <td>
          <Input 
            width="48px"
            value={group.letterSpacing} 
            onChange={(e) => this.handleGroupUpdate(key, 'letterSpacing', e.target.value)} 
          />
        </td>
      </tr>
    )
  }

  renderItemRow(item) {
    const key = item.key;
    return (
      <tr key={key}>
        <td></td>
        <td>
          <Toggle checked={item.visible} onChange={() => this.handleGroupUpdate(key, 'visible', !item.visible)} />
        </td>
        <td style={{ fontSize: 13, fontWeight: 'bold', width: 128 }}>
          {item.label}
        </td>
        <td>
          <Input
            width="128px"
            value={item.fontFamily}
            onChange={(e) => this.handleGroupUpdate(key, 'font', e.target.value)}
          />
        </td>
        <td>
          <Input
            width="48px"
            value={item.fontSize}
            onChange={(e) => this.handleGroupUpdate(key, 'size', e.target.value)}
          />
        </td>
        <td>
          <Input
            width="48px"
            value={item.fontWeight}
            onChange={(e) => this.handleGroupUpdate(key, 'weight', e.target.value)}
          />
        </td>
        <td>
          <Input
            width="48px"
            value={item.lineHeight}
            onChange={(e) => this.handleGroupUpdate(key, 'lineHeight', e.target.value)}
          />
        </td>
        <td>
          <Input
            width="48px"
            value={item.letterSpacing}
            onChange={(e) => this.handleGroupUpdate(key, 'letterSpacing', e.target.value)}
          />
        </td>
      </tr>
    )
  }

  renderNodeRow(node) {
    return (
      <tr key={node.key}>
        <td />
        <td>≣</td>
        <td colSpan={5}>
          {node.name}&#9;{node.text}
        </td>
      </tr>
    )
  }

  renderGroup = (group) => {
    const rows = [
      this.renderGroupRow(group),
      (group.items || []).map(item => [
        this.renderItemRow(item),
        (item.nodes || []).map(this.renderNodeRow)
      ])
    ]
    return rows;
  }

  render() {

    const { typography } = this.props;
    console.log(typography);

    return (
      <div style={{maxHeight: 300, overflowY: 'auto'}}>
        <Table is="table">
          <thead>
            {this.renderHeader()} 
          </thead>
          <tbody style={{maxHeight: 100, overflowY: 'scroll'}}>
            {this.renderGroupRow(typography.body)}
            {this.renderGroup(typography.headers)}
            {this.renderGroup(typography.copy)}
            {this.renderGroup(typography.misc)}
          </tbody>
        </Table>
      </div>
    )
  }
}

const tableStyle = {
  
}

export default TypographyTable;

// const data = {
//   body: {
//     key: 'body',
//     label: 'Body',
//     hideToggle: true,
//     font: 'Open Sans',
//     size: '16px',
//     lineHeight: '1.4',
//     letterSpacing: '0',
//   },
//   headers: {
//     key: 'headers',
//     label: 'Headers',
//     visible: true,
//     open: true,
//     defaults: {
//       font: 'Source Pro Sans',
//       weight: 400,
//     },
//     items: [{
//       key: 'bold-1',
//       label: 'Bold 1',
//       font: null,
//       size: '48px',
//       lineHeight: null,
//       letterSpacing: null,
//       description: 'This is the description',
//       nodes: [],
//     },{
//       key: 'bold-2',
//       label: 'Bold 2',
//       font: null,
//       size: '32px',
//       lineHeight: null,
//       letterSpacing: null,
//       description: 'This is the description',
//       nodes: [{
//         name: 'h2',
//         text: 'How many employees are in your company'
//       },{
//         name: 'p',
//         text: 'Time estimate'
//       }],
//     }]
//   },
//   copy: {
//     key: 'copy',
//     label: 'Copy',
//     defaults: {},
//     items: [{
//       key: 'regular-1',
//       label: 'Regular 1',
//       font: null,
//       size: '48px',
//       lineHeight: null,
//       letterSpacing: null,
//       description: 'This is the description',
//       nodes: [],
//     }, {
//       key: 'regular-2',
//       label: 'Regular 2',
//       font: null,
//       size: '32px',
//       lineHeight: null,
//       letterSpacing: null,
//       description: 'This is the description',
//       nodes: [],
//     }]
//   },
//   misc: [

//   ]
// }