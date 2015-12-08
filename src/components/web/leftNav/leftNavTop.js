import React from 'react';
import './leftNavTop.scss';
class LeftNavTop extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <div className="leftNavTop">
        <div className="leftNavTop-image center-xs">
          <img
              className="col-xs-5"
              src="/img/profile-image.png"
          />
        </div>
        <div className="leftNavTop-name">
          Iwanna Help
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
}

export default LeftNavTop;
