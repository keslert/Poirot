import { 
  getDOMNodes, 
  getVisibleNodes,
  isTextNode,
  getTypographyGroupKey,
} from './html';

export function parseAndTagPage() {
  const all = getDOMNodes();
  const visible = getVisibleNodes(all);
  const hostname = location.hostname;
  const pathname = location.pathname;

  const uidToDOMNode = {};
  const nodes = visible.map(({node, computedStyle: style}, i) => {
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
      }
    }
  })
  nodes.forEach(node => {
    const domNode = uidToDOMNode[node.uid]
    domNode.classList.add(node.uid)
    domNode.setAttribute('data-uid', node.uid);
    
    node.parents = [];
    let el = domNode.parentElement;
    while(el) {
      node.parents.push(el.dataset.uid);
      el = el.parentElement;
    }

    node.style.marginTop !== '0px' && domNode.classList.add(`dsxray-mt-${node.style.marginTop}`)
    node.style.marginRight !== '0px' && domNode.classList.add(`dsxray-mr-${node.style.marginRight}`)
    node.style.marginBottom !== '0px' && domNode.classList.add(`dsxray-mb-${node.style.marginBottom}`)
    node.style.marginLeft !== '0px' && domNode.classList.add(`dsxray-ml-${node.style.marginLeft}`)
    node.style.paddingTop !== '0px' && domNode.classList.add(`dsxray-pt-${node.style.paddingTop}`)
    node.style.paddingRight !== '0px' && domNode.classList.add(`dsxray-pr-${node.style.paddingRight}`)
    node.style.paddingBottom !== '0px' && domNode.classList.add(`dsxray-pb-${node.style.paddingBottom}`)
    node.style.paddingLeft !== '0px' && domNode.classList.add(`dsxray-pl-${node.style.paddingLeft}`)
  });
  document.getElementById('dsxray').setAttribute('data-uid', 'dsxray');


  const textNodes = nodes.filter(({uid}) => isTextNode(uidToDOMNode[uid]));
  textNodes.forEach(node => {
    const domNode = uidToDOMNode[node.uid];
    node.typographyGroup = getTypographyGroupKey(node.style);
    node.textContent = domNode.textContent;
    domNode.classList.add(node.typographyGroup);
    domNode.setAttribute('data-text-node', true);
    // domNode.setAttribute('contenteditable', 'true');
  })
  
  return {
    hostname,
    pathname,
    nodes,
    textNodes,
  }
}