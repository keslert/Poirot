import { createSelector } from 'reselect';
import { getTypographyGroupKey } from '../../utils/html';
import { getDS } from '../ds/selectors';
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
  getDS,
  (textNodes, ds) => {

    const categories = ds.typography.categories.map(cat => ({
      ...cat,
      key: cat.label.replace(/ /g, '-').toLowerCase(),
      groups: cat.groups.map(group => {
        const key = getTypographyGroupKey(group);
        return {...group, key,
          nodes: textNodes.filter(n => n.group === key)
        }  
      })
    }))

    const usedNodes = _.flatMapDeep(categories, cat => cat.groups.map(g => g.nodes))
    const unknownNodes = _.difference(textNodes, usedNodes);
    const unknownGroups = _.chain(unknownNodes).groupBy('group').map(nodes => ({
      ...nodes[0].style,
      key: getTypographyGroupKey(nodes[0].style),
      label: `${nodes[0].style.fontFamily} ${nodes[0].style.fontWeight} ${nodes[0].style.fontSize}`,
      nodes,
    })).value();
    const unknownCategory = _.find(categories, cat => cat.label === 'Unknown');
    unknownCategory.groups = _.chain([...unknownCategory.groups, ...unknownGroups]).sortBy('fontSize').reverse().value();

    return {
      ...ds.typography,
      categories: categories.map(cat => ({
        ...cat,
        fontFamily: getMostFrequent(cat.groups.map(g => g.fontFamily))
      })),
    }
  }
)

function getMostFrequent(arr) {
  return _.chain(arr).countBy().toPairs().maxBy(_.last).head().value()
}