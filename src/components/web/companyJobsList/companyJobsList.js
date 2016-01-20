import React from 'react';
import { ListItem, Divider, FontIcon } from 'material-ui';
import { CompanyAvatar, Gravatar } from '../../../components/web';

const style = {
  peopleList: {
    marginTop: '7px',
  },
};

class CompanyJobsList extends React.Component {

  _handleJobClick(job){
    if (this.props.onJobClick) {
      this.props.onJobClick(job);
    }
  }

  render() {

    let { jobs, company } = this.props;

    // TMP
    let nestedJobsItem = [];
    let index = 0;
    let self = this;
    jobs.forEach(function(job) {

      let peopleList = [];
      let candidates = job.get('candidates');

      //console.log(candidates);

      /* NOT WORKING */

      if (candidates) {
        candidates.forEach(function(c, key) {
          peopleList.push(<Gravatar key={key} email={c.get('contact').get('email')} status={c.get('status')}/>);
        });
      }

      nestedJobsItem.push(
        <ListItem
          onTouchTap={self._handleJobClick.bind(self, job)}
          primaryText={job.get('title')}
          secondaryText={
            <div style={style.peopleList}>{peopleList}</div>
          }
          rightIcon={<FontIcon className="material-icons">info</FontIcon>}
          secondaryTextLines={2}
          key={job.get('id')}
        />
      );

      index += 1;
    });

    return (

      <div>
        <ListItem
          primaryText={company.get('name')}
          leftAvatar={<CompanyAvatar url={company.get('website')} />}
          secondaryText={<p>Santa Monica, CA</p>}
          initiallyOpen={true}
          nestedItems={nestedJobsItem}
        />
        <Divider inset />
      </div>
    );
  }
}

CompanyJobsList.propTypes = {
  company: React.PropTypes.object,
  jobs: React.PropTypes.object.isRequired,
  onJobClick: React.PropTypes.func,
};

export default CompanyJobsList;
