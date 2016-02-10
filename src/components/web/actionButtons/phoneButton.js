import React from 'react';
import { FontIcon, IconButton } from 'material-ui';
export default class PhoneButton extends React.Component {
  _onTouchTapCall() {
    window.location.href='tel:'+this.props.phone;
  }
  render(){
    if(this.props.phone){
      return (
        <IconButton onTouchTap={this._onTouchTapCall.bind(this)} iconStyle={{color:'#4A4A4A'}} tooltipPosition="top-center" tooltip="Call">
          <FontIcon style={{width:'24px'}} className="material-icons">phone</FontIcon>
        </IconButton>
      );
    } else {
      return (<span></span>);
    }
  }
}
