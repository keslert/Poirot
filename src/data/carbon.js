/**
There are 9 font styles in the Plasma design system.

6 bold styles to be used in headers, form labels and bold statements.
3 regular styles to be used in copy and form inputs.use each style.
 */

// https://rivendell-docs.netlify.com/text-styles/
const typography = {
  body: {
    fontFamily: 'Apercu',
    fontWeight: 200,
    fontSize: '1rem',
    lineHeight: 1.625,
  },
  categories: [
    {
      label: 'Headers',
      groups: [
        {
          label: 'Impact 1',
          fontFamily: 'Knockout 48 A',
          fontWeight: 400,
          fontSize: '120px',
          letterSpacing: '2px',
          lineHeight: '100px',
        },
      ]
    },
    {
      label: 'Copy',
      groups: [
        {
          label: 'Copy 1',
          fontFamily: 'Apercu',
          fontWeight: 200,
          fontSize: '24px',
          lineHeight: '36px',
        },
      ]
    }
  ]
}

const colors = {
  settings: {
    baseMax: 80,
    baseMin: 20,
    darkenStep: {darken: 10},
    lightenStep: {lighten: 10},
  },
  swatches: {
    green: {
      level: 'secondary',
      use: ['color', 'backgroundColor'],
      colors: [
        {value: '#223d3e', base: 80},
        {value: '#355e5e', base: 70},
        {value: '#477e7f', base: 60},
        {value: '#599FA0', base: 50},
        {value: '#78b3b4', base: 40},
        {value: '#99c6c6', base: 30},
        {value: '#bad8d8', base: 20},
      ]
    }
  }
}

const spacing = {
  defaults: [0, 5, 10, 15, 20, 30, 40],
  exceptions: {
    'form input': [3,4,5,10,20,30]
  }
}

export default {
  typography,
  colors,
  spacing,
}

