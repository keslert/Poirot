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
        return {
          ...group,
          ...(ds.typography.overwrites[key] || {}),
          key,
          nodes: textNodes.filter(n => n.group === key)
        }  
      })
    }))

    const usedNodes = _.flatMapDeep(categories, cat => cat.groups.map(g => g.nodes))
    const unknownNodes = _.difference(textNodes, usedNodes);
    const unknownGroups = _.chain(unknownNodes).groupBy('group').map(nodes => {
      const style = nodes[0].style;
      const key = getTypographyGroupKey(style);
      return {
        ...style,
        ...(ds.typography.overwrites[key] || {}),
        key,
        label: `${style.fontFamily} ${style.fontWeight} ${style.fontSize}`,
        nodes,
      }
    }).value();
    const unknownCategory = _.find(categories, cat => cat.label === 'Unknown');
    unknownCategory.groups = _.chain([...unknownCategory.groups, ...unknownGroups]).sortBy('fontSize').reverse().value();

    return {
      ...ds.typography,
      categories: categories.map(cat => ({
        ...cat,
        fontFamily: getMostFrequent(cat.groups.map(g => g.fontFamily))
      })),
      groups: _.flatMap(categories, 'groups'),
    }
  }
)

function getMostFrequent(arr) {
  return _.chain(arr).countBy().toPairs().maxBy(_.last).head().value()
}