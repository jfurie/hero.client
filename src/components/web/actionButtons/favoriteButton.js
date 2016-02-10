import React from 'react';
import { FontIcon, IconButton } from 'material-ui';
export default class FavoriteButton extends React.Component {
  render(){
    return (
      <IconButton iconStyle={{color:'#4A4A4A'}} tooltipPosition="top-center" tooltip="Star">
        <FontIcon style={{width:'24px'}} className="material-icons">star_rate</FontIcon>
      </IconButton>
    );
  }
}
