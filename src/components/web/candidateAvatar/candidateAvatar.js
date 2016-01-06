import React from 'react';
import { FontIcon } from 'material-ui';


class CandidateAvatar extends React.Component {

  render() {

    let style = {
      container: {
        display: 'inline',
        position: 'relative',
        marginRight: '7px',
      },
      picture: {
        width: '28px',
        height: '28px',
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

    let { picture, status } = this.props;
    let font = null;

    status = status || 'new';

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
      style.picture.borderColor = '#8D8D8D';
    }

    return (
      <div className='candidateAvatarContainer' style={style.container}>
        <img style={style.picture} src={picture} />
        {(font) ? (
          <FontIcon style={style.fontIcon} className="material-icons" color={style.fontIcon.color}>{font}</FontIcon>
        ) : (null)}
      </div>
    );
  }
}

CandidateAvatar.propTypes = {
  picture: React.PropTypes.string.isRequired,
  status: React.PropTypes.string,
};

export default CandidateAvatar;
