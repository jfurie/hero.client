import React from 'react';
import _ from 'lodash';

const style = {
  badge:{
    fontSize: '14px',
    lineHeight: '18px',
    color: 'rgba(255, 255, 255, 1.00)',
    backgroundColor: '#E91B62',
    borderRadius: '6px',
    display: 'inline-block',
    padding: '0px 16px',
    marginBottom: '8px',
    height: '18px',
  },
};

export default class Tag extends React.Component {

  _onTouchTap(...args) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(...args);
    }
  }

  render() {

    let { value } = this.props;
    let currentStyle = _.merge(style, this.props.style);

    return (
      <span onTouchTap={this._onTouchTap.bind(this)} style={currentStyle.badge} >{value}!</span>
    );
  }
}

Tag.propTypes = {
  onTouchTap: React.PropTypes.func,
  value: React.PropTypes.string.isRequired,
};
