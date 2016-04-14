import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, JobsList, ActionButton, ActionButtonItem } from '../../../components/web';
import { toggleNav } from '../../../modules/leftNav';
import { getMyJobs} from '../../../modules/jobs/index';
import { createJobFavorite, deleteJobFavorite } from '../../../modules/favorites';
import { Styles } from 'material-ui';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';


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
  onJobCreateOpen() {
    this.refs.actionButtons.close();

    // create tpm job
    let job = {
      id: `tmp_${this._guid()}`,
      //companyId,
    };

    this.props.createTempJob(job);
    let self = this;

    setTimeout(function () {
      //self.props.history.replaceState(null,`/clients/${job.companyId}/jobs/${job.id}/create`);
      self.props.history.pushState(null,`/jobs/${job.id}/create`);

    }, 500);

    //this.props.history.pushState(null,'/jobs/search');
  }

  render () {

    let { jobs } = this.props;
    let actions = [
      <ActionButtonItem title={'Job'} color={Styles.Colors.purple500} itemTapped={this.onJobCreateOpen.bind(this)}>
        <ContentAdd />
      </ActionButtonItem>,
    ];
    return (
      <div>
        <Header title="Jobs" />
        <JobsList
            onJobClick={this._handleJobClick.bind(this)}
            jobs={jobs.get('list')}
            favoriteJob={this.favoriteJob.bind(this)}
            unfavoriteJob={this.unfavoriteJob.bind(this)}
        />
        <ActionButton ref="actionButtons" actions={actions}/>

      </div>
    );
  }
}

export default MyJobsPage;
