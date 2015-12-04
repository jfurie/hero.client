import React from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import { LeftNav, FontIcon} from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
import { onNavOpen,onNavClose, toggleNav } from '../../modules/leftNav';

@connect(state => ({
  user: state.auth.user,
  leftNav: state.leftNav,
}),{pushState,onNavOpen,onNavClose,toggleNav})
class Layout extends React.Component {
  constructor() {
    super();
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.leftNav.open != this.props.leftNav.open){
      if(!this.selfSet){
        this.refs.leftNavChildren.toggle();
      } else{
        this.selfSet = false;
      }
    }
  }
  handleTouchTap (e) {e.stopPropagation();
    this.props.pushState(null, '/test');
  }

  onNavOpen(){
    this.selfSet = true;
    this.props.onNavOpen();
  }
  onNavClose(){
    this.selfSet = true;
    this.props.onNavClose();
  }
  onClick(){
    this.refs.leftNavChildren.toggle();
  }
  clickHome () {
    this.props.pushState(null, '');
    this.refs.leftNavChildren.toggle();
  }
  clickLogin () {
    this.props.pushState(null, '/login');
    this.refs.leftNavChildren.toggle();
  }
  clickClients () {
    this.props.pushState(null, '/clients');
    this.refs.leftNavChildren.toggle();
  }
  clickContacts () {
    this.props.pushState(null, '/contacts');
    this.refs.leftNavChildren.toggle();
  }
  clickSettings () {
    this.props.pushState(null, '/settings');
    this.refs.leftNavChildren.toggle();
  }
  clickLogout (){
    this.props.pushState(null, '/logout');
    this.refs.leftNavChildren.toggle();
  }
  render () {

    let {leftNav} = this.props;
    
    return (
      <div style={{
        height: '100%'
      }}>
      <LeftNav ref="leftNavChildren" onNavClose={this.onNavClose.bind(this)} onNavOpen={this.onNavOpen.bind(this)} docked={false} disableSwipeToOpen={leftNav.disableSwipeToOpen}>
        <MenuItem primaryText="Home" leftIcon={<FontIcon className="material-icons">home</FontIcon>} onTouchTap={this.clickHome.bind(this)} index={0} />
        <MenuItem primaryText="Clients" leftIcon={<FontIcon className="material-icons">work</FontIcon>} onTouchTap={this.clickClients.bind(this)} index={0} />
        <MenuItem primaryText="Contacts" leftIcon={<FontIcon className="material-icons">people</FontIcon>} onTouchTap={this.clickContacts.bind(this)} index={0} />
        <MenuItem primaryText="Settings" leftIcon={<FontIcon className="material-icons">settings</FontIcon>} onTouchTap={this.clickSettings.bind(this)} index={0} />
        <MenuItem primaryText="Login" leftIcon={<FontIcon className="material-icons">vpn_key</FontIcon>} onTouchTap={this.clickLogin.bind(this)} index={0} />
        <MenuItem primaryText="Logout" leftIcon={<FontIcon className="material-icons">vpn_key</FontIcon>} onTouchTap={this.clickLogout.bind(this)} index={0} />
        <MenuItem index={2}>
        </MenuItem>
      </LeftNav>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
