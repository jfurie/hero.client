import React from 'react';
import { Avatar } from 'material-ui';

class CompanyAvatar extends React.Component {

  render() {

    let { style, url } = this.props;

    url = url.replace(/http(s?):\/\//, '');
    url = url.replace(/\/$/, '');

    let imgSrc = `https://logo.clearbit.com/${url}`;

    //console.log(style);
    if (style) {
      style.borderRadius = '0px';
    }

    return (
      <Avatar
          src={imgSrc}
          style={style}
      />
    );
  }
}

CompanyAvatar.propTypes = {
  style: React.PropTypes.object,
  url: React.PropTypes.string.isRequired,
};

export default CompanyAvatar;
