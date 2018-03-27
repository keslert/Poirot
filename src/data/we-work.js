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
          fontSize: '18px',
          lineHeight: '28px',
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
    max: 80,
    min: 20,
    darken: 10,
    lighten: 10,
  },
  roots: [
    {
      label: 'Black',
      hex: '#252729',
      level: 'primary',
      base: 50,
    },
    {
      label: 'Gray',
      hex: '#c1c1c2',
      level: 'primary',
      base: 50,
    },
    {
      label: 'Yellow',
      hex: '#ffd16d',
      level: 'primary',
      base: 50,
    },
    {
      label: 'Blue',
      hex: '#5499c3',
      level: 'secondary',
      base: 50,
    },
    {
      label: 'Red',
      hex: '#d86262',
      level: 'secondary',
      base: 50,
    },
    {
      label: 'Green',
      hex: '#599fa0',
      level: 'secondary',
      base: 50,
    },
  ]
}

const spacing = {
  defaults: [5, 10, 15, 20, 30, 40],
  exceptions: {
    forms: [3,4,5,10,20,30]
  }
}

export default {
  typography,
}

