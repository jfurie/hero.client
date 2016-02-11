import React from 'react';

const DEFAULT_IMG = 'https://static.licdn.com/scds/common/u/img/themes/katy/ghosts/companies/ghost_company_40x40_v1.png';

class CompanyAvatar extends React.Component {

  constructor(props){
    super(props);

    let url = props.url;

    if (url) {
      url = url.toLowerCase();
      url = url.replace(/http(s?):\/\//, '');
      url = url.replace(/\/$/, '');

      this.state = {
        imgSrc: `https://logo.clearbit.com/${url}`,
      };
    } else {
      this.state = {
        imgSrc: DEFAULT_IMG,
      };
    }
  }

  _handleError() {
    this.setState({
      imgSrc: DEFAULT_IMG,
    });
  }

  render() {

    let { style } = this.props;

    if (style) {
      style.borderRadius = '0px';
      if(!style.width)
        style.width = '40px';
    }

    return (
      <img src={this.state.imgSrc} style={style} onError={this._handleError.bind(this)} />
    );
  }
}

CompanyAvatar.propTypes = {
  style: React.PropTypes.object,
  url: React.PropTypes.string,
};

export default CompanyAvatar;
