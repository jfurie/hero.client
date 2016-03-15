import React from 'react';
import { List } from 'material-ui';
import Infinite from 'react-infinite';
import { JobCardContainer } from '../../../components/web';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';

const style = {
  textField: {
    float:'left',
    marginTop:'4px',
  },
  list: {
    backgroundColor: 'transparant',
  },
};

@connect(() => (
{}), {pushState})
class JobsList extends React.Component {

  _handleJobClick(job, company){
    if (this.props.onJobClick) {
      this.props.onJobClick(job, company);
    }
  }

  _showJobDetails(job) {
    this.props.pushState(null, `/clients/${job.get('companyId')}/jobs/${job.get('id')}`);
  }

  favoriteJob(job) {
    if (this.props.favoriteJob) {
      this.props.favoriteJob(job);
    }
  }

  unfavoriteJob(job) {
    if (this.props.unfavoriteJob) {
      this.props.unfavoriteJob(job);
    }
  }

  render() {
    // let { jobs, ressourceName, ressourceNamePlurial } = this.props;
    //
    // ressourceName = ressourceName || 'Job';
    // ressourceNamePlurial = ressourceNamePlurial || 'Jobs';
    //
    // if (ressourceName !== 'Job' && ressourceNamePlurial === 'Jobs') {
    //   ressourceNamePlurial = `${ressourceName}s`;
    // }
    //
    // let companies = new Immutable.Map();
    // let jobsByCompany = new Immutable.Map();
    // jobs.map(function(job){
    //   let companyMap = {};
    //   let jobMap = {};
    //   if(job.get('company')){
    //     companyMap[job.get('company').get('id')] = job.get('company');
    //     var companyJobs = jobsByCompany.get(job.get('company').get('id'));
    //     companyJobs = companyJobs || new Immutable.List();
    //     companyJobs = companyJobs.push(job);
    //     jobMap[job.get('company').get('id')] = companyJobs;
    //     companies = companies.mergeDeep(companyMap);
    //     jobsByCompany = jobsByCompany.mergeDeep(jobMap);
    //   }
    //
    // });
    //
    // let subheader = `${jobs.count()} ${(jobs.count() !== 1) ? (ressourceNamePlurial) : (ressourceName)}`;
    //
    // let self = this;
    let { jobs } = this.props;

    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    let count = jobs.count();
    let ressourceName = 'Job';

    if (count !== 1) {
      ressourceName += 's';
    }
    let heights = jobs.map(() =>{
      let height = 224;

      return height;
    });
    heights = heights.toArray();
    if(!heights || heights.length <= 0){
      heights = 271;
    }

    jobs = jobs.sort((a, b) => {
      return a.get('title').localeCompare(b.get('title'));
    });

    return (
      /*<List subheader={subheader}>
        {companies.map(function(company){
          var jobs = jobsByCompany.get(company.get('id'));
          jobs = jobs || new Immutable.Map();
          return (<CompanyJobsList jobs={jobs} onJobClick={self._handleJobClick.bind(self)} company={company} />);
        })}
      </List>*/
      <List style={style.list} subheader={`${count} ${ressourceName}`}>
        <Infinite containerHeight={clientHeight - (56+64)} elementHeight={heights} useWindowAsScrollContainer>
          {jobs.map((job, key) => {
            return (
              <JobCardContainer jobId={job.get('id')} />
            );
          })}
        </Infinite>
      </List>
    );
  }
}

JobsList.propTypes = {
  jobs: React.PropTypes.object.isRequired,
  ressourceName: React.PropTypes.string,
  ressourceNamePlurial: React.PropTypes.string,
};

export default JobsList;
