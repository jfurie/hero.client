import React from 'react';
import { connect } from 'react-redux';
import { getOneJob } from '../../../modules/jobs';
import { getAllContacts } from '../../../modules/contacts';
import { getOneLocation } from '../../../modules/locations';
import { JobDetailsPage } from '../../../components/web';

import './jobDetailsContainer.scss';


function getData(state, id) {
  let location = ((state.locations.list.size > 0) ? (state.locations.list.get('566791aa15d3e38a0cbdecb6')) : (null));
  return {
    job: state.jobs.list.get(id),
    contacts: state.contacts,
    location,
  };
}

@connect((state, props) => (
  getData(state, props.params.id)),
  {getOneJob, getAllContacts, getOneLocation})
class JobDetailsContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      createContactModalOpen: false,
    };
  }

  componentDidMount() {
    this.props.getOneJob(this.props.params.id);
    this.props.getAllContacts();
    this.props.getOneLocation('566791aa15d3e38a0cbdecb6');
  }

  contactDetailsModalOpen(contact) {
    this.setState({
      contactDetailsModalOpen: true,
      detailsContact: contact,
    });
  }

  contactDetailsModalClose() {
    this.setState({
      contactDetailsModalOpen: false,
      detailsContact: null,
    });
  }

  createContactModalOpen(){
    this.setState({
      createContactModalOpen: true,
    });
  }

  createContactModalClose(){
    this.setState({
      createContactModalOpen: false,
    });
  }

  saveContact(){
    console.log('save contact');
  }

  render(){
    return (
      <div>
        <JobDetailsPage {...this.props}></JobDetailsPage>
      </div>
    );
  }
}

export default JobDetailsContainer;
