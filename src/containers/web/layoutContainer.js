import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import { LeftNav, FontIcon, MenuItem} from 'material-ui';
import { getUserContact, getUserStats } from '../../modules/users';
//let MenuItem = require('material-ui/lib/menus/menu-item');

import { onNavOpen, onNavClose, toggleNav } from '../../modules/leftNav';
import { LeftNavTop } from '../../components/web';
import { logout, resetLogoutReady } from '../../modules/auth';

@connect(state => ({
  auth: state.auth,
  authToken: state.auth.authToken,
  user: state.auth.user,
  leftNav: state.leftNav,
  users: state.users,
}),{pushState, onNavOpen, onNavClose, toggleNav, logout,getUserContact, getUserStats, replaceState, resetLogoutReady})

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  componentDidMount(){
    if (this.props.user)
      this.props.getUserContact(this.props.user.id);
    if (this.props.authToken)
      this.props.getUserStats(this.props.authToken.accountInfo.account.id, this.props.user.id);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.auth.logoutReady) {
      this.props.resetLogoutReady();
      this.props.replaceState(null,'/login');
    }

    if (nextProps.leftNav.open != this.props.leftNav.open) {
      this.setState({
        open: !this.state.open,
      });
    }
    if (nextProps.user && !this.props.user)
      this.props.getUserContact(nextProps.user.id);

    if (nextProps.authToken && !this.props.authToken)
      this.props.getUserStats(nextProps.authToken.accountInfo.account.id, nextProps.user.id);
  }

  handleTouchTap (e) {
    e.stopPropagation();
    this.props.pushState(null, '/test');
  }

  clickHome () {
    this.props.pushState(null, '');
    this.setState({
      open: false,
    });
  }

  clickLogin () {
    this.props.pushState(null,'login');
    this.setState({
      open: false,
    });
  }

  clickClients() {
    this.props.pushState(null, 'clients');
    this.setState({
      open: false,
    });
  }

  clickLogout() {
    this.setState({
      open: false,
    });
    this.props.logout();
  }

  clickMyJobs() {
    this.props.pushState(null, '/jobs');
    this.setState({
      open: false,
    });
  }

  clickMyCandidates() {
    this.props.pushState(null, '/candidates');
    this.setState({
      open: false,
    });
  }
  clickContact(){
    let contact = this.props.users.userContact;
    this.props.pushState(null, '/contacts/'+contact.id);
    this.setState({
      open: false,
    });
  }

  render () {
    let {leftNav, user} = this.props;

    return (
      <div style={{
      }}>
      <LeftNav
        style={{backgroundColor:'#424242'}}
        ref="leftNavChildren" open={this.state.open}
        onRequestChange={open => this.setState({open})}
        docked={false}
        disableSwipeToOpen={leftNav.disableSwipeToOpen}>
        <LeftNavTop
          {...this.props}
          onContactClick={this.clickContact.bind(this)}
          onContactsClick={this.clickMyCandidates.bind(this)}
          onJobsClick={this.clickMyJobs.bind(this)}
          onClientsClick={this.clickClients.bind(this)}
          ></LeftNavTop>
        <MenuItem style={{color:'#e0e0e0'}} primaryText="Dashboard" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">view_quilt</FontIcon>} onTouchTap={this.clickHome.bind(this)} index={0} />
        <MenuItem style={{color:'#e0e0e0'}} primaryText="Clients" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">business</FontIcon>} onTouchTap={this.clickClients.bind(this)} index={0} />
        <MenuItem style={{color:'#e0e0e0'}} primaryText="Jobs" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">work</FontIcon>} onTouchTap={this.clickMyJobs.bind(this)} index={0} />
        <MenuItem style={{color:'#e0e0e0'}} primaryText="Candidates" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">people</FontIcon>} onTouchTap={this.clickMyCandidates.bind(this)} index={0} />
        {(user) ? (
          <MenuItem style={{color:'#e0e0e0'}} primaryText="Logout" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">vpn_key</FontIcon>} onTouchTap={this.clickLogout.bind(this)} index={0} />
        ) : (
          <MenuItem style={{color:'#e0e0e0'}} primaryText="Login" leftIcon={<FontIcon style={{color:'#e0e0e0'}} className="material-icons">vpn_key</FontIcon>} onTouchTap={this.clickLogin.bind(this)} index={0} />
        )}
        <MenuItem index={2}>
        </MenuItem>
      </LeftNav>
        {React.cloneElement(this.props.children, {
          key: this.props.location.pathname
        })}
      </div>
    );
  }
}

export default Layout;
