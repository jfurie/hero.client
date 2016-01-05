import React from 'react';
import { Header, ClientContactsCreateModal, JobDetails, CandidateSearchModal } from '../../../components/web';

import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

//import { IconMenu, IconButton, MenuItem } from 'material-ui';
//let MenuItem = require('material-ui/lib/menus/menu-item');

// const style = {
//   slide: {
//     minHeight: `${window.innerHeight - 112}px`,
//   },
// };

class JobDetailsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      createContactModalOpen: false,
      candidateSearchOpen: false,
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

  createContactModalOpen() {
    this.setState({
      createContactModalOpen: true,
    });
  }

  createContactModalClose() {
    this.setState({
      createContactModalOpen: false,
    });
  }

  saveContact(){
    console.log('save contact');
  }

  candidateSearchModalClose(){
    this.setState({
      candidateSearchOpen: false,
    });
  }
  candidateSearchModalOpen(){
    this.setState({
      candidateSearchOpen: true,
    });
  }

  render() {

    let { job } = this.props;
    //let heroContact = '/img/rameet.jpg';
    return (
      <div>
        <CandidateSearchModal open={this.state.candidateSearchOpen} closeModal={this.candidateSearchModalClose.bind(this)} candidates={this.props.contacts.list}/>
        <ClientContactsCreateModal onSubmit={this.saveContact.bind(this)} closeModal={this.createContactModalClose.bind(this)} open={this.state.createContactModalOpen}></ClientContactsCreateModal>
        <Header iconRight={
          <IconMenu iconButtonElement={
            <IconButton  iconClassName='material-icons'>more_vert</IconButton>
          }>
            <MenuItem index={0} onTouchTap={this.candidateSearchModalOpen.bind(this)} primaryText='Find Candidates' />
            <MenuItem index={1} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Candidate" />
          </IconMenu>
        } title={job ? job.get('title') : '' } />
        <JobDetails {...this.props} />
      </div>
    );
  }
}

export default JobDetailsPage;
