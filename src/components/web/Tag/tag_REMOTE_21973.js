import React from 'react';
import _ from 'lodash';

import { Styles } from 'material-ui';

const style = {
  badge:{
    fontSize: '12px',
    lineHeight: '18px',
    color: 'rgba(255, 255, 255, 1.00)',
    borderRadius: '4px',
    display: 'inline-block',
    padding: '1px 16px',
    height: '17px',
    marginRight: '8px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
  },
};

export default class Tag extends React.Component {

  _onTouchTap(...args) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(...args);
    }
  }

  render() {

    let { value, fixedWidth } = this.props;
    let color = null;

    value = value.toLowerCase();

    // text
    switch (value) {
    case 'hot!':
      color = '#E91B62'; // default pink
      break;
    case 'vetted':
      color = Styles.Colors.green500;
      break;
    case 'active':
      color = Styles.Colors.green500;
      break;
    case 'lead':
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

    fixedWidth = fixedWidth || 50;

    let currentStyle = _.merge(style, {badge: {backgroundColor: color, minWidth: `${fixedWidth}px`, maxWidth: `${fixedWidth}px`}});

    return (
      <span onTouchTap={this._onTouchTap.bind(this)} style={currentStyle.badge} >{value}</span>
    );
  }
}

Tag.propTypes = {
  color: React.PropTypes.string,
  fixedWidth: React.PropTypes.number,
  onTouchTap: React.PropTypes.func,
  value: React.PropTypes.string.isRequired,
};
