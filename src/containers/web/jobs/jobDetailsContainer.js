import React from 'react';
import { connect } from 'react-redux';
import { JobDetails } from '../../../components/web';
import { getOneJob } from '../../../modules/jobs';
import { getAllJobCandidates } from '../../../modules/candidates';
import { getImageByJobId } from '../../../modules/resources';

import getJobDataFromState from '../../../dataHelpers/job';

function getData(state, jobId) {
  return {
    job: getJobDataFromState(state, jobId),
  };
}

@connect((state, props) => (getData(state, props.params.jobId)), {getOneJob, getAllJobCandidates, getImageByJobId})
class JobDetailsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let self = this;
    setTimeout(() => {
      self.props.getOneJob(self.props.params.jobId);
      self.props.getAllJobCandidates(self.props.params.jobId);
      self.props.getImageByJobId(self.props.params.jobId);
    }, 500);
  }

  componentWillReceiveProps() {

  }

  onJobDetailsClose(){
    if(this.props.onClose){
      this.props.onClose();
    } else{
      this.props.history.goBack();
    }
  }

  render() {

    let { job } = this.props;

    return (
      <div>
        <JobDetails onJobDetailsClose={this.onJobDetailsClose.bind(this)} open job={job} />
      </div>
    );
  }
}

export default JobDetailsPage;
