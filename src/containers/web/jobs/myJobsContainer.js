import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, JobsList } from '../../../components/web';
import { toggleNav } from '../../../modules/leftNav';
import { getMyJobs, createJobFavorite, deleteJobFavorite } from '../../../modules/jobs/index';

@connect(state => ({
  user: state.auth.user,
  jobs: state.jobs,
}), {pushState, toggleNav, getMyJobs, createJobFavorite, deleteJobFavorite})
class MyJobsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getMyJobs();
  }

  _handleJobClick(job, company){
    this.props.pushState({}, `/clients/${company.get('id')}/jobs/${job.get('id')}`);
  }

  favoriteJob(job) {
    this.props.createJobFavorite(job.get('id'));
  }

  unfavoriteJob(job) {
    this.props.deleteJobFavorite(job.get('id'));
  }

  render () {

    let { jobs } = this.props;

    return (
      <div>
        <Header title="Jobs" />
        <JobsList
            onJobClick={this._handleJobClick.bind(this)}
            jobs={jobs.get('list')}
            favoriteJob={this.favoriteJob.bind(this)}
            unfavoriteJob={this.unfavoriteJob.bind(this)}
        />
      </div>
    );
  }
}

export default MyJobsPage;
