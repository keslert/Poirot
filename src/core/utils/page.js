import { 
  getDOMNodes, 
  getVisibleNodes,
  isTextNode,
  getTypographyGroupKey,
  generateList,
  generateTreeprint,
} from './html';

export function parseAndTagPage() {
  const all = getDOMNodes();
  const visible = getVisibleNodes(all);
  const valid = _.filter(visible, ({node}) => {
    const parents = generateList(node, 'parentElement', 'dataset.dsxrayIgnore');
    return !_.get(node, 'dataset.dsxrayIgnore') && !_.some(parents, Boolean);
  });


  const hostname = location.hostname;
  const pathname = location.pathname;

  const uidToDOMNode = {};
  const nodes = valid.map(({node, computedStyle: style}, i) => {
    const uid = `dsxray-node-${i}`;
    uidToDOMNode[uid] = node;
    return {
      uid,
      hostname,
      pathname,
      nodeName: node.nodeName.toLowerCase(),
      style: {
        fontFamily: style.fontFamily.split(',')[0].replace(/\"/g, ""),
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,

        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight,

        color: style.color,
        backgroundColor: style.backgroundColor,
        boxShadow: style.boxShadow,
        backgroundImage: style.backgroundImage,
        overwrites: {},
      }
    }
  })
  nodes.forEach(node => {
    const domNode = uidToDOMNode[node.uid]
    domNode.classList.add(node.uid)
    domNode.setAttribute('data-uid', node.uid);
    
    const bb = domNode.getBoundingClientRect();
    node.bb = {
      width: bb.width,
      height: bb.height,
      top: bb.top + window.scrollY,
      left: bb.left + window.scrollX,
    }

    node.parentUids = generateList(domNode, 'parentElement', 'dataset.uid');
    node.parentNodeNames = generateList(domNode, 'parentElement', 'nodeName');
    node.treeprint = generateTreeprint(domNode);
    node.prevElementNodeNames = generateList(domNode, 'previousElementSibling', 'nodeName');
    node.nextElementNodeNames = generateList(domNode, 'nextElementSibling', 'nodeName');
  });
  document.getElementById('dsxray').setAttribute('data-uid', 'dsxray');

  nodes.forEach(node => {
    const domNode = uidToDOMNode[node.uid];
    node.siblings = [
      ...generateList(domNode, 'previousElementSibling', 'dataset.uid'),
      ...generateList(domNode, 'nextElementSibling', 'dataset.uid'),
    ]
  })

  const textNodes = nodes.filter(({uid}) => isTextNode(uidToDOMNode[uid]));
  textNodes.forEach(node => {
    const domNode = uidToDOMNode[node.uid];
    node.typographyGroup = getTypographyGroupKey(node.style);
    node.textContent = domNode.textContent;
    node.innerHTML = domNode.innerHTML;
    node._innerHTML = domNode.innerHTML;
    node.isTextNode = true;
    domNode.classList.add(node.typographyGroup);
    domNode.setAttribute('data-text-node', true);
  })

  const imageNodes = nodes.filter((node) => node.nodeName === 'img' || node.style.backgroundImage !== 'none')
  imageNodes.forEach(node => {
    const domNode = uidToDOMNode[node.uid];
    node.isImageNode = true;
    node.src = domNode.src;
    node._src = domNode.src;
    domNode.setAttribute('data-image-node', true);
  })

  const nodesObj = _.keyBy(nodes, 'uid');

  const treeprints = _.chain(nodes)
    .groupBy('treeprint')
    .pickBy((group, key) => group.length > 1 && _.includes(key, ':'))
    .value();
  
  const highTreeprints = _.pickBy(treeprints, (group, key) => (
    _.every(group, node => _.every(node.parentUids, uid => !treeprints[nodesObj[uid].treeprint]))
  ))
  
  return {
    hostname,
    pathname,
    nodes: nodesObj,
    treeprints: treeprints,
  }
}

export function getStyle(node, overwrites={}, ephemerals={}) {
  return {
    ...node.style,
    ...(overwrites[node.uid] || {}),
    ...(ephemerals[node.uid] || {}),
  }
}