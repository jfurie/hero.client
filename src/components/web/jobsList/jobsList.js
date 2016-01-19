import React from 'react';
import { List } from 'material-ui';
//import Infinite from 'react-infinite';
import { CompanyJobsList } from '../../../components/web';

// TMP
import Immutable from 'immutable';

class JobsList extends React.Component {
  _handleJobClick(job){
    if(this.props.onJobClick){
      this.props.onJobClick(job);
    }
  }
  render() {

    let { jobs, ressourceName, ressourceNamePlurial } = this.props;

    ressourceName = ressourceName || 'Job';
    ressourceNamePlurial = ressourceNamePlurial || 'Jobs';

    if (ressourceName !== 'Job' && ressourceNamePlurial === 'Jobs') {
      ressourceNamePlurial = `${ressourceName}s`;
    }
    let companies = new Immutable.Map();
    let jobsByCompany = new Immutable.Map();
    jobs.map(function(job){
      let companyMap = {};
      let jobMap = {};
      companyMap[job.get('company').get('id')] = job.get('company');
      var companyJobs = jobsByCompany.get(job.get('company').get('id'));
      companyJobs = companyJobs || new Immutable.List();
      companyJobs = companyJobs.push(job);
      jobMap[job.get('company').get('id')] = companyJobs;
      companies = companies.mergeDeep(companyMap);
      jobsByCompany = jobsByCompany.mergeDeep(jobMap);
    });
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // create 2 fakes companies


    let subheader = `${jobs.count() * 2} ${ressourceNamePlurial}`;
    let self = this;
    return (
      <List subheader={subheader}>
        {companies.map(function(company){
          var jobs = jobsByCompany.get(company.get('id'));
          jobs = jobs || new Immutable.Map();
          return (<CompanyJobsList jobs={jobs} onJobClick={self._handleJobClick.bind(self)} company={company} />);
        })}
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
