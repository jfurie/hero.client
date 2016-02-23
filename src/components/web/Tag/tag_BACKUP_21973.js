import React from 'react';
import _ from 'lodash';

import { Styles } from 'material-ui';

const style = {
  badge:{
    fontSize: '12px',
    lineHeight: '18px',
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

<<<<<<< HEAD
    let { value, active } = this.props;
    let bgColor = null;
=======
    let { value, fixedWidth } = this.props;
>>>>>>> master
    let color = null;

    value = value.toLowerCase();

    // text
<<<<<<< HEAD
    if (active) {
      color = '#fff';
      switch (this.props.value) {
      case 'HOT!':
        bgColor = Styles.Colors.pink500; // default pink
        break;
      case 'Vetted':
        bgColor = Styles.Colors.green500;
        break;
      case 'Active':
        bgColor = Styles.Colors.grey500;
        break;
      default:
        bgColor = Styles.Colors.grey500;
        break;
      }
    }
    else {
      color = Styles.Colors.grey400;
      bgColor = Styles.Colors.grey200;
=======
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
>>>>>>> master
    }

    // color
    if (this.props.color) {
      switch (this.props.color) {
      case 'green':
        bgColor = Styles.Colors.green500;
        break;
      case 'pink':
        bgColor = Styles.Colors.pink500; // default pink
        break;
      default:
        bgColor = Styles.Colors.grey500; // default
        break;
      }
    }

<<<<<<< HEAD
    let currentStyle = _.merge(style, {badge: {backgroundColor: bgColor, color}});
=======
    fixedWidth = fixedWidth || 50;

    let currentStyle = _.merge(style, {badge: {backgroundColor: color, minWidth: `${fixedWidth}px`, maxWidth: `${fixedWidth}px`}});
>>>>>>> master

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
