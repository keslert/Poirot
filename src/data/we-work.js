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
        {
          label: 'Impact 2',
          fontFamily: 'Knockout 48 A',
          fontWeight: 400,
          fontSize: '80px',
          letterSpacing: '2px',
          lineHeight: '70px',
        },
        {
          label: 'Title 0', 
          fontFamily: 'Apercu',
          fontWeight: 700,
          fontSize: '54px',
          lineHeight: '62px',
        },
        {
          label: 'Title 1', 
          fontFamily: 'Apercu',
          fontWeight: 700,
          fontSize: '34px',
          lineHeight: '42px',
        },
        {
          label: 'Title 2', 
          fontFamily: 'Apercu',
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: '32px',
        },
        {
          label: 'Title 3',
          fontFamily: 'Apercu',
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '26px',
        },
        {
          label: 'Title 4',
          fontFamily: 'Apercu',
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '22px',
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
        {
          label: 'Copy 2',
          fontFamily: 'Apercu',
          fontWeight: 200,
          fontSize: '18px',
          lineHeight: '28px',
        },
        {
          label: 'Copy 3',
          fontFamily: 'Apercu',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '22px',
        },
        {
          label: 'Copy 4',
          fontFamily: 'Apercu',
          fontWeight: 200, // This is not in the documentation
          fontSize: '12px',
          lineHeight: '20px',
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
    gray: {
      level: 'primary',
      use: ['color', 'backgroundColor'],
      colors: [
        {value: '#747476', base: 70},
        {value: '#8e8e8f', base: 60},
        {value: '#a7a7a9', base: 50},
        {value: '#c1c1c2', base: 40},
        {value: '#dbdbdb', base: 30},
        {value: '#f4f4f5', base: 20},
        {value: '#ffffff', base: 10},
      ]
    },
    black: {
      level: 'primary',
      use: ['color', 'backgroundColor'],
      colors: [
        {value: '#000000', base: 70},
        {value: '#0d0e0e', base: 60},
        {value: '#252729', base: 50},
        {value: '#3d4144', base: 40},
        {value: '#555a5f', base: 30},
        {value: '#6e7479', base: 20},
      ]
    },
    yellow: {
      level: 'primary',
      use: ['color', 'backgroundColor'],
      colors: [
        {value: '#d39100', base: 70},
        {value: '#ffb107', base: 60},
        {value: '#ffc13a', base: 50},
        {value: '#ffd16d', base: 40},
        {value: '#ffe1a0', base: 30},
        {value: '#fff1d3', base: 20},
      ]
    },
    blue: {
      level: 'secondary',
      use: ['color', 'backgroundColor'],
      colors: [
        {value: '#21465d', base: 80},
        {value: '#2e6383', base: 70},
        {value: '#3b7fa9', base: 60},
        {value: '#5499c3', base: 50},
        {value: '#7ab0d0', base: 40},
        {value: '#a0c6dd', base: 30},
        {value: '#c5ddeb', base: 20},
      ]
    },
    red: {
      level: 'secondary',
      use: ['color', 'backgroundColor'],
      colors: [
        {value: '#812020', base: 80},
        {value: '#aa2a2a', base: 70},
        {value: '#ce3939', base: 60},
        {value: '#d86262', base: 50},
        {value: '#e28b8b', base: 40},
        {value: '#ecb4b4', base: 30},
        {value: '#f6dddd', base: 20},
      ]
    },
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

const shadows = {
  defaults: [
    'rgba(0, 0, 0, 0.15) 0px 10px 25px 0px',
    'rgba(0,0,0,.1) 0px 1px 2px',
  ]
}

export default {
  typography,
  colors,
  spacing,
  shadows,
}

