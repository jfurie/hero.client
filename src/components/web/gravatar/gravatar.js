import React from 'react';
import { Styles, Tooltip } from 'material-ui';
import md5 from 'md5';

class Gravatar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false,
    };
  }

  showTooltip() {
    this.setState({
      showTooltip: true,
    });
  }

  hideTooltip() {
    this.setState({
      showTooltip: false,
    });
  }

  render() {

    let { email, status, style } = this.props;

    //style = style || {};

    // extend style
    let _style = {
      container: {
        display: 'inline',
        position: 'relative',
        marginRight: '7px',
      },
      picture: {
        width: style.width || '40px',
        height: style.height || '40px',
        borderRadius: '50%',
        border: '2px solid',
        opacity: '1',
      },
    };

    style = {..._style, ...style};

    status = status || null;

    switch (status) {
    case 'interested': {
      style.picture.borderColor = Styles.Colors.lightGreen600;
      break;
    }
    case 'notinterested': {
      style.picture.borderColor = Styles.Colors.red600;
      break;
    }
    default:
      style.picture.borderColor = Styles.Colors.grey600;
    }

    // gravatar part
    if (email) {
      email = md5(email);
    } else {
      email = '00000000000000000000000000000000';
    }

    let imgSrc = `https://www.gravatar.com/avatar/${email}?d=mm`;
    //todo: add tooltip position (left, center, right)
    return (
      <div style={style}>
        <div style={style.container}>
          <img style={style.picture} src={imgSrc} onMouseOver={this.showTooltip.bind(this)} onMouseOut={this.hideTooltip.bind(this)} />
          <Tooltip
            label={this.props.label}
            show={this.state.showTooltip}
            style={{boxSizing: 'border-box', top: `-${style.picture.width}`, right: 0}} />
        </div>
      </div>
    );
  }
}

Gravatar.propTypes = {
  email: React.PropTypes.string,
  status: React.PropTypes.string,
  style: React.PropTypes.object,
};

export default Gravatar;
