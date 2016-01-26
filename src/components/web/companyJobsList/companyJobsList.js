import React from 'react';
import { ListItem, Divider, FontIcon, Avatar, Styles } from 'material-ui';
import { CompanyAvatar, Gravatar } from '../../../components/web';
import Immutable from 'immutable';

const style = {
  peopleList: {
    marginTop: '7px',
  },
  gravatar: {
    display: 'inline',
    width: '30px',
    height: '30px',
  },
  plusAvatar: {
    display: 'inline',
    width: '40px',
    height: '40px',
    padding: '7px 8px 7px 7px',
    fontSize: '16px',
    position: 'relative',
    top: '-11px',
  },
};

class CompanyJobsList extends React.Component {

  _handleJobClick(job){
    if (this.props.onJobClick) {
      this.props.onJobClick(job, this.props.company);
    }
  }

  render() {

    let { jobs, company } = this.props;

    let nestedJobsItem = [];
    let index = 0;

    let self = this;
    jobs.forEach(function(job) {

      let candidates = job.get('candidates');
      candidates = candidates || new Immutable.List();
      let peopleList = [];

      let limit = candidates.count();

      if (candidates.count() > 4) {
        limit = 4;
      }

      candidates.forEach(function(c, key) {
        if (key < limit) {
          peopleList.push(<Gravatar style={style.gravatar} key={key} email={c.get('contact').get('email')} status={c.get('status')}/>);
        }
      });

      // add a + circle if needed
      if (limit < candidates.count()) {
        peopleList.push(<Avatar style={style.plusAvatar} color="#FF1564" backgroundColor={Styles.Colors.grey300}>+{candidates.count() - limit}</Avatar>);
      }

      let secondaryText = (<div>No Candidates Yet</div>);
      if (peopleList.length > 0) {
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
