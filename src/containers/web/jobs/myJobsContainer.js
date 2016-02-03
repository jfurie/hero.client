import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, JobsList } from '../../../components/web';
import { toggleNav } from '../../../modules/leftNav';
import { getAllJobs } from '../../../modules/jobs/index';

@connect(state => ({
  user: state.auth.user,
  jobs: state.jobs,
}), {pushState, toggleNav, getAllJobs})
class MyJobsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getAllJobs();
  }

  _handleJobClick(job, company){
    this.props.pushState({}, `/clients/${company.get('id')}/jobs/${job.get('id')}`);
  }

  render () {

    let { jobs } = this.props;

    return (
      <div>
        <Header title="Jobs" />
        <JobsList
            onJobClick={this._handleJobClick.bind(this)}
            jobs={jobs.list}
        />
      </div>
    );
  }
}

export default MyJobsPage;
