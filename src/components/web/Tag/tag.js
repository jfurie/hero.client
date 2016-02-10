import React from 'react';
import _ from 'lodash';

import { Styles } from 'material-ui';

const style = {
  badge:{
    fontSize: '14px',
    lineHeight: '18px',
    color: 'rgba(255, 255, 255, 1.00)',
    borderRadius: '6px',
    display: 'inline-block',
    padding: '0px 16px',
    marginBottom: '8px',
    height: '18px',
    marginRight: '3px',
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
    let color = null;

    switch (this.props.color) {
    case 'green':
      color = Styles.Colors.lightGreen500;
      break;
    default:
      color = '#E91B62'; // default pink
      break;
    }

    let currentStyle = _.merge(style, {badge: {backgroundColor: color}});

    return (
      <span onTouchTap={this._onTouchTap.bind(this)} style={currentStyle.badge} >{value}</span>
    );
  }
}

Tag.propTypes = {
  color: React.PropTypes.string,
  onTouchTap: React.PropTypes.func,
  value: React.PropTypes.string.isRequired,
};