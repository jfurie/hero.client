import React from 'react';
import _ from 'lodash';

import { Styles } from 'material-ui';

const style = {
  badge:{
    fontSize: '13px',
    lineHeight: '18px',
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

    let { value, active } = this.props;
    let bgColor = null;
    let color = null;

    // text
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

    let currentStyle = _.merge(style, {badge: {backgroundColor: bgColor, color}});

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
