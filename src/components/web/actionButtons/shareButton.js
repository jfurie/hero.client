import React from 'react';
import { FontIcon, IconButton, Styles } from 'material-ui';
export default class ShareButton extends React.Component {
  _onTouchTapShare() {
    let subject = 'Check out '+ this.props.company.get('name')+ ' on HERO';
    let body = encodeURIComponent(this.props.company.get('name')) +'%0A' + encodeURIComponent(window.location.href);
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }
  render(){
    return (
      <IconButton onTouchTap={this._onTouchTapShare.bind(this)} iconStyle={{color:Styles.Colors.grey600}} tooltipPosition="top-center" tooltip="Share">
        <FontIcon style={{width:'24px'}} className="material-icons">share</FontIcon>
      </IconButton>
    );
  }
}
