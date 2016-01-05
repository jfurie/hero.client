import React from 'react';
// import { connect } from 'react-redux';
// import { getOneJob } from '../../../modules/jobs';
// import { getAllContacts } from '../../../modules/contacts';
// import { getOneLocation } from '../../../modules/locations';
import { ClientContactsCreateModal, JobDetails, Dialog, CandidateSearchModal } from '../../../components/web';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui';

import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

//let MenuItem = require('material-ui/lib/menus/menu-item');

// const style = {
//   slide: {
//     minHeight: `${window.innerHeight - 112}px`,
//   },
// };

class JobDetailsModal extends React.Component {

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
  closeModal(){
    this.props.closeModal();
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

  render(){

    return (
      <div>
        <Dialog open={this.props.open}>
          <CandidateSearchModal open={this.state.candidateSearchOpen} closeModal={this.candidateSearchModalClose.bind(this)} candidates={this.props.seachCandidates}/>
          <ClientContactsCreateModal onSubmit={this.saveContact.bind(this)} closeModal={this.createContactModalClose.bind(this)} open={this.state.createContactModalOpen}></ClientContactsCreateModal>
            <div style={{
              position:'fixed',
              width:'100%',
              zIndex:1100,
            }}>
              <Toolbar style={{backgroundColor:'#ffffff', height:'64px'}}>
                <ToolbarGroup key={0} float="left">
                  <IconButton onTouchTap={this.closeModal.bind(this)} style={{marginTop:'8px',float:'left', marginRight:'8px', marginLeft:'-16px'}} iconClassName='material-icons'>close</IconButton>
                  <ToolbarTitle style={{lineHeight:'64px', fontSize:'15px',  float:'left'}}
                      text={this.props.job?this.props.job.get('title'):''}
                  />
                </ToolbarGroup>
                <ToolbarGroup key={1} float="right">
                  <IconMenu style={{marginTop:'8px',float:'left', marginRight:'-16px', marginLeft:'8px'}} iconButtonElement={
                    <IconButton  iconClassName='material-icons'>more_vert</IconButton>
                  }>
                    <MenuItem index={0} onTouchTap={this.candidateSearchModalOpen.bind(this)} primaryText='Find Candidates' />
                    <MenuItem index={1} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Candidate" />
                  </IconMenu>
                </ToolbarGroup>
              </Toolbar>
            </div>
            <div style={{height:'64px'}}></div>
          <JobDetails isLight={true} {...this.props}></JobDetails>
        </Dialog>
      </div>
    );
  }
}

JobDetailsModal.propTypes = {
  open: React.PropTypes.bool.isRequired,
};

export default JobDetailsModal;
