const typography = {
  body: {
    fontFamily: 'Rubik',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 1.6,
  },
  categories: [
    {
      label: 'Headers',
      groups: [
        {
          label: 'Header 1',
          fontFamily: 'Rubik',
          fontWeight: 700,
          fontSize: '32px',
          lineHeight: '1.25',
        },
        {
          label: 'Header 2',
          fontFamily: 'Rubik',
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: '1.25',
        },
        {
          label: 'Header 3',
          fontFamily: 'Rubik',
          fontWeight: 700,
          fontSize: '20px',
          lineHeight: '1.25',
        },
      ]
    },
    {
      label: 'Copy',
      groups: [
        {
          label: 'Copy 1',
          fontFamily: 'Rubik',
          fontWeight: 400,
          fontSize: '16px',
        },
        {
          label: 'Copy 2',
          fontFamily: 'Rubik',
          fontWeight: 400,
          fontSize: '14px',
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
    red: {
      level: 'primary',
      use: ['color', 'backgroundColor'],
      colors: [
        {value: '#8d1409', base: 80},
        {value: '#bc1a0d', base: 70},
        {value: '#ec2110', base: 60},
        {value: '#F24B3D', base: 50},
        {value: '#f5776d', base: 40},
        {value: '#f8a49d', base: 30},
        {value: '#fcd0cc', base: 20},
        {value: '#ffffff', base: 0},
      ]
    },
    grey: {
      level: 'secondary',
      use: ['color', 'backgroundColor'],
      colors: [
        {value: '#333333', base: 80},
        {value: '#646464', base: 70},
        {value: '#7d7d7d', base: 60},
        {value: '#979797', base: 50},
        {value: '#b0b0b0', base: 40},
        {value: '#cacaca', base: 30},
        {value: '#eeeeee', base: 20},
        {value: '#ffffff', base: 0},
      ]
    },
  }
}

const spacing = {
  defaults: [0, 4, 8, 16, 32, 64, 128],
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

