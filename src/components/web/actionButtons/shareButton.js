import React from 'react';
import { FontIcon, IconButton, Styles } from 'material-ui';
export default class ShareButton extends React.Component {
  share() {
    if (this.props.onTouchTap) {
      this.props.onTouchTap();
    }
  }

  render(){
    return (
      <IconButton onTouchTap={this.share.bind(this)} iconStyle={{color:Styles.Colors.grey600}} tooltipPosition="top-center" tooltip="Share">
        <FontIcon style={{width:'24px'}} className="material-icons">share</FontIcon>
      </IconButton>
    );
  }
}
