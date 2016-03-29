import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import { getJobDetail } from '../../../modules/jobs';

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
      // if(self.props.jobId){
      //   self.props.getJobDetail(self.props.jobId, ['candidates','company']);
      // }
    }, 500);
  }

  openDetails() {
    let {job} = this.props;

    this.props.pushState(null, `/jobs/${job.get('id')}`);
  }

  favoriteJob() {
    let {job} = this.props;

    this.props.favoriteJob(job);
  }

  unfavoriteJob() {
    let {job} = this.props;

    this.props.unfavoriteJob(job);
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
