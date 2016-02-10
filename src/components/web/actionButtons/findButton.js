import React from 'react';
import { FontIcon, IconButton } from 'material-ui';

export default class FindButton extends React.Component {
  _onTouchTapFind() {

  }
  render(){
    return (
      <IconButton onTouchTap={this._onTouchTapFind.bind(this)} iconStyle={{color:'#4A4A4A'}} tooltipPosition="top-center" tooltip="Find">
        <FontIcon style={{width:'24px'}} className="material-icons">search</FontIcon>
      </IconButton>
    );
  }
}
