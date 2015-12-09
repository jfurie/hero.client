import React from 'react';
import { ListItem, ListDivider, FontIcon } from 'material-ui';
//import Infinite from 'react-infinite';
import { CompanyAvatar } from '../../../components/web';
import { RingCandidate } from '../../../components/web';

const style = {
  peopleList: {
    marginTop: '7px',
  },
};

class CompanyJobsList extends React.Component {

  render() {

    let { jobs, company } = this.props;

    let people = [
      [
        'https://cap.stanford.edu/profiles/viewImage?profileId=65672&type=square',
        'https://lh5.googleusercontent.com/-ZadaXoUTBfs/AAAAAAAAAAI/AAAAAAAAAGA/19US52OmBqc/photo.jpg',
        'http://cdn.devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg',
      ],
      [
        'https://cap.stanford.edu/profiles/viewImage?profileId=65672&type=square',
        'http://www.biz.uiowa.edu/tippiemba/wp-content/uploads/2010/07/Kim-Hyundong-300x300.jpg',
      ],
    ];

    // TMP
    let nestedJobsItem = [];
    let index = 0;
    let fakeStatus = ['fav', 'vetted', 'rejected', 'vetted', 'none'];

    jobs.forEach(function(job) {

      let peopleList = [];

      people[index].forEach(function(p, key) {
        let status = fakeStatus.shift();
        peopleList.push(<RingCandidate key={key} picture={p} status={status}/>);
      });

      nestedJobsItem.push(
        <ListItem
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
        <ListDivider inset />
      </div>
    );
  }
}

CompanyJobsList.propTypes = {
  company: React.PropTypes.object,
  jobs: React.PropTypes.object.isRequired,
};

export default CompanyJobsList;
