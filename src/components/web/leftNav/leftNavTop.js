import React from 'react';
import { connect } from 'react-redux';
import { getUserContact, getUserStats } from '../../../modules/users';
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

@connect(state => ({
  authToken: state.auth.authToken,
  user: state.auth.user,
  users: state.users,
}), { getUserContact, getUserStats }, null, { withRef: true })
class LeftNavTop extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let self = this;

    let id = setInterval(() => {
      if (self.props.user) {
        self.refresh();
        clearInterval(id);
      }
    }, 500);
  }

  refresh() {
    if (this.props.user)
      this.props.getUserContact(this.props.user.id);

    if (this.props.authToken)
      this.props.getUserStats(this.props.authToken.accountInfo.account.id, this.props.user.id);
  }

  render(){
    let contact = this.props.users.userContact;
    let stats = this.props.users.stats;

    if (contact && stats) {
      return (
        <div className="leftNavTop row center-xs">
          <div className="leftNavTop-image col-xs-12">
            <div className='box'>
              <Gravatar style={style.gravatar} email={contact.email} />
            </div>
          </div>
          <div className="leftNavTop-name col-xs-12">
            <div className='box'>
              <p>{contact.displayName}</p>
            </div>
          </div>
          <div className="leftNavTop-tab col-xs-4" style={{marginLeft: '-12px'}}>
            <div className="box">
              <div>{stats.companyCount}</div>
              <div className="leftNavTop-label">Clients</div>
            </div>
          </div>
          <div className="leftNavTop-tab col-xs-4">
            <div className="box">
              <div>{stats.jobCount}</div>
              <div className="leftNavTop-label">Jobs</div>
            </div>
          </div>
          <div className="leftNavTop-tab col-xs-4">
            <div className="box">
              <div>{stats.candidateCount}</div>
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
