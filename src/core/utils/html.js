



export function getDOMNodes() {
  return [...document.getElementsByTagName("*")]
    .filter(node => !hasParentWithUid(node, 'dsxray'))
    .map(node => ({node, computedStyle: window.getComputedStyle(node)}))
}

export function getVisibleNodes(nodes) {
  return nodes.filter(({node, computedStyle}) => 
    !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)
    && computedStyle.visibility !== "hidden"
  )
}

const VALID_TEXT_NODES = ['#text', 'span', 'a', 'i', 'em', 'b', 'strong', 'br', 'small', 'wbr', 'code', 'svg', 's']
const INVALID_TEXT_NODES = ['style', 'title', 'meta']
export function getTextNodes(nodes) {
  return nodes.filter(({node}) => isTextNode(node))
}

export function isTextNode(node) {
  let isTextNode = false;

  // has a non-empty '#text' node
  for (let j = 0; j < node.childNodes.length; j++) {
    const child = node.childNodes[j]
    isTextNode |= child.nodeName === '#text' && !!child.textContent.trim().length
  }

  // has only valid text nodes
  for (let j = 0; j < node.childNodes.length; j++) {
    isTextNode &= VALID_TEXT_NODES.includes(node.childNodes[j].nodeName.toLowerCase())
  }
  isTextNode &= !INVALID_TEXT_NODES.includes(node.nodeName.toLowerCase())
  return isTextNode;
}

function safePush(obj, key, el) {
  if (!obj[key]) {
    obj[key] = []
  }
  obj[key].push(el);
}

export function clean(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\W+/g, '-');
}

export function getTypographyGroupKey(style) {
  return `dsxray-${clean(style.fontFamily.split(',')[0])}-${style.fontWeight}-${style.fontSize}`
}

export function hasParentWithUid(node, uid) {
  let node_ = node.parentElement;
  while(node_) {
    if(node_.dataset && node_.dataset.uid === uid)
      return true;
    node_ = node_.parentElement
  }
  return false;
}

export function getBB(el) {
  const bb = el.getBoundingClientRect();
  return {
    uid: el.dataset.uid,
    width: bb.width,
    height: bb.height,
    top: bb.top + window.scrollY,
    left: bb.left + window.scrollX,
  }
}

export function generateList(_el, selector, field) {
  let el = _el[selector];
  const parents = [];
  while (el && el.nodeName !== 'HTML') {
    parents.push(_.get(el, field));
    el = el[selector];
  }
  return parents;
}

export function generateTreeprint(el) {
  return el.nodeName + [...el.children].map((child, i) => `${i}:${generateTreeprint(child)}`).join('')
}

