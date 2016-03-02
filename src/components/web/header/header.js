import React from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {AppBar, IconButton, Styles} from 'material-ui';
import {toggleNav} from '../../../modules/leftNav';

@connect(state => ({
  user: state.auth.user,
}), { toggleNav, pushState })
class Header extends React.Component {

  menuClicked() {

    if (this.props.goBack) {
      this.props.goBack();
    } else {
      this.props.toggleNav();
    }
  }
  homeClicked() {
    this.props.pushState(null,'/');
  }
  searchClicked() {
    this.props.pushState(null,'/search');
  }

  render() {

    let transparent = this.props.transparent || false;

    let leftIconFont = 'menu';
    if (this.props.goBack) {
      leftIconFont = 'chevron_left';
    }

    // compile style
    let style = {
      position: 'fixed',
      backgroundColor: Styles.Colors.grey900,
    };
    let iconStyle = {};
    iconStyle.color= '#ffffff';
    if (transparent) {
      style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%)';
      style.boxShadow = 'none';
      iconStyle.color= '#ffffff';
    }

    let iconRightProp = {...this.props.iconRight};
    if(iconRightProp){
      iconRightProp.style = iconStyle;
    }

    let iconRight = <span><IconButton iconStyle={iconStyle} onTouchTap={this.searchClicked.bind(this)} iconClassName='material-icons'>search</IconButton> {this.props.iconRight}</span>

    //console.log(this.props.history);
    let iconLeft = null;
    if(this.props.showHome){
      iconLeft = <span><IconButton iconStyle={iconStyle} onTouchTap={this.menuClicked.bind(this)} iconClassName='material-icons'>{leftIconFont}</IconButton><IconButton iconStyle={iconStyle} onTouchTap={this.homeClicked.bind(this)} iconClassName='material-icons'>home</IconButton></span>;
    } else {
      iconLeft = <IconButton onTouchTap={this.menuClicked.bind(this)} iconClassName='material-icons'>{leftIconFont}</IconButton>;
    }
    return (
      <div>
        <AppBar
          iconElementRight={iconRight}
          style={style}
          title={this.props.title || ''}
          iconElementLeft={iconLeft}
        />
      {transparent?(<div ></div>): (<div style={{height: '64px'}}></div>)}
      </div>
    );
  }
}
//
Header.propTypes = {
  goBack: React.PropTypes.func,
  title: React.PropTypes.string,
  transparent: React.PropTypes.bool,
};


export default Header;
