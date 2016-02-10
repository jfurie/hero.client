import React from 'react';
import { FontIcon, IconButton } from 'material-ui';

export default class EmailButton extends React.Component {
  _onTouchTapEmail() {
    let email = this.props.email;
    if(email){
      window.location.href=`mailto:${email}`;
    }
  }
  render(){
    if(this.props.email){
      return (
        <IconButton onTouchTap={this._onTouchTapEmail.bind(this)} iconStyle={{color:'#4A4A4A'}} tooltipPosition="top-center" tooltip="Email">
          <FontIcon style={{width:'24px'}} className="material-icons">email</FontIcon>
        </IconButton>
      );
    } else {
      return (<span></span>);
    }
  }
}
