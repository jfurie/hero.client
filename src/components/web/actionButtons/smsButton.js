import React from 'react';
import { FontIcon, IconButton } from 'material-ui';
export default class SmsButton extends React.Component {
  _onTouchTapCall() {
    window.location.href='sms:'+this.props.phone;
  }
  render(){
    if(this.props.phone){
      return (
        <IconButton onTouchTap={this._onTouchTapCall.bind(this)} iconStyle={{color:'#4A4A4A'}} tooltipPosition="top-center" tooltip="Text">
          <FontIcon style={{width:'24px'}} className="material-icons">textsms</FontIcon>
        </IconButton>
      );
    } else {
      return (<span></span>);
    }
  }
}
