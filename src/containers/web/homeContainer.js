import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, JobsList, CustomTabsSwipe, CandidatesList, ClientsList } from '../../components/web';
import { toggleNav } from '../../modules/leftNav';
import { getAllJobs } from '../../modules/jobs/index';
import { getAllUserCandidates } from '../../modules/candidates';
import { getAllCompanies } from '../../modules/companies';

const style = {
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

function filterMyCandidates(candidates, auth) {

  let userId = auth.authToken.userId;

  // grab the candidates for this job
  let myCandidates = [];
  if (userId && candidates && candidates.byUserId && candidates.list) {
    if (candidates.byUserId.size > 0) {
      candidates.byUserId.get(userId).forEach(function(candidateId) {
        let c = candidates.list.get(candidateId);
        if (c) {
          myCandidates.push(c);
        }
      });
    }
  }

  return myCandidates;
}

@connect(state => ({
  user: state.auth.user,
  jobs: state.jobs,
  candidates: filterMyCandidates(state.candidates, state.auth),
  auth: state.auth,
  companies: state.companies,
}), {pushState, toggleNav, getAllJobs, getAllUserCandidates, getAllCompanies})
class HomePage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getAllJobs();
    this.props.getAllCompanies();
    this.props.getAllUserCandidates(this.props.auth.authToken.userId);
  }

  _handleJobClick(){
    this.props.pushState(null,'/jobs/1a');
  }

  render () {

    let { jobs, candidates, companies } = this.props;

    return (
      <div>
        <Header title='Dashboard'></Header>

        <CustomTabsSwipe tabs={['Clients', 'Active Jobs', 'Candidates']} startingTab={1}>
          <div style={style.slide}>
            <ClientsList clients={companies.list} />
          </div>
          <div>
            <JobsList onJobClick={this._handleJobClick.bind(this)} jobs={jobs.list}/>
          </div>
          <div style={style.slide}>
            <CandidatesList candidates={candidates}/>
          </div>
        </CustomTabsSwipe>

      </div>
    );
  }
}

export default HomePage;
