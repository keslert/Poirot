import React from 'react'
import PropTypes from 'prop-types'
import toCss from 'to-css'

class Style extends React.Component {
  
  static propTypes = {
    css: PropTypes.object.isRequired,
  }

  state = { 
    rules: toCss(this.props.css)
  }

  componentWillReceiveProps(next) {
    if (next.css === this.props.css) return
    const rules = toCss(next.css)
    this.setState({rules})
  }

  render() {
    const { rules } = this.state;
    return (
      rules 
        ? <style
            dangerouslySetInnerHTML={{
              __html: rules
            }}
          />
        : null
    )
  }
}
export default Style;