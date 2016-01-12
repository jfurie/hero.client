import React from 'react';
import { FontIcon } from 'material-ui';
import md5 from 'md5';

class Gravatar extends React.Component {

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
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px solid',
        opacity: '1',
      },
      fontIcon: {
        position: 'absolute',
        top: '-20px',
        right: '-6px',
        fontSize: '16px',
        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.39)',
      },
    };

    style = Object.assign(_style, style);

    status = status || 'new';
    let font = null;

    switch (status) {
    case 'active': {
      style.picture.borderColor = '#40bb3f';
      style.fontIcon.color = '#40bb3f';
      font = 'done';
      break;
    }
    case 'inactive': {
      style.picture.borderColor = '#959494';
      style.picture.opacity = '0.5';
      style.fontIcon.color = '#959494';
      font = 'block';
      break;
    }
    default:
      style.picture.border = '0px solid';
    }

    // gravatar part
    email = md5(email) || '00000000000000000000000000000000';
    let imgSrc = `http://www.gravatar.com/avatar/${email}?d=mm`;

    return (
      <div style={style}>
        <div style={style.container}>
          <img style={style.picture} src={imgSrc} />
          {(font) ? (
            <FontIcon style={style.fontIcon} className="material-icons" color={style.fontIcon.color}>{font}</FontIcon>
          ) : (null)}
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
