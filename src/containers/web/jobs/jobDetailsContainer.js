import React from 'react';
import { connect } from 'react-redux';
import { JobDetails } from '../../../components/web';
import { getOneJob } from '../../../modules/jobs';
import { getAllJobCandidates } from '../../../modules/candidates';
import { getImageByJobId } from '../../../modules/resources';

//import Immutable from 'immutable';
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

    // if (job) {
    //   console.log(job.toJS());
    // }

    return (
      <div>
        <JobDetails onJobDetailsClose={this.onJobDetailsClose.bind(this)} open job={job} />
      </div>
    );
  }
}

export default JobDetailsPage;

// import React from 'react';
// import Immutable from 'immutable';
// import { connect } from 'react-redux';
// import { getOneJob } from '../../../modules/jobs/index';
// import { getAllContacts } from '../../../modules/contacts';
// //import { getAllJobCandidates } from '../../../modules/candidates';
// import { getOneLocation } from '../../../modules/locations';
// import { JobDetailsPage } from '../../../components/web';
//
// import './jobDetailsContainer.scss';
//
// function getData(state, id) {
//   let location = ((state.locations.list.size > 0) ? (state.locations.list.get('566791aa15d3e38a0cbdecb6')) : (null));
//   let job = state.jobs.list.get(id);
//   let jobImage =job ? state.resources.list.get(job.imageId) : new Immutable.Map();
//   return {
//     job,
//     jobImage,
//     contacts: state.contacts,
//     candidates: state.candidates,
//     location,
//   };
// }
//
// @connect((state, props) => (
//   getData(state, props.params.id)),
//   {getOneJob, getAllContacts, getOneLocation})
// class JobDetailsContainer extends React.Component {
//
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       createContactModalOpen: false,
//     };
//   }
//
//   componentDidMount() {
//     this.props.getOneJob(this.props.params.id);
//     this.props.getAllContacts();
//     //this.props.getOneLocation('566791aa15d3e38a0cbdecb6');
//     //this.props.getAllCandidates(this.props.params.id);
//   }
//
//   contactDetailsModalOpen(contact) {
//     this.setState({
//       contactDetailsModalOpen: true,
//       detailsContact: contact,
//     });
//   }
//
//   contactDetailsModalClose() {
//     this.setState({
//       contactDetailsModalOpen: false,
//       detailsContact: null,
//     });
//   }
//
//   createContactModalOpen(){
//     this.setState({
//       createContactModalOpen: true,
//     });
//   }
//
//   createContactModalClose(){
//     this.setState({
//       createContactModalOpen: false,
//     });
//   }
//
//   saveContact(){
//     console.log('save contact');
//   }
//
//   render(){
//     return (
//       <div>
//         <JobDetailsPage {...this.props} />
//       </div>
//     );
//   }
// }
//
// export default JobDetailsContainer;
