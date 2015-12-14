import React from 'react';
import { Card, CardText, TextField, IconButton} from 'material-ui';
export default class CandidateSearch extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <Card>
        <CardText>
          <TextField
            fullWidth
            floatingLabelText="Search Candidates"
            >
          </TextField>
          <TextField
            fullWidth
            floatingLabelText="Location"
            >
          </TextField>
          <div>
            <IconButton iconClassName="material-icons" tooltipPosition="top-center"
          tooltip="View List">view_list</IconButton> |
            <IconButton iconClassName="material-icons" tooltipPosition="top-center"
  tooltip="View Map">location_on</IconButton> |
  <IconButton iconClassName="material-icons" tooltipPosition="top-center"
tooltip="View Favorites">favorite</IconButton>
          </div>
          <div>
            
          </div>
        </CardText>
      </Card></div>

    );
  }
}
