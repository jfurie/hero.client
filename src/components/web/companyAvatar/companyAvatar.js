import React from 'react';

const DEFAULT_IMG = 'https://static.licdn.com/scds/common/u/img/themes/katy/ghosts/companies/ghost_company_40x40_v1.png';

class CompanyAvatar extends React.Component {

  constructor(props){
    super(props);
    this.setUrl = this.setUrl.bind(this);
    this.state = {
      imgSrc: DEFAULT_IMG,
    };
  }
  componentDidMount(){
    this.setUrl(this.props);
  }
  setUrl(props){
    let url = props.url;

    if (url) {
      url = url.toLowerCase();
      url = url.replace(/http(s?):\/\//, '');
      url = url.replace(/\/$/, '');

      this.setState({
        imgSrc: `https://logo.clearbit.com/${url}`,
      });
    } else {
      this.setState({
        imgSrc: DEFAULT_IMG,
      });
    }
  }
  componentWillReceiveProps(props){
    this.setUrl(props);
  }
  handleTouchTap(e){
    if(this.props.onTouchTap){
      this.props.onTouchTap(e);
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
      <img onTouchTap={this.handleTouchTap.bind(this)} src={this.state.imgSrc} style={style} onError={this._handleError.bind(this)} />
    );
  }
}

CompanyAvatar.propTypes = {
  style: React.PropTypes.object,
  url: React.PropTypes.string,
};

export default CompanyAvatar;
