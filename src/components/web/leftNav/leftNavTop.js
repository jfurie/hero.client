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
    this.props.getUserContact(this.props.user.id);
    this.props.getUserStats(this.props.user.id);
  }

  render(){
    let contact = this.props.users.userContact;
    let stats = this.props.users.stats;

    if (contact && stats) {
      return (
        <div className="leftNavTop">
          <div className="leftNavTop-image center-xs">
            <Gravatar style={style.gravatar} email={contact.email} />
          </div>
          <div className="leftNavTop-name">
          {contact.displayName}
          </div>
          <div style={{margin:'auto', width: 'auto'}} className="container">
            <div className="leftNavTop-tabs row">
              <div className="leftNavTop-tab col-xs-4">
                <div>{stats.companyCount}</div>
                <div className="leftNavTop-label">Clients</div>
              </div>
              <div className="leftNavTop-tab col-xs-4">
                <div>{stats.jobCount}</div>
                <div className="leftNavTop-label">Jobs</div>
              </div>
              <div className="leftNavTop-tab col-xs-4">
                <div>{stats.candidateCount}</div>
                <div className="leftNavTop-label">Candidates</div>
              </div>
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
