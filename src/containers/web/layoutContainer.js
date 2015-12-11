import React from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import { LeftNav, FontIcon} from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
import { onNavOpen,onNavClose, toggleNav } from '../../modules/leftNav';
import {LeftNavTop} from '../../components/web';
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
  clickMyJobs (){
    this.props.pushState(null, '/myjobs');
    this.refs.leftNavChildren.toggle();
  }
  render () {

    let {leftNav, user} = this.props;

    return (
      <div style={{
      }}>
      <LeftNav style={{backgroundColor:'#424242'}} ref="leftNavChildren" onNavClose={this.onNavClose.bind(this)} onNavOpen={this.onNavOpen.bind(this)} docked={false} disableSwipeToOpen={leftNav.disableSwipeToOpen}>
        <LeftNavTop></LeftNavTop>
        <MenuItem style={{color:'#e0e0e0'}} primaryText="Home" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">home</FontIcon>} onTouchTap={this.clickHome.bind(this)} index={0} />
        <MenuItem style={{color:'#e0e0e0'}} primaryText="My Clients" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">work</FontIcon>} onTouchTap={this.clickClients.bind(this)} index={0} />
        <MenuItem style={{color:'#e0e0e0'}} primaryText="My Jobs" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">people</FontIcon>} onTouchTap={this.clickMyJobs.bind(this)} index={0} />
        <MenuItem style={{color:'#e0e0e0'}} primaryText="My Candidates" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">people</FontIcon>} onTouchTap={this.clickContacts.bind(this)} index={0} />
        <MenuItem style={{color:'#e0e0e0'}} primaryText="Settings" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">settings</FontIcon>} onTouchTap={this.clickSettings.bind(this)} index={0} />
        {(user) ? (
          <MenuItem style={{color:'#e0e0e0'}} primaryText="Logout" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">vpn_key</FontIcon>} onTouchTap={this.clickLogout.bind(this)} index={0} />
        ) : (
          <MenuItem style={{color:'#e0e0e0'}} primaryText="Login" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">vpn_key</FontIcon>} onTouchTap={this.clickLogin.bind(this)} index={0} />
        )}
        <MenuItem index={2}>
        </MenuItem>
      </LeftNav>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
