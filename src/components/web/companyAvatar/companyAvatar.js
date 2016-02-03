import React from 'react';

class CompanyAvatar extends React.Component {

  constructor(props){
    super(props);

    let url = props.url;
    url = url.toLowerCase();
    url = url.replace(/http(s?):\/\//, '');
    url = url.replace(/\/$/, '');

    this.state = {
      imgSrc: `https://logo.clearbit.com/${url}`,
    };
  }

  _handleError() {
    this.setState({
      imgSrc: 'https://static.licdn.com/scds/common/u/img/themes/katy/ghosts/companies/ghost_company_40x40_v1.png',
    });
  }

  render() {

    let { style } = this.props;

    if (style) {
      style.borderRadius = '0px';
      style.width = '40px';
    }

    return (
      <img src={this.state.imgSrc} style={style} onError={this._handleError.bind(this)} />
    );
  }
}

CompanyAvatar.propTypes = {
  style: React.PropTypes.object,
  url: React.PropTypes.string.isRequired,
};

export default CompanyAvatar;
