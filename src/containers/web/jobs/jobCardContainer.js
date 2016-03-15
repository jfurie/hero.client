import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import Immutable from 'immutable';

import { getJobDetail, createJobFavorite, deleteJobFavorite } from '../../../modules/jobs';

import { JobListItem } from '../../../components/web';

import getJobDataFromState from '../../../dataHelpers/job';

function getData(state, props) {

  let jobId = props.jobId;

  return {
    job: getJobDataFromState(state, jobId),
  };
}

@connect((state, props) => (
getData(state, props)), {
  getJobDetail, pushState,
})
class JobCardContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    let self = this;

    setTimeout(() => {
      if(self.props.jobId){
        self.props.getJobDetail(self.props.jobId);
      }
    }, 500);
  }

  openDetails() {
    let {job} = this.props;

    this.props.pushState(null, `/jobs/${job.get('id')}`);
  }

  favoriteJob() {
    let {job} = this.props;

    this.props.createJobFavorite(job.get('id'));
  }

  unfavoriteJob() {
    let {job} = this.props;

    this.props.deleteJobFavorite(job.get('id'));
  }

  render() {
    let {job} = this.props;

    return (
      <JobListItem
        onJobClick={this.openDetails.bind(this)}
        job={job}
        favoriteJob={this.favoriteJob.bind(this)}
        unfavoriteJob={this.unfavoriteJob.bind(this)}
      />
    );
  }
}

export default JobCardContainer;
