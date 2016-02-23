import React from 'react';
import { FontIcon, IconButton, Styles } from 'material-ui';

export default class FindButton extends React.Component {
  _onTouchTapFind() {

  }
  render(){
    return (
      <IconButton onTouchTap={this._onTouchTapFind.bind(this)} iconStyle={{color:Styles.Colors.grey600}} tooltipPosition="top-center" tooltip="Find">
        <FontIcon style={{width:'24px'}} className="material-icons">search</FontIcon>
      </IconButton>
    );
  }
}
