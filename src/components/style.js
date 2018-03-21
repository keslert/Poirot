import React from 'react'
import PropTypes from 'prop-types'
import stylis from 'stylis'

class Style extends React.Component {
  
  static propTypes = {
    css: PropTypes.string.isRequired,
    selector: PropTypes.string.isRequired,
  }

  state = { 
    rules: stylis(this.props.selector, this.props.css)
  }

  componentWillReceiveProps(next) {
    if (next.css === this.props.css) return
    const rules = stylis(next.selector, next.css)
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