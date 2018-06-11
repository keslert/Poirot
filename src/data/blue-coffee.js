const typography = {
  body: {
    fontFamily: 'Avenir Next',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
  },
  categories: [
    {
      label: 'Headers',
      groups: [
        {
          label: 'Impact 1',
          fontFamily: 'Avenir Next',
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '1.3',
        },
        {
          label: 'Impact 2',
          fontFamily: 'Avenir Next',
          fontWeight: 600,
          fontSize: '12px',
          lineHeight: '1.3',
        },
        {
          label: 'Header 1',
          fontFamily: 'Avenir Next',
          fontWeight: 400,
          fontSize: '48px',
        },
        {
          label: 'Header 2',
          fontFamily: 'Avenir Next',
          fontWeight: 400,
          fontSize: '32px',
        },
        {
          label: 'Header 3',
          fontFamily: 'Avenir Next',
          fontWeight: 400,
          fontSize: '24px',
        },
      ]
    },
    {
      label: 'Copy',
      groups: [
        {
          label: 'Copy 1',
          fontFamily: 'Avenir Next',
          fontWeight: 400,
          fontSize: '20px',
        },
        {
          label: 'Copy 2',
          fontFamily: 'Avenir Next',
          fontWeight: 400,
          fontSize: '18px',
        },
        {
          label: 'Copy 3',
          fontFamily: 'Avenir Next',
          fontWeight: 400,
          fontSize: '16px',
        },
        {
          label: 'Copy 4',
          fontFamily: 'Avenir Next',
          fontWeight: 400,
          fontSize: '14px',
        },
        {
          label: 'Copy 5',
          fontFamily: 'Avenir Next',
          fontWeight: 400,
          fontSize: '12px',
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
    blue: {
      level: 'primary',
      use: ['color', 'backgroundColor'],
      colors: [
        {value: '#ffffff', base: 0},
        {value: '#79dafe', base: 20},
        {value: '#46ccfe', base: 30},
        {value: '#13befe', base: 40},
        {value: '#01a1dd', base: 50},
        {value: '#017caa', base: 60},
        {value: '#015777', base: 70},
        {value: '#003245', base: 80},
      ]
    },
    grey: {
      level: 'secondary',
      use: ['color', 'backgroundColor'],
      colors: [
        {value: '#ffffff', base: 0},
        {value: '#eeeeee', base: 20},
        {value: '#cccccc', base: 30},
        {value: '#bbbbbb', base: 40},
        {value: '#999999', base: 50},
        {value: '#777777', base: 60},
        {value: '#555555', base: 70},
        {value: '#333333', base: 80},
      ]
    },
  }
}

const spacing = {
  defaults: [0, 5, 10, 15, 20, 40, 80],
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

