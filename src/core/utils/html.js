

export function getDOMNodes() {
  return [...document.getElementsByTagName("*")]
}

export function getVisibleNodes(nodes) {
  return nodes.filter(node => 
    !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)
    && !!(node.clientWidth || node.clientHeight)
    && window.getComputedStyle(node).visibility !== "hidden"
  )
}

const VALID_TEXT_NODES = ['#text', 'span', 'a', 'i', 'em', 'b', 'strong', 'br', 'small', 'wbr', 'code', 'svg', 's']
const INVALID_TEXT_NODES = ['style', 'title', 'meta']
export function getTextNodes(nodes) {
  const textNodes = nodes.filter(node => {
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
  })
  return textNodes;
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