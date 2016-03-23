import React from 'react';
import {AppBar, IconButton, Styles} from 'material-ui';

class PublicHeader extends React.Component {
  constructor(props){
    super(props);
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.state= {'windowWidth':clientWidth};
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  apply() {
    location.href = '/';
  }

  handleResize() {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.setState({'windowWidth':clientWidth});
  }

  render() {
    // compile style
    let style = {
      position: 'fixed',
      backgroundColor: Styles.Colors.grey900,
      width:'100%',
    };

    if(this.state.windowWidth > 768){
      style.width ='375px';
    }

    let iconStyle = {
      color: Styles.Colors.white,
    };

    let iconLeft = (
      <img onClick={this.props.onTouchTap.bind(this)} src="/img/hero-logo.png" style={{position: 'absolute', height: '30px', marginTop: '7px', marginLeft: '16px'}} />
    );

    let iconRight = (
      <span>
        <IconButton iconStyle={iconStyle} onTouchTap={this.props.onTouchTap.bind(this)} iconClassName="material-icons">search</IconButton>
        <IconButton iconStyle={iconStyle} onTouchTap={this.props.onTouchTap.bind(this)} iconClassName="material-icons">menu</IconButton>
      </span>
    );


    return (
      <div>
        <AppBar
            iconElementLeft={iconLeft}
            iconElementRight={iconRight}
            style={style}
            title={this.props.title || ''}
        />
      <div style={{height: '64px'}}></div>
      </div>
    );
  }
}

PublicHeader.propTypes = {

};


export default PublicHeader;
