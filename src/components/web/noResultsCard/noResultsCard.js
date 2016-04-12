import React from 'react';
import { Card, CardTitle, CardText, CardActions, FlatButton } from 'material-ui';

class NoResultsCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { title, text, actionLabel, action } = this.props;

    return (
      <Card style={{margin: '8px'}}>
        <CardTitle
            title={title || 'No results'}
        />
        <CardText>
          {text || 'No results found'}
        </CardText>
        {
          action ?
          <CardActions>
            <FlatButton primary label={actionLabel || 'Action'} onTouchTap={action.bind(this)} />
          </CardActions>
          : (null)
        }
      </Card>
    );
  }
}

NoResultsCard.propTypes = {

};

export default NoResultsCard;
