import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, JobsList, CustomTabsSwipe } from '../../components/web';
import { toggleNav } from '../../modules/leftNav';
import { getAllJobs } from '../../modules/jobs';

const style = {
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

@connect(state => ({
  user: state.auth.user,
  jobs: state.jobs,
}), {pushState, toggleNav, getAllJobs})
class HomePage extends React.Component {

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

    //console.log(jobs);

    return (
      <div>
        <Header title='Dashboard'></Header>

        <CustomTabsSwipe tabs={['Clients', 'Active Jobs', 'Candidates']} startingTab={1}>
          <div style={style.slide}>
            <p>clients</p>
          </div>
          <div>
            <JobsList onJobClick={this._handleJobClick.bind(this)} jobs={jobs.list}/>
          </div>
          <div style={style.slide}>
            <p>contacts</p>
          </div>
        </CustomTabsSwipe>

      </div>
    );
  }
}

export default HomePage;
