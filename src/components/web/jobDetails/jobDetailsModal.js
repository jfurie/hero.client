import React from 'react';
import { JobDetails, Dialog, CandidateSearchModal, CandidateCreateModal, ShareJobModal } from '../../../components/web';

import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

const style = {
  dialog: {
    position: 'fixed',
    width: '100%',
    zIndex: 1100,
  },
  toolbarTitle: {
    lineHeight: '64px',
    fontSize: '15px',
    float: 'left',
  },
};

class JobDetailsModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      candidateCreateModalOpen: false,
      candidateSearchModalOpen: false,
    };
  }

  openCreateCandidateModal() {
    this.setState({
      candidateCreateModalOpen: true,
    });
  }

  closeCandidateCreateModal() {
    this.setState({
      candidateCreateModalOpen: false,
    });
  }

  shareJobModalOpen() {
    this.refs.shareJobModal.getWrappedInstance().show();
  }

  openCandidateSearchModal() {
    this.setState({
      candidateSearchModalOpen: true,
    });
  }

  closeCandidateSearchModal() {
    this.setState({
      candidateSearchModalOpen: false,
    });
  }

  createCandidate(contact, jobId) {
    this.props.createCandidate(contact, jobId);
    this.closeCandidateSearchModal();
    this.closeCandidateCreateModal();
  }

  render() {

    let { job, company } = this.props;

    let jobTitle = ((job) ? (job.get('title')) : (''));
    let jobId = ((job) ? (job.get('id')) : (null));

    let candidates = ((job) ? (job.get('candidates')) : ([]));
    candidates = candidates || [];

    return (
      <div>
        <Dialog open={this.props.open}>
          <CandidateSearchModal open={this.state.candidateSearchModalOpen} job={job} candidates={candidates} close={this.closeCandidateSearchModal.bind(this)} createCandidate={this.createCandidate.bind(this)}/>
          <CandidateCreateModal open={this.state.candidateCreateModalOpen} job={job} close={this.closeCandidateCreateModal.bind(this)}  createCandidate={this.createCandidate.bind(this)}/>
          <ShareJobModal ref="shareJobModal" jobId={jobId} companyContacts={company.get('contacts')}/>
          <div style={style.dialog}>
            <Toolbar style={{backgroundColor:'#ffffff', height:'64px'}}>
              <ToolbarGroup key={0} float="left">
                <IconButton onTouchTap={this.props.closeModal.bind(this)} style={{marginTop:'8px',float:'left', marginRight:'8px', marginLeft:'-16px'}} iconClassName='material-icons'>close</IconButton>
                <ToolbarTitle style={style.toolbarTitle} text={jobTitle} />
              </ToolbarGroup>
              <ToolbarGroup key={1} float="right">
                <IconMenu style={{marginTop:'8px',float:'left', marginRight:'-16px', marginLeft:'8px'}} iconButtonElement={
                  <IconButton  iconClassName='material-icons'>more_vert</IconButton>
                }>
                  <MenuItem index={0} onTouchTap={this.openCandidateSearchModal.bind(this)} primaryText='Find Candidates' />
                  <MenuItem index={1} onTouchTap={this.openCreateCandidateModal.bind(this)} primaryText="Add Candidate" />
<MenuItem index={2} onTouchTap={this.shareJobModalOpen.bind(this)} primaryText="Share This Job" />
                </IconMenu>
              </ToolbarGroup>
            </Toolbar>
          </div>
          <div style={{height:'64px'}}></div>
          <JobDetails isLight {...this.props} />
        </Dialog>
      </div>
    );
  }
}

JobDetailsModal.propTypes = {
  company: React.PropTypes.object,
  job: React.PropTypes.object,
  open: React.PropTypes.bool.isRequired,
};

export default JobDetailsModal;
