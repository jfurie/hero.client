import React from 'react';
import { connect } from 'react-redux';
import { getUserContact } from '../../../modules/users';
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
  companies: state.companies,
  jobs: state.jobs,
  candidates: state.candidates,
}), { getUserContact })
class LeftNavTop extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.props.getUserContact(nextProps.user.id);
    }
  }

  render(){
    let userContact = this.props.users.userContact;
    let clientCount = this.props.companies.list.size;
    let jobCount = this.props.jobs.list.size;
    let candidateCount = this.props.candidates.list.size;

    if (userContact) {
      return (
        <div className="leftNavTop">
          <div className="leftNavTop-image center-xs">
            <Gravatar style={style.gravatar} email={userContact.email} />
          </div>
          <div className="leftNavTop-name">
          {userContact.displayName}
          </div>
          <div style={{marginLeft:'.5em', marginRight:'.5em'}} className="container">
            <div className="leftNavTop-tabs row">
              <div className="leftNavTop-tab col-xs-4">
                <div>{clientCount}</div>
                <div className="leftNavTop-label">Clients</div>
              </div>
              <div className="leftNavTop-tab col-xs-4">
                <div>{jobCount}</div>
                <div className="leftNavTop-label">Jobs</div>
              </div>
              <div className="leftNavTop-tab col-xs-4">
                <div>{candidateCount}</div>
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
