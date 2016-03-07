import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { pushState } from 'redux-router';
import { Paper, List, ListItem, FontIcon, IconButton, RaisedButton, Styles, Dialog, FlatButton, Toggle } from 'material-ui';
let Sticky = require('react-sticky');
import { JobApplicantListItem, FilterDialog, SelectToggle } from '../../../components/web';

const style = {
  sticky: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1200,
  },
  multiSelectBar: {
    padding: '10px 0 5px 0px',
    marginLeft: 0,
    marginRight: 0,
    color: Styles.Colors.grey600,
    stats: {
      item: {
        display: 'inline-flex',
        alignItems: 'center',
      },
    },
    actions: {
      item: {
        display: 'inline',
      },
    },
  },
  filterBar: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1200,
    padding: '10px 0 5px 0px',
    marginLeft: 0,
    marginRight: 0,
    color: Styles.Colors.grey600,
  },
  icon: {
    color: Styles.Colors.grey600,
  },
};

@connect(() => (
{}), {pushState})
class JobApplicantList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedContacts: new Immutable.Map(),
      selecting: false,
      openDeleteDialog: false,
      openDeleteAllDialog: false,
      openApplicantStateDialog: false,
      openRejectAllCandidatesDialog: false,
      openFilterDialog: false,
      selectedFilter: 'Any',
      includeUnvetted: true,
      isStuck: false,
    };
  }

  select(contact) {
    let id = contact.get('id');
    let selectedContacts;

    if (this.state.selectedContacts.has(id)) {
      selectedContacts = this.state.selectedContacts.delete(id);
    }
    else {
      let contactMap = {};
      contactMap[id] = contact;
      selectedContacts = this.state.selectedContacts.mergeDeep(contactMap);
    }

    if (selectedContacts.size > 0) {
      this.setState({
        selectedContacts,
        selecting: true,
      });
    }
    else {
      this.setState({
        selectedContacts,
        selecting: false,
      });
    }
  }

  unselectAll() {
    this.setState({
      selectedContacts: this.state.selectedContacts.clear(),
      selecting: false,
    });
  }

  vetAllSelected() {
    if (this.props.editContact) {
      this.state.selectedContacts.forEach(x => {
        x = x.set('isVetted', true);
        this.props.editContact(x);
      });
    }

    this.setState({
      selectedContacts: this.state.selectedContacts.clear(),
      selecting: false,
    });
  }

  openDetails(candidate) {
    this.props.pushState(null, `/contacts/${candidate.get('id')}`);
  }

  favoriteContact(contact) {
    if (this.props.favoriteContact) {
      this.props.favoriteContact(contact);
    }
  }

  unfavoriteContact(contact) {
    if (this.props.unfavoriteContact) {
      this.props.unfavoriteContact(contact);
    }
  }

  vetContact(contact) {
    if (!contact.get('isVetted') && this.props.editContact) {
      contact = contact.set('isVetted', true);
      this.props.editContact(contact);
    }
  }

  unvetContact(contact) {
    if (contact.get('isVetted') && this.props.editContact) {
      contact = contact.set('isVetted', false);
      this.props.editContact(contact);
    }
  }

  editApplicantState(state) {
    let contact = this.state.contactPendingApplicantStateChange;

    let candidate = this.props.candidates.filter(x => {
      return x.get('contactId') == contact.get('id');
    })[0];

    if (this.props.editApplicantState && candidate.get('applicantState') != state) {
      this.props.editApplicantState(candidate.get('id'), state);
    }

    this.setState({
      contactPendingApplicantStateChange: null,
      openApplicantStateDialog: false,
    });
  }

  selectApplicantState(contact) {
    this.setState({
      contactPendingApplicantStateChange: contact,
      openApplicantStateDialog: true,
    });
  }

  selectAllApplicantState() {
    this.setState({
      openApplicantStateDialog: true,
      multiApplicantStateDialog: true,
    });
  }

  editAllApplicantState(state) {
    if (this.props.editApplicantState) {
      let candidates = this.props.candidates.filter(x => {
        return this.state.selectedContacts.filter(y => {
          return x.get('contactId') == y.get('id');
        }).length > 0;
      });

      candidates.forEach(x => {
        this.props.editApplicantState(x.get('id'), state);
      });
    }

    this.setState({
      openRejectAllCandidatesModal: false,
      contactPendingApplicantStateChange: null,
      openApplicantStateDialog: false,
      multiApplicantStateDialog: false,
      selectedContacts: this.state.selectedContacts.clear(),
      selecting: false,
    });
  }

  closeApplicantStateDialog() {
    this.setState({
      openApplicantStateDialog: false,
    });
  }

  confirmRejectAllCandidates() {
    this.setState({
      openRejectAllCandidatesModal: true,
    });
  }

  closeRejectAllCandidatesDialog() {
    this.setState({
      openRejectAllCandidatesModal: false,
    });
  }

  confirmDeleteCandidate(contact) {
    let candidate = this.props.candidates.filter(x => {
      return x.get('contactId') == contact.get('id');
    })[0];

    this.setState({
      candidatePendingDelete: candidate,
      openDeleteDialog: true,
    });
  }

  deleteCandidate() {
    if (this.props.deleteCandidate) {
      this.props.deleteCandidate(this.state.candidatePendingDelete);
    }

    this.setState({
      candidatePendingDelete: null,
      openDeleteDialog: false,
    });
  }

  closeDeleteDialog() {
    this.setState({
      candidatePendingDelete: null,
      openDeleteDialog: false,
    });
  }

  confirmDeleteAllCandidates() {
    this.setState({
      openDeleteAllDialog: true,
    });
  }

  deleteAllCandidates() {
    let candidates = this.props.candidates.filter(x => {
      return this.state.selectedContacts.has(x.get('contactId')) > -1;
    });

    if (this.props.deleteCandidate) {
      candidates.forEach(x => {
        this.props.deleteCandidate(x);
      });
    }

    this.setState({
      selectedContacts: this.state.selectedContacts.clear(),
      selecting: false,
      openDeleteAllDialog: false,
    });
  }

  closeDeleteAllDialog() {
    this.setState({
      openDeleteAllDialog: false,
    });
  }

  selectFilter() {
    this.setState({
      openFilterDialog: true,
      pendingSelectedFilter: this.state.selectedFilter,
      pendingIncludeUnvetted: this.state.includeUnvetted,
    });
  }

  closeFilterDialog() {
    this.setState({
      openFilterDialog: false,
    });
  }

  setSelectedFilter(filter) {
    this.setState({
      pendingSelectedFilter: filter,
    });
  }

  applyFilters() {
    this.setState({
      openFilterDialog: false,
      selectedFilter: this.state.pendingSelectedFilter,
      includeUnvetted: this.state.pendingIncludeUnvetted,
    });

    this.handleBarClick();
  }

  clearSelectedFilter() {
    this.setState({
      pendingSelectedFilter: 'Any',
      pendingIncludeUnvetted: true,
    });
  }

  toggleIncludeUnvetted() {
    this.setState({
      pendingIncludeUnvetted: !this.state.pendingIncludeUnvetted,
    });
  }

  filterShowAll() {
    this.setState({
      selectedFilter: 'Any',
    });
  }

  filterShowVetted() {
    this.setState({
      selectedFilter: 'vetted',
    });
  }

  filterShowUnvetted() {
    this.setState({
      selectedFilter: 'unvetted',
    });
  }

  handleStickyStateChange(isStuck) {
    this.setState({
      isStuck,
    });
  }

  handleBarClick() {
    if (this.state.isStuck) {
      ReactDOM.findDOMNode(this.refs.jobApplicantList).scrollIntoView();
    }
    else {
      ReactDOM.findDOMNode(this.refs.jobApplicantMultiActionBar).scrollIntoView();
    }
  }

  render() {
    let { candidates } = this.props;

    // let totalCount = candidates.length;
    // let vettedCount = candidates.filter(x => {
    //   return x.get('contact').get('isVetted');
    // }).length;
    // let unvettedCount = totalCount - vettedCount;

    let filteredCandidates;

    switch(this.state.selectedFilter) {
    case 'Matched':
      filteredCandidates = this.props.candidates.filter(x => {
        return ['Applied', 'Matched', 'Sourced', 'Reffered'].indexOf(x.get('applicantState')) > -1;
      });
      break;
    case 'In Process':
      filteredCandidates = this.props.candidates.filter(x => {
        return ['Screened', 'Contacted', 'Queued', 'Submitted', 'Accepted', 'Interviewing', 'Offer Letter', 'Hired'].indexOf(x.get('applicantState')) > -1;
      });
      break;
    case 'Declined':
      filteredCandidates = this.props.candidates.filter(x => {
        return ['REJECTED', 'CANDIDATE REJECTED'].indexOf(x.get('applicantState')) > -1;
      });
      break;
    default:
      filteredCandidates = candidates;
    }

    if (!this.state.includeUnvetted) {
      filteredCandidates = filteredCandidates.filter(x => {
        return x.get('contact').get('isVetted') == true;
      });
    }

    let applicantStateOptions = [{
      value: 'Applied',
      icon: 'person',
    }, {
      value: 'Matched',
      icon: 'android',
    }, {
      value: 'Sourced',
      icon: 'headset_mic',
    }, {
      value: 'Reffered',
      icon: 'people',
    }, {
      value: 'Screened',
      icon: 'assignment_turned_in',
    }, {
      value: 'Contacted',
      icon: 'perm_phone_msg',
    }, {
      value: 'Queued',
      icon: 'playlist_add',
    }, {
      value: 'Submitted',
      icon: 'inbox',
    }, {
      value: 'Accepted',
      icon: 'thumb_up',
      color: Styles.Colors.purple500,
    }, {
      value: 'Interviewing',
      icon: 'event',
      color: Styles.Colors.pink500,
    }, {
      value: 'Offer Letter',
      icon: 'attach_money',
      color: Styles.Colors.green500,
    }, {
      value: 'Hired',
      icon: 'verified_user',
      color: Styles.Colors.blue600,
    }, {
      value: 'REJECTED',
      icon: 'do_not_disturb',
      color: Styles.Colors.red500,
    }, {
      value: 'CANDIDATE REJECTED',
      icon: 'do_not_disturb',
      color: Styles.Colors.red500,
    }];

    style.filterBar.display = this.state.isStuck ? 'flex' : 'none';

    let processFilterOptions = [{
      value: 'Any',
      size: 20,
    }, {
      value: 'Matched',
      size: 25,
    }, {
      value: 'In Process',
      size: 30,
    }, {
      value: 'Declined',
      size: 25,
    }];

    let filterLabel = `${(this.state.selectedFilter == 'Any' ? 'Any Rating - Any Status' : this.state.selectedFilter)} ${(!this.state.includeUnvetted ? ' - Vetted Only' : '')}`;

    return (
      <div>
      <Paper ref="jobApplicantFilterBar" onTouchTap={this.selectFilter.bind(this)} className="row between-xs" style={style.filterBar}>
        <div>
          <FlatButton label={filterLabel} style={{textTransform: 'normal'}} onTouchTap={this.selectFilter.bind(this)} />
        </div>
        <div>
          <FlatButton label="FILTER" />
        </div>
      </Paper>
      <Sticky topOffset={0} onStickyStateChange={this.handleStickyStateChange.bind(this)} stickyStyle={style.sticky}>
      <Paper ref="jobApplicantMultiActionBar" onClick={this.handleBarClick.bind(this)} style={style.multiSelectBar} className="row between-xs">
        <div style={style.multiSelectBar.stats}>
          {
            this.state.selecting ?
            <div style={{display:'inline-block'}}>
              <div style={style.multiSelectBar.stats.item}>
                <IconButton onTouchTap={this.unselectAll.bind(this)} iconStyle={style.icon}>
                  <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
                </IconButton>
                {this.state.selectedContacts.size}
              </div>
            </div>
            :
            <div style={{display:'inline-block'}}></div>
          }
        </div>
        <div style={style.multiSelectBar.actions}>
          {
            this.state.selecting ?
            <div style={{display:'inline-block'}}>
              <div style={style.multiSelectBar.actions.item}>
                <IconButton onTouchTap={this.confirmRejectAllCandidates.bind(this)} iconStyle={style.icon}>
                  <FontIcon className="material-icons">delete</FontIcon>
                </IconButton>
              </div>
              <div style={style.multiSelectBar.actions.item}>
                <IconButton onTouchTap={this.selectAllApplicantState.bind(this)} iconStyle={style.icon}>
                  <FontIcon className="material-icons">check</FontIcon>
                </IconButton>
              </div>
            </div>
            :<div></div>
          }

          <div style={style.multiSelectBar.actions.item}>
            <IconButton iconStyle={style.icon}>
              <FontIcon className="material-icons">more_vert</FontIcon>
            </IconButton>
          </div>
        </div>
      </Paper>
      </Sticky>
      <div ref="jobApplicantList" style={{paddingTop: this.state.isStuck ? '60px' : '0'}}></div>
      <List style={{backgroundColor: 'transparent'}}>
          {filteredCandidates.map((candidate, key) => {
            let selected = this.state.selectedContacts.has(candidate.get('contactId'));
            let selectedApplicantStateOption = applicantStateOptions.filter(x => {
              return x.value == candidate.get('applicantState');
            });

            selectedApplicantStateOption = selectedApplicantStateOption.length > 0 ? selectedApplicantStateOption[0] : null;

            return (
              <JobApplicantListItem
                  selected={selected}
                  selecting={this.state.selecting}
                  select={this.select.bind(this)}
                  key={key}
                  contact={candidate.get('contact')}
                  company={candidate.get('company')}
                  onContactClick={this.openDetails.bind(this)}
                  favoriteContact={this.favoriteContact.bind(this)}
                  unfavoriteContact={this.unfavoriteContact.bind(this)}
                  vetContact={this.vetContact.bind(this)}
                  unvetContact={this.unvetContact.bind(this)}
                  deleteContact={this.confirmDeleteCandidate.bind(this)}
                  selectApplicantState={this.selectApplicantState.bind(this)}
                  applicantStateOptions={applicantStateOptions}
                  selectedApplicantStateOption={selectedApplicantStateOption}
                  applicantState={candidate.get('applicantState')}
              />
            );
          })}
      </List>
      <FilterDialog
          open={this.state.openFilterDialog}
          onApply={this.applyFilters.bind(this)}
          onCancel={this.closeFilterDialog.bind(this)}
          onClear={this.clearSelectedFilter.bind(this)}
      >
        <div style={{margin: '15px 0', marginTop: 0, color: Styles.Colors.grey500}}>Process</div>
        <SelectToggle
            style={{margin: '15px 0'}}
            options={processFilterOptions}
            value={this.state.pendingSelectedFilter}
            onChange={this.setSelectedFilter.bind(this)}
        />
        <div style={{margin: '15px 0'}}>
          <Toggle
              label="Include unvetted candidates"
              toggled={this.state.pendingIncludeUnvetted}
              onToggle={this.toggleIncludeUnvetted.bind(this)}
          />
        </div>
      </FilterDialog>
      <Dialog
          modal={false}
          autoScrollBodyContent
          open={this.state.openApplicantStateDialog}
          onRequestClose={this.closeApplicantStateDialog.bind(this)}
      >
        <div style={{paddingBottom: '30px'}}>
          {applicantStateOptions.map((option, key) => {
            return (
              <ListItem
                  key={key}
                  leftIcon={<FontIcon className="material-icons" style={{color: option.color || Styles.Colors.grey600}}>{option.icon}</FontIcon>}
                  onTouchTap={this.state.multiApplicantStateDialog ? this.editAllApplicantState.bind(this, option.value) : this.editApplicantState.bind(this, option.value)}
              >
                {option.value}
              </ListItem>
            );
          })}
        </div>
        <RaisedButton onTouchTap={this.closeApplicantStateDialog.bind(this)} style={{position: 'absolute', bottom: 0, left: 0, right: 0}} label="Cancel" />
      </Dialog>
      <Dialog
          title="Please Confirm"
          actions=
          {[
            <FlatButton
                label="No"
                secondary
                onTouchTap={this.closeDeleteDialog.bind(this)}
            />,
            <FlatButton
                label="Yes"
                primary
                onTouchTap={this.deleteCandidate.bind(this)}
            />,
          ]}
          modal
          open={this.state.openDeleteDialog}
          onRequestClose={this.closeDeleteDialog.bind(this)}
      >
          Are you sure you want to remove {this.state.candidatePendingDelete ? this.state.candidatePendingDelete.get('contact').get('displayName') : 'this candidate'} from this job?
        </Dialog>
        <Dialog
            title="Please Confirm"
            actions=
            {[
              <FlatButton
                  label="No"
                  secondary
                  onTouchTap={this.closeDeleteAllDialog.bind(this)}
              />,
              <FlatButton
                  label="Yes"
                  primary
                  onTouchTap={this.deleteAllCandidates.bind(this)}
              />,
            ]}
            modal
            open={this.state.openDeleteAllDialog}
            onRequestClose={this.closeDeleteAllDialog.bind(this)}
        >
            Are you sure you want to remove {this.state.selectedContacts.size} candidate{this.state.selectedContacts.size == 1 ? '' : 's'} from this job?
          </Dialog>
          <Dialog
              title="Please Confirm"
              actions=
              {[
                <FlatButton
                    label="No"
                    secondary
                    onTouchTap={this.closeRejectAllCandidatesDialog.bind(this)}
                />,
                <FlatButton
                    label="Yes"
                    primary
                    onTouchTap={this.editAllApplicantState.bind(this, 'REJECTED')}
                />,
              ]}
              modal
              open={this.state.openRejectAllCandidatesModal}
              onRequestClose={this.closeRejectAllCandidatesDialog.bind(this)}
          >
              Are you sure you want to reject {this.state.selectedContacts.size} candidate{this.state.selectedContacts.size == 1 ? '' : 's'}?
            </Dialog>
      </div>
    );
  }
}

export default JobApplicantList;
