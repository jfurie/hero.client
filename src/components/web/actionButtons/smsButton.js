import React from 'react';
import { FontIcon, IconButton, Styles } from 'material-ui';
export default class SmsButton extends React.Component {
  _onTouchTapCall() {
    window.location.href='sms:'+this.props.phone;
  }
  render(){
    if(this.props.phone){
      return (
        <IconButton onTouchTap={this._onTouchTapCall.bind(this)} iconStyle={{color:Styles.Colors.grey600}} tooltipPosition="top-center" tooltip="Text">
          <FontIcon style={{width:'24px'}} className="material-icons">textsms</FontIcon>
        </IconButton>
      );
    } else {
      return (<span></span>);
    }
  }
}
