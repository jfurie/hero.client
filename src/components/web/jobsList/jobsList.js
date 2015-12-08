import React from 'react';
import { List, ListItem, ListDivider } from 'material-ui';
//import Infinite from 'react-infinite';
import { CompanyAvatar } from '../../../components/web';

const style = {
  ringUser: {
    display: 'inline',
    width: '32px',
    height: '32px',
    marginRight: '5px',
    borderRadius: '160px',
  },
  peopleList: {
    marginTop: '7px',
  },
};

class JobsList extends React.Component {

  render() {

    let { jobs } = this.props;

    let people = [
      [
        'https://lh5.googleusercontent.com/-ZadaXoUTBfs/AAAAAAAAAAI/AAAAAAAAAGA/19US52OmBqc/photo.jpg',
        'http://cdn.devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg',
        'http://fe867b.medialib.glogster.com/media/92/92a0862b9fdfca48725ac9df17ea42ffd90f7bb1dcab4cac52b1f417feedd514/profile-20pic.jpg',
        'http://static4.businessinsider.com/image/52c9702c6bb3f751704f26dd/according-to-science-these-are-the-best-photos-to-use-in-your-dating-profile.jpg',
      ],
      [
        'http://cdn.devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg',
        'http://fe867b.medialib.glogster.com/media/92/92a0862b9fdfca48725ac9df17ea42ffd90f7bb1dcab4cac52b1f417feedd514/profile-20pic.jpg',
      ],
      [
        'https://cap.stanford.edu/profiles/viewImage?profileId=65672&type=square',
        'http://fe867b.medialib.glogster.com/media/92/92a0862b9fdfca48725ac9df17ea42ffd90f7bb1dcab4cac52b1f417feedd514/profile-20pic.jpg',
        'http://cdn.devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg',
      ],
      [
        'https://cap.stanford.edu/profiles/viewImage?profileId=65672&type=square',
      ],
    ];

    // let people1 = [];
    // people[0].forEach(function(p, index) {
    //   people1.push(<img key={index} style={style.ringUser} src={p} />)
    // });

    // TMP
    let nestedJobsItem = [];
    let index = 0;

    jobs.forEach(function(job) {

      let peopleList = [];

      //console.log(index, people[index]);

      people[index].forEach(function(p, key) {
        peopleList.push(<img key={key} style={style.ringUser} src={p} />)
      });

      nestedJobsItem.push(
        <ListItem
          primaryText={job.get('title')}
          secondaryText={
            <div style={style.peopleList}>{peopleList}</div>
          }
          secondaryTextLines={2}
          key={job.get('id')}
        />
      );

      index += 1;
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
