import React from 'react';
import { Gravatar } from '../../../components/web';

import './leftNavTop.scss';

const style = {
  gravatar: {
    container: {
      marginRight: '0',
    },
    picture: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
    },
  },
};

class LeftNavTop extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  refresh() {
    if (this.props.user)
      this.props.getUserContact(this.props.user.id);

    if (this.props.authToken)
      this.props.getUserStats(this.props.authToken.accountInfo.account.id, this.props.user.id);
  }
  _handleContactClick(){
    if(this.props.onContactClick){
      this.props.onContactClick();
    }
  }
  _handleContactsClick(){
    if(this.props.onContactsClick){
      this.props.onContactsClick();
    }
  }
  _handleClientsClick(){
    if(this.props.onClientsClick){
      this.props.onClientsClick();
    }
  }
  _handleJobsClick(){
    if(this.props.onJobsClick){
      this.props.onJobsClick();
    }
  }

  render(){
    let contact = this.props.users.userContact;
    let stats = this.props.users.stats;

    if (contact) {
      return (
        <div className="leftNavTop row center-xs">
          <div onTouchTap={this._handleContactClick.bind(this)} className="leftNavTop-image col-xs-12">
            <div className='box'>
              <Gravatar style={style.gravatar} email={contact.email} />
            </div>
          </div>
          <div onTouchTap={this._handleContactClick.bind(this)} className="leftNavTop-name col-xs-12">
            <div className='box'>
              <p>{contact.displayName}</p>
            </div>
          </div>
          <div className="leftNavTop-tab col-xs-4">
            <div onTouchTap={this._handleClientsClick.bind(this)} className="box">
              <div>{stats && stats.companyCount}</div>
              <div className="leftNavTop-label">Clients</div>
            </div>
          </div>
          <div className="leftNavTop-tab col-xs-4">
            <div onTouchTap={this._handleJobsClick.bind(this)} className="box">
              <div>{stats && stats.jobCount}</div>
              <div className="leftNavTop-label">Jobs</div>
            </div>
          </div>
          <div className="leftNavTop-tab col-xs-4">
            <div onTouchTap={this._handleContactsClick.bind(this)} className="box">
              <div>{stats && stats.candidateCount}</div>
              <div className="leftNavTop-label">Candidates</div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div></div>
      );
    }
  }
}

export default LeftNavTop;
