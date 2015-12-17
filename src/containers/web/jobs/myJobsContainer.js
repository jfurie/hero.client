import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, JobsList } from '../../../components/web';
import { toggleNav } from '../../../modules/leftNav';
import { getAllJobs } from '../../../modules/jobs/index';

// const style = {
//   slide: {
//     minHeight: `${window.innerHeight - 112}px`,
//   },
// };

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

  _handleJobClick(){
    this.props.pushState(null,'/jobs/1a');
  }

  render () {

    let { jobs } = this.props;

    return (
      <div>
        <Header title='Jobs'></Header>
        <JobsList onJobClick={this._handleJobClick.bind(this)} jobs={jobs.list}/>
      </div>
    );
  }
}

export default MyJobsPage;
