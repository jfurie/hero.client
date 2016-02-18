import React from 'react';
import { FontIcon, IconButton } from 'material-ui';
export default class FavoriteButton extends React.Component {
  render(){
    let color = '#4A4A4A';

    if (this.props.isFavorited) {
      color = '#FDD835';
    }
    
    return (
      <IconButton iconStyle={{color}} tooltipPosition="top-center" tooltip="Star">
        <FontIcon style={{width:'24px'}} className="material-icons">star_rate</FontIcon>
      </IconButton>
    );
  }
}
