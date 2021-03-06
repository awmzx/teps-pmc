import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as svgSources from './svg';

export default class Loading extends Component {
  static propTypes = {
    color: PropTypes.string,
    delay: PropTypes.number,
    type: PropTypes.string,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };

  static defaultProps = {
    color: '#fff',
    delay: 0,
    type: 'balls',
    height: 64,
    width: 64,
  };

  state = {
    delayed: this.props.delay > 0,
  };

  componentDidMount() {
    const { delay } = this.props;
    const { delayed } = this.state;

    if (delayed) {
      this.timeout = setTimeout(() => {
        this.setState({
          delayed: false,
        });
      }, delay);
    }
  }

  componentWillUnmount() {
    const { timeout } = this;

    if (timeout) {
      clearTimeout(timeout);
    }
  }

  render() {
    const {
      color, delay, type, height, width, ...restProps
    } = this.props;
    const selectedType = this.state.delayed ? 'blank' : type;
    const svg = svgSources[selectedType];
    const style = {
      fill: color,
      height,
      width,
    };

    return (
      <div
        style={style}
        dangerouslySetInnerHTML={{ __html: svg }}
        {...restProps}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./lib/react-loading.jsx