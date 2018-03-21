import _ from 'lodash';
import tinycolor from 'tinycolor2';

export function getDefaultColors(ds) {
  return {
    typography: getDefaultTypographyColors(ds.typography),
  }
}



const HEADER_COLOR = '#ff5722';
const COPY_COLOR = '#aaeeaa';

function getDefaultTypographyColors(typ) {
  const headers = _.filter(type, t => t.type === 'header')
    .map((_, i) => tinycolor(HEADER_COLOR).lighten(i * 6).toString());
  const copy = _.filter(type, t => t.type !== 'header')
    .map((_, i) => tinycolor(COPY_COLOR).lighten(i * 6).toString());

  return {
    headers,
    copy,
  }
}