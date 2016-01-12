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
}), { getUserContact })
class LeftNavTop extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getUserContact(this.props.user.id);
  }

  render(){
    let userContact = this.props.users.userContact;

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
                <div>123</div>
                <div className="leftNavTop-label">Clients</div>
              </div>
              <div className="leftNavTop-tab col-xs-4">
                <div>123</div>
                <div className="leftNavTop-label">Jobs</div>
              </div>
              <div className="leftNavTop-tab col-xs-4">
                <div>123</div>
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
