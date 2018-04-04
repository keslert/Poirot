import React from 'react';
import { connect } from 'react-redux';
import { Box, Flex, Subhead } from 'rebass';
import MarginPaddingUI from './margin-padding';
import Select from 'react-select';
import TypographyPicker from './typography-picker';


class StyleMenu extends React.Component {

  render() {
    return (
      <Flex p={2} align="center" direction="column">
        <MarginPaddingUI />

        <Flex justify="space-between" align="center" w="100%">
          <Subhead f={1}>Typography</Subhead>
          <TypographyPicker 
            options={this.props.typography.categories}
            />
        </Flex>
        
      </Flex>
    )
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(StyleMenu);