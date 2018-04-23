import React from 'react';
import { Image, Box } from 'rebass';
import theme from '../styles/rebass-theme';

export default ({
  name, 
  size=18,
  color=theme.colors.black,
  highlight=theme.colors.red,
  selected,
}) => (
  <Box w={size}>
    <Image 
      src={`https://icon.now.sh/${name}/${size}/${(selected ? highlight : color).slice(1)}`} 
    />
  </Box>
)