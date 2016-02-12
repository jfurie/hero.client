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

    // text
    switch (this.props.value) {
    case 'HOT!':
      color = '#E91B62'; // default pink
      break;
    case 'Vetted':
      color = Styles.Colors.green500;
      break;
    case 'Active':
      color = Styles.Colors.green500;
      break;
    default:
      color = Styles.Colors.grey500;
      break;
    }

    // color
    if (this.props.color) {
      switch (this.props.color) {
      case 'green':
        color = Styles.Colors.green500;
        break;
      case 'pink':
        color = '#E91B62'; // default pink
        break;
      default:
        color = Styles.Colors.grey500; // default
        break;
      }
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
