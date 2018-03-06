(function() {
  const prevStyle = document.getElementById('tachyons-x-ray')

  if (prevStyle) {
    prevStyle.parentNode.removeChild(prevStyle)
  } else {
    let style = document.createElement('style')
    style.id = 'tachyons-x-ray' // So we can toggle the grid by removing it later
    document.body.appendChild(style)

    style.sheet.insertRule("body { background: transparent url('${ grids.alpha8 }') repeat top left !important; }", style.sheet.cssRules.length)

    // Go through all elements
    const all = [...document.getElementsByTagName("*")].filter(isVisible);
    const validTextNodes = ['#text', 'span', 'a', 'i', 'em', 'b', 'strong', 'br', 'small', 'wbr', 'code', 'svg', 's']
    const blacklistNodes = ['style', 'title', 'meta']
    for (let i = 0, max = all.length; i < max; i++) {
      const el = all[i];
      let isTextNode = false;

      // has a non-empty '#text' element
      for (let j = 0; j < el.childNodes.length; j++) {
        const node = el.childNodes[j]
        isTextNode |= node.nodeName === '#text' && !!node.textContent.trim().length
      }

      // has only valid text nodes
      for (let j = 0; j < el.childNodes.length; j++) {
        isTextNode &= validTextNodes.includes(el.childNodes[j].nodeName.toLowerCase())
      }
      isTextNode &= !blacklistNodes.includes(el.nodeName.toLowerCase())

      if (isTextNode) {
        el.classList.add('kwt-text-node')
      }
    }

    const textNodes = document.querySelectorAll('.kwt-text-node');
    const typography = {}
    const colors = {}
    const bgs = {}
    for (let i = 0, max = textNodes.length; i < max; i++) {
      const el = textNodes[i];
      const style = window.getComputedStyle(el, null);
      const fontFamily = style.fontFamily.split(',')[0];
      const fontSize = style.fontSize;
      const fontWeight = style.fontWeight;
      const color = style.color;
      const key = fontFamily + '-' + fontWeight + '-' + fontSize;
      pushEl(typography, key, el);
      pushEl(colors, color, el);
    }

    for (let i = 0, max = all.length; i < max; i++) {
      const el = all[i];
      const style = window.getComputedStyle(el, null);
      const bg = style.backgroundColor;
      pushEl(bgs, bg, el);
    }

    window.xray = { typography, colors, bgs }
    console.log(window.xray)



    // Some sites like to use !important liberally, so let's try and win
    // this specificity battle with 10 chained ids _and_ !important :)
    let id = document.body.id || 'tachyons-x-ray-body'
    document.body.id = id // In case there is no id on the body already
    let superSpecificHammerTime = ''
    for (var i = 0; i < 10; i++) {
      superSpecificHammerTime += '#' + id
    }

    const wildcard = superSpecificHammerTime + ' * { background: transparent !important; color: #444 !important; }'
    style.sheet.insertRule(wildcard, style.sheet.cssRules.length)

    const image = superSpecificHammerTime + ' img { background: #aae !important; object-position: -99999px 99999px; }'
    style.sheet.insertRule(image, style.sheet.cssRules.length)

    const svg = superSpecificHammerTime + ' svg { background: #f171ea !important; fill: transparent !important; color: transparent !important; }'
    style.sheet.insertRule(svg, style.sheet.cssRules.length)

    const bgImage = superSpecificHammerTime + ' *[style*="background-image:"] { background: #00beef !important; }'
    style.sheet.insertRule(bgImage, style.sheet.cssRules.length)

    const bgImageUrl = superSpecificHammerTime + ' *[style*="background:url"] { background: #00beef !important; }'
    style.sheet.insertRule(bgImageUrl, style.sheet.cssRules.length)

    const textNode = superSpecificHammerTime + ' .kwt-text-node { background: #aaeeaa !important; }'
    style.sheet.insertRule(textNode, style.sheet.cssRules.length)


    // Create the menu and styles for it
    style.sheet.insertRule("#tachyons-x-ray-menu { display: inline-block; position: fixed; top: 16px; right: 16px; width: 32px; height: 32px; font-size: 16px; line-height: 32px; border-radius: 50%; box-shadow: 0 0 16px #666; text-align: center; cursor: pointer; color: #444; z-index: 2147483647; }", style.sheet.cssRules.length)

    style.sheet.insertRule("#tachyons-x-ray-menu:hover { box-shadow: 0 0 16px #0074D9; }", style.sheet.cssRules.length)


    let debugRules = [
      'body { outline: 1px solid !important; }',
      'article { outline: 1px solid !important; }',
      'nav { outline: 1px solid !important; }',
      'aside { outline: 1px solid !important; }',
      'section { outline: 1px solid !important; }',
      'header { outline: 1px solid !important; }',
      'footer { outline: 1px solid !important; }',
      'h1 { outline: 1px solid !important; }',
      'h2 { outline: 1px solid !important; }',
      'h3 { outline: 1px solid !important; }',
      'h4 { outline: 1px solid !important; }',
      'h5 { outline: 1px solid !important; }',
      'h6 { outline: 1px solid !important; }',
      'main { outline: 1px solid !important; }',
      'address { outline: 1px solid !important; }',
      'div { outline: 1px solid !important; }',
      'p { outline: 1px solid !important; }',
      'hr { outline: 1px solid !important; }',
      'pre { outline: 1px solid !important; }',
      'blockquote { outline: 1px solid !important; }',
      'ol { outline: 1px solid !important; }',
      'ul { outline: 1px solid !important; }',
      'li { outline: 1px solid !important; }',
      'dl { outline: 1px solid !important; }',
      'dt { outline: 1px solid !important; }',
      'dd { outline: 1px solid !important; }',
      'figure { outline: 1px solid !important; }',
      'figcaption { outline: 1px solid !important; }',
      'table { outline: 1px solid !important; }',
      'caption { outline: 1px solid !important; }',
      'thead { outline: 1px solid !important; }',
      'tbody { outline: 1px solid !important; }',
      'tfoot { outline: 1px solid !important; }',
      'tr { outline: 1px solid !important; }',
      'th { outline: 1px solid !important; }',
      'td { outline: 1px solid !important; }',
      'col { outline: 1px solid !important; }',
      'colgroup { outline: 1px solid !important; }',
      'button { outline: 1px solid !important; }',
      'datalist { outline: 1px solid !important; }',
      'fieldset { outline: 1px solid !important; }',
      'form { outline: 1px solid !important; }',
      'input { outline: 1px solid !important; }',
      'keygen { outline: 1px solid !important; }',
      'label { outline: 1px solid !important; }',
      'legend { outline: 1px solid !important; }',
      'meter { outline: 1px solid !important; }',
      'optgroup { outline: 1px solid !important; }',
      'option { outline: 1px solid !important; }',
      'output { outline: 1px solid !important; }',
      'progress { outline: 1px solid !important; }',
      'select { outline: 1px solid !important; }',
      'textarea { outline: 1px solid !important; }',
      'details { outline: 1px solid !important; }',
      'summary { outline: 1px solid !important; }',
      'command { outline: 1px solid !important; }',
      'menu { outline: 1px solid !important; }',
      'del { outline: 1px solid !important; }',
      'ins { outline: 1px solid !important; }',
      'img { outline: 1px solid !important; background: #aaaaee; }',
      'iframe { outline: 1px solid !important; }',
      'embed { outline: 1px solid !important; }',
      'object { outline: 1px solid !important; }',
      'param { outline: 1px solid !important; }',
      'video { outline: 1px solid !important; }',
      'audio { outline: 1px solid !important; }',
      'source { outline: 1px solid !important; }',
      'canvas { outline: 1px solid !important; }',
      'track { outline: 1px solid !important; }',
      'map { outline: 1px solid !important; }',
      'area { outline: 1px solid !important; }',
      'a { outline: 1px solid !important; }',
      'em { outline: 1px solid !important; }',
      'strong { outline: 1px solid !important; }',
      'i { outline: 1px solid !important; }',
      'b { outline: 1px solid !important; }',
      'u { outline: 1px solid !important; }',
      's { outline: 1px solid !important; }',
      'small { outline: 1px solid !important; }',
      'abbr { outline: 1px solid !important; }',
      'q { outline: 1px solid !important; }',
      'cite { outline: 1px solid !important; }',
      'dfn { outline: 1px solid !important; }',
      'sub { outline: 1px solid !important; }',
      'sup { outline: 1px solid !important; }',
      'time { outline: 1px solid !important; }',
      'code { outline: 1px solid !important; }',
      'kbd { outline: 1px solid !important; }',
      'samp { outline: 1px solid !important; }',
      'var { outline: 1px solid !important; }',
      'mark { outline: 1px solid !important; }',
      'bdi { outline: 1px solid !important; }',
      'bdo { outline: 1px solid !important; }',
      'ruby { outline: 1px solid !important; }',
      'rt { outline: 1px solid !important; }',
      'rp { outline: 1px solid !important; }',
      'span { outline: 1px solid !important; }',
      'br { outline: 1px solid !important; }',
      'wbr { outline: 1px solid !important; }'
    ]

    let debugRulesVisible = false;
    window.toggleDebugRules = () => {
      const prevStyle = document.getElementById('tachyons-x-ray')
      if (!debugRulesVisible) {
        debugRules.forEach(r =>
          style.sheet.insertRule(r, style.sheet.cssRules.length))
        debugRulesVisible = true
      } else {
        debugRules.forEach((_, idx) =>
          style.sheet.deleteRule(style.sheet.cssRules.length - 1))
        debugRulesVisible = false
      }
    }
    window.toggleDebugRules();

    function pushEl(obj, key, el) {
      if (!obj[key]) {
        obj[key] = []
      }
      obj[key].push(el);
    }

    function isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }
  }
})()