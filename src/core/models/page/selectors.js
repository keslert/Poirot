import { createSelector } from 'reselect';
import { getTypographyGroupKey } from '../../utils/html';
import { getActiveDS } from '../ds/selectors';
import groupBy from 'lodash/groupBy';
import difference from 'lodash/difference';
import map from 'lodash/map';

export function getPage(state) {
  return state.page;
}

export function getTextNodes(state) {
  return getPage(state).textNodes;
}

export const getTypographyGroups = createSelector(
  getTextNodes,
  getActiveDS,
  (textNodes, ds) => {

    console.log('Running getTypographyGroups');
    const headers = ds.typography.headers.map(group => {
      const key = getTypographyGroupKey(group);
      return {...group,
        nodes: textNodes.filter(n => n.group === key)
      }
    })

    const copy = ds.typography.copy.map(group => {
      const key = getTypographyGroupKey(group);
      return {
        ...group,
        nodes: textNodes.filter(n => n.group === key)
      }
    })

    const miscNodes = difference(textNodes, headers.items, copy.items)
    const misc = map(groupBy(miscNodes, n => n.group), items => ({
      label: items[0].group,
      items,
    }))

    return {
      body: ds.typography.body,
      headers: {
        label: 'Headers',
        items: headers,
      },
      copy: {
        label: 'Copy',
        items: copy,
      },
      misc: {
        label: 'Unknown',
        items: misc,
      }
    }
  }
)