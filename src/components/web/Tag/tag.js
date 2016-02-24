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
    marginBottom: '8px',
  },
};

export default class Tag extends React.Component {

  _onTouchTap(...args) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(...args);
    }
  }

  render() {

    let { value, active, fixedWidth } = this.props;
    let bgColor = null;
    let color = null;

    value = value.toLowerCase();

    // text
    if (active) {
      color = '#fff';
      switch (value) {
      case 'hot!':
        bgColor = Styles.Colors.pink500; // default pink
        break;
      case 'vetted':
        bgColor = Styles.Colors.green500;
        break;
      case 'active':
        bgColor = Styles.Colors.grey500;
        break;
      case 'lead':
        bgColor = Styles.Colors.green500;
        break;
      default:
        bgColor = Styles.Colors.grey500;
        break;
      }
    }
    else {
      color = Styles.Colors.grey400;
      bgColor = Styles.Colors.grey200;
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

    fixedWidth = fixedWidth || 50;

    let currentStyle = _.merge(style, {badge: {backgroundColor: bgColor, color, minWidth: `${fixedWidth}px`, maxWidth: `${fixedWidth}px`}});

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
