/**
There are 9 font styles in the Plasma design system.

6 bold styles to be used in headers, form labels and bold statements.
3 regular styles to be used in copy and form inputs.
Each style (below) covers typeface, weight, size, line-height and letter-spacing specifications. And also what sort of scenarios to use each style.
 */

// https://rivendell-docs.netlify.com/text-styles/
const typography = {
  body: {
    fontFamily: 'Apercu',
    fontWeight: 200,
    fontSize: '1rem',
    lineHeight: 1.625,
  },
  headers: [
    {
      /*
      Special use case only.
      Examples include the login screen and messaging.
      Should only be used once on a screen/page.
      */
      label: 'Impact 1',
      type: 'header',
      fontFamily: 'Knockout 48 A',
      fontWeight: 400,
      fontSize: '120px',
      letterSpacing: '2px',
      lineHeight: '100px',
    },
    {
      /*
      Special use case only.
      Examples include data entry in the Data Query product.
      Should only be used once on a screen/page.
      */
      label: 'Impact 2',
      type: 'header',
      fontFamily: 'Knockout 48 A',
      fontWeight: 400,
      fontSize: '80px',
      letterSpacing: '2px',
      lineHeight: '70px',
    },
    {
      // Primary style for all headers, excluding form labels.
      label: 'Title 0', 
      type: 'header',
      fontFamily: 'Apercu',
      fontWeight: 700,
      fontSize: '54px',
      lineHeight: '62px',
    },
    {
      // Special use case for form labels (when a larger style than Bold 5 is needed).
      label: 'Title 1', 
      type: 'header',
      fontFamily: 'Apercu',
      fontWeight: 700,
      fontSize: '34px',
      lineHeight: '42px',
    },
    {
      // Primary style for all form labels, and sub-headers.
      label: 'Title 2', 
      type: 'header',
      fontFamily: 'Apercu',
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: '32px',
    },
    {
      // Primary style for all form labels, and sub-headers.
      label: 'Title 3',
      type: 'header',
      fontFamily: 'Apercu',
      fontWeight: 700,
      fontSize: '18px',
      lineHeight: '28px',
    },
  ],
  copy: [
    {
      // Special use case style for copy and form inputs (when a larger style than Regular 2 is needed).
      label: 'Copy 1',
      fontFamily: 'Apercu',
      fontWeight: 200,
      fontSize: '24px',
      lineHeight: '36px',
    },
    {
      // Primary style for all body copy and form inputs.
      label: 'Copy 2',
      fontFamily: 'Apercu',
      fontWeight: 200,
      fontSize: '18px',
      lineHeight: '28px',
    },
    {
      /*
      Used as small print.
      Examples include a note, starred item, or an ID code.
      */
      label: 'Copy 3',
      fontFamily: 'Apercu',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '22px',
    },
    {
      /*
      Used as small print.
      Examples include a note, starred item, or an ID code.
      */
      label: 'Copy 4',
      fontFamily: 'Apercu',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '20px',
    },
  ]
}

export default {
  typography,
}

