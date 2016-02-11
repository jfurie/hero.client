import React from 'react';
import _ from 'lodash';

import { Styles } from 'material-ui';

const style = {
  badge:{
    fontSize: '13px',
    lineHeight: '18px',
    color: 'rgba(255, 255, 255, 1.00)',
    borderRadius: '4px',
    display: 'inline-block',
    padding: '1px 16px',
    marginBottom: '8px',
    height: '17px',
    marginRight: '4px',
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
      color = Styles.Colors.green500;
      break;
    case 'gray':
      color = 'rgba(0, 0, 0, 0.54)';
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
