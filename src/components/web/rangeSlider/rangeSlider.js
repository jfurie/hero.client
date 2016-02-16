import React from 'react';
import {  } from 'material-ui';
let ReactSlider = require('react-slider');

import './rangeSlider.scss';

export default class RangeSlider extends React.Component {
  onChange(value) {

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    function kFormatter(num) {
      return num > 999 ? `${(num/1000).toFixed(0)}k` : num;
    }

    return (
      <div style={{paddingTop: '30px'}}>
        <ReactSlider className="horizontal-slider"
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
            value={this.props.value}
            withBars={true}
            pearling={true}
            onChange={this.onChange.bind(this)}
        >
          <div>
            <span className="label">{this.props.format === 'money' ? '$' + kFormatter(this.props.value[0]) : this.props.value[0]}</span>
            <span className="target"></span>
          </div>
          <div>
            <span className="label">{this.props.format === 'money' ? '$' + kFormatter(this.props.value[1]) : this.props.value[1]}</span>
            <span className="target"></span>
          </div>
        </ReactSlider>
      </div>
    );
  }
}
