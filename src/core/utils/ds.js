import { 
  getDOMNodes, 
  getVisibleNodes,
  getTextNodes,
  getTypographyGroupKey,
} from './html';
import _ from 'lodash';

export function parseAndTagPage() {
  const all = getDOMNodes();
  const visible = getVisibleNodes(all);
  const textNodes = getTextNodes(visible);
  const hostname = location.hostname;
  const pathname = location.pathname;

  const textNodes_ = textNodes.map((node, i) => {
    const style = window.getComputedStyle(node);
    const obj = {
      uid: `dsxray-textnode-${i}`,
      group: `${getTypographyGroupKey(style)}`,
      nodeName: node.nodeName.toLowerCase(),
      hostname,
      pathname,
      text: node.textContent,
      style: {
        fontFamily: style.fontFamily.split(',')[0].replace(/\"/g, ""),
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
      }
    }
    node.classList.add(obj.uid, obj.group)
    return obj;
  })
  
  return {
    hostname,
    pathname,
    textNodes: textNodes_,
  }
}