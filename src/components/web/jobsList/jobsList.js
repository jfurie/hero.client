import React from 'react';
import { List, ListItem, ListDivider } from 'material-ui';
//import Infinite from 'react-infinite';
import { CompanyAvatar } from '../../../components/web';


class JobsList extends React.Component {

  render() {

    let { jobs } = this.props;
    
    // TMP
    let nestedJobsItem = [];

    jobs.forEach(function(job) {
      nestedJobsItem.push(
        <ListItem
          primaryText={job.get('title')}
          secondaryText={<p>lorem ipsum</p>}
          secondaryTextLines={2}
          key={job.get('id')}
        />
      );
    });

    return (

      <List subheader={`${jobs.count() * 2} Jobs`}>
        <ListItem
          primaryText="Ring.com"
          leftAvatar={<CompanyAvatar url={'http://ring.com'} />}
          secondaryText={<p>Santa Monica, CA</p>}
          initiallyOpen={true}
          nestedItems={nestedJobsItem}
        />
        <ListDivider inset />
        <ListItem
          primaryText="Google"
          leftAvatar={<CompanyAvatar url={'http://google.com'} />}
          secondaryText={<p>Los Angeles, CA</p>}
          initiallyOpen={true}
          nestedItems={nestedJobsItem}
        />
        <ListDivider inset />
      </List>
    );
  }
}

JobsList.propTypes = {
  jobs: React.PropTypes.object.isRequired,
};

export default JobsList;
