import React from 'react';
import { List, ListItem, ListDivider } from 'material-ui';
import Infinite from 'react-infinite';

class JobsList extends React.Component {

  render() {

    let { jobs } = this.props;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return (

      <List style={{backgroundColor:'transparant'}} subheader={`${jobs.count()} Jobs`}>
        <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
          {jobs.map((job) => {

            return (
              <div>
                <ListItem
                  primaryText={job.get('title')}
                  secondaryText={<p>lorem ipsum</p>}
                  secondaryTextLines={2}
                />
                <ListDivider inset={true} />
              </div>
            );
          })}
        </Infinite>
      </List>
    );
  }
}

JobsList.propTypes = {
  jobs: React.PropTypes.object.isRequired,
};

export default JobsList;
