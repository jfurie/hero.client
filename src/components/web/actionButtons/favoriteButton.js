import React from 'react';
import { FontIcon, IconButton } from 'material-ui';
export default class FavoriteButton extends React.Component {
  constructor(props) {
    super(props);
  }

  _onTouchTap() {
    if (this.props.onTouchTap) {
      this.props.onTouchTap();
    }
  }

  render(){
    let color = '#4A4A4A';

    if (this.props.isFavorited) {
      color = '#FBC02D';
    }

    return (
      <IconButton onTouchTap={this._onTouchTap.bind(this)} iconStyle={{color}} tooltipPosition="top-center" tooltip="Star">
        <FontIcon style={{width:'24px'}} className="material-icons">star_rate</FontIcon>
      </IconButton>
    );
  }
}
