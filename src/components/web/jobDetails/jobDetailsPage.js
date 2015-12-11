import React from 'react';
import { connect } from 'react-redux';
import { getOneJob } from '../../../modules/jobs';
import { getAllContacts } from '../../../modules/contacts';
import { getOneLocation } from '../../../modules/locations';
import { Header, CustomTabsSwipe, ContactsList, LocationCard, ContactDetailsModal, ClientContactsCreateModal ,JobDetails } from '../../../components/web';
import { IconMenu, IconButton, List , ListItem, FontIcon, Card, Avatar, CardText, CardMedia, FlatButton, CardHeader, CardActions } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');

const style = {
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

class JobDetailsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      createContactModalOpen: false,
    };
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
    let {job, contacts, location} = this.props;
    let heroContact = '/img/rameet.jpg';
    return (
      <div>

        <ClientContactsCreateModal onSubmit={this.saveContact.bind(this)} closeModal={this.createContactModalClose.bind(this)} open={this.state.createContactModalOpen}></ClientContactsCreateModal>
        <Header iconRight={
          <IconMenu iconButtonElement={
            <IconButton  iconClassName='material-icons'>more_vert</IconButton>
          }>
            <MenuItem index={0} primaryText='Find Candidates' />
            <MenuItem index={1} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Candidate" />
          </IconMenu>
        } title={job?job.get('title'):''} />
      <JobDetails {...this.props}></JobDetails>

      </div>
    );
  }
}

export default JobDetailsPage;
