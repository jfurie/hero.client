import React from 'react';
import { ListItem, Divider, FontIcon } from 'material-ui';
//import Infinite from 'react-infinite';
import { CompanyAvatar } from '../../../components/web';
import { CandidateAvatar } from '../../../components/web';
import Immutable from 'immutable';

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

    // let people = [
    //   [
    //     'https://cap.stanford.edu/profiles/viewImage?profileId=65672&type=square',
    //     'https://lh5.googleusercontent.com/-ZadaXoUTBfs/AAAAAAAAAAI/AAAAAAAAAGA/19US52OmBqc/photo.jpg',
    //     'http://cdn.devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg',
    //   ],
    //   [
    //     'https://cap.stanford.edu/profiles/viewImage?profileId=65672&type=square',
    //     'http://www.biz.uiowa.edu/tippiemba/wp-content/uploads/2010/07/Kim-Hyundong-300x300.jpg',
    //   ],
    // ];

    // TMP
    let nestedJobsItem = [];
    let index = 0;
  //  let fakeStatus = ['fav', 'vetted', 'rejected', 'vetted', 'none'];
    let self = this;
    jobs.forEach(function(job) {
      let candidates = job.get('candidates');
      candidates = candidates || new Immutable.List();
      let peopleList = [];

      candidates.forEach(function(p, key) {
        //let status = fakeStatus.shift();
        peopleList.push(<CandidateAvatar key={key} email={p.get('contact').get('email')} status={p.get('status')}/>);
      });
      let secondaryText = (<div>No Candidates Yet</div>);
      if(peopleList.length > 0){
        secondaryText = (<div style={style.peopleList}>{peopleList}</div>);
      }

      nestedJobsItem.push(
        <ListItem
          onTouchTap={self._handleJobClick.bind(self, job)}
          primaryText={job.get('title')}
          secondaryText={
            secondaryText
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
          secondaryText={<p></p>}
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
