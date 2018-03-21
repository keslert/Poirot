import { createSelector } from 'reselect';
import { getTypographyGroupKey } from '../../utils/html';
import { getActiveDS } from '../ds/selectors';
// import groupBy from 'lodash/groupBy';
// import difference from 'lodash/difference';
// import flatMap from 'lodash/flatMap';
// import map from 'lodash/map';
import _ from 'lodash';


export function getPage(state) {
  return state.page;
}

export function getTextNodes(state) {
  return getPage(state).textNodes;
}

export const getTypographyCategories = createSelector(
  getTextNodes,
  getActiveDS,
  (textNodes, ds) => {
    const headers = ds.typography.headers.map(group => {
      const key = getTypographyGroupKey(group);
      return {...group, key,
        nodes: textNodes.filter(n => n.group === key)
      }
    })

    const copy = ds.typography.copy.map(group => {
      const key = getTypographyGroupKey(group);
      return {...group, key,
        nodes: textNodes.filter(n => n.group === key)
      }
    })

    const unknownNodes = _.difference(textNodes, _.flatMap(headers, 'nodes'), _.flatMap(copy, 'nodes'))
    const unknown = _.map(_.groupBy(unknownNodes, n => n.group), nodes => ({
      ...nodes[0].style,
      key: getTypographyGroupKey(nodes[0].style),
      label: `${nodes[0].style.fontFamily} ${nodes[0].style.fontWeight} ${nodes[0].style.fontSize}`,
      nodes,
    }))

    return {
      body: {
        label: 'Body',
        ...ds.typography.body,
      },
      headers: {
        key: 'headers',
        label: 'Headers',
        fontFamily: getMostFrequent(headers.map(h => h.fontFamily)),
        groups: headers,
      },
      copy: {
        key: 'copy',
        label: 'Copy',
        fontFamily: getMostFrequent(copy.map(h => h.fontFamily)),
        groups: copy,
      },
      unknown: {
        key: 'unknown',
        label: 'Unknown',
        fontFamily: getMostFrequent(unknown.map(h => h.fontFamily)),
        groups: unknown,
      }
    }
  }
)

function getMostFrequent(arr) {
  return _.chain(arr).countBy().toPairs().max(_.last).head().value()
}