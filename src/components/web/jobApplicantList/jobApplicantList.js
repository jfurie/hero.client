import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { pushState } from 'redux-router';
import { Paper, List, FontIcon, IconButton, Styles, Dialog, FlatButton } from 'material-ui';
let Sticky = require('react-sticky');
import { JobApplicantListItem } from '../../../components/web';

const style = {
  sticky: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  bar: {
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
    icon: {
      color: Styles.Colors.grey600,
    },
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
      selectedFilter: 'none',
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

  filterShowAll() {
    this.setState({
      selectedFilter: 'none',
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
      ReactDOM.findDOMNode(this.refs.jobApplicantBar).scrollIntoView();
    }
  }

  render() {
    let { candidates } = this.props;

    let totalCount = candidates.length;
    let vettedCount = candidates.filter(x => {
      return x.get('contact').get('isVetted');
    }).length;
    let unvettedCount = totalCount - vettedCount;

    let filteredCandidates;

    switch(this.state.selectedFilter) {
    case 'vetted':
      filteredCandidates = this.props.candidates.filter(x => {
        return x.get('contact').get('isVetted');
      });
      break;
    case 'unvetted':
      filteredCandidates = this.props.candidates.filter(x => {
        return !x.get('contact').get('isVetted');
      });
      break;
    default:
      filteredCandidates = candidates;
    }

    return (
      <div>
      <Sticky topOffset={-220} onStickyStateChange={this.handleStickyStateChange.bind(this)} stickyStyle={style.sticky}>
      <Paper ref="jobApplicantBar" onClick={this.handleBarClick.bind(this)} style={style.bar} className="row between-xs">
        <div style={style.bar.stats}>
          {
            this.state.selecting ?
            <div style={{display:'inline-block'}}>
              <div style={style.bar.stats.item}>
                <IconButton onTouchTap={this.unselectAll.bind(this)} iconStyle={style.bar.icon}>
                  <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
                </IconButton>
                {this.state.selectedContacts.size}
              </div>
            </div>
            :
            <div style={{display:'inline-block'}}>
              <div style={style.bar.stats.item}>
                <IconButton onTouchTap={this.filterShowAll.bind(this)} iconStyle={{color: this.state.selectedFilter == 'none' ? Styles.Colors.blue500 : Styles.Colors.grey600}}>
                  <FontIcon className="material-icons">assignment_ind</FontIcon>
                </IconButton>
                <span style={{color: this.state.selectedFilter == 'none' ? Styles.Colors.blue500 : Styles.Colors.grey600}}>{totalCount}</span>
              </div>
              <div style={style.bar.stats.item}>
                <IconButton onTouchTap={this.filterShowUnvetted.bind(this)} iconStyle={{color: this.state.selectedFilter == 'unvetted' ? Styles.Colors.blue500 : Styles.Colors.grey600}}>
                  <FontIcon className="material-icons">assignment_late</FontIcon>
                </IconButton>
                <span style={{color: this.state.selectedFilter == 'unvetted' ? Styles.Colors.blue500 : Styles.Colors.grey600}}>{unvettedCount}</span>
              </div>
              <div style={style.bar.stats.item}>
                <IconButton onTouchTap={this.filterShowVetted.bind(this)} iconStyle={{color: this.state.selectedFilter == 'vetted' ? Styles.Colors.blue500 : Styles.Colors.grey600}}>
                  <FontIcon className="material-icons">assignment_turned_in</FontIcon>
                </IconButton>
                <span style={{color: this.state.selectedFilter == 'vetted' ? Styles.Colors.blue500 : Styles.Colors.grey600}}>{vettedCount}</span>
              </div>
            </div>
          }

        </div>
        <div style={style.bar.actions}>
          {
            this.state.selecting ?
            <div style={{display:'inline-block'}}>
              <div style={style.bar.actions.item}>
                <IconButton onTouchTap={this.confirmDeleteAllCandidates.bind(this)} iconStyle={style.bar.icon}>
                  <FontIcon className="material-icons">delete</FontIcon>
                </IconButton>
              </div>
              <div style={style.bar.actions.item}>
                <IconButton onTouchTap={this.vetAllSelected.bind(this)} iconStyle={style.bar.icon}>
                  <FontIcon className="material-icons">check</FontIcon>
                </IconButton>
              </div>
            </div>
            :<div></div>
          }

          <div style={style.bar.actions.item}>
            <IconButton iconStyle={style.bar.icon}>
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
              />
            );
          })}
      </List>
      <Dialog
          title="Please Confirm"
          actions=
          {[
            <FlatButton
                label="No"
                secondary={true}
                onTouchTap={this.closeDeleteDialog.bind(this)}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onTouchTap={this.deleteCandidate.bind(this)}
            />,
          ]}
          modal={true}
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
                  secondary={true}
                  onTouchTap={this.closeDeleteAllDialog.bind(this)}
              />,
              <FlatButton
                  label="Yes"
                  primary={true}
                  onTouchTap={this.deleteAllCandidates.bind(this)}
              />,
            ]}
            modal={true}
            open={this.state.openDeleteAllDialog}
            onRequestClose={this.closeDeleteAllDialog.bind(this)}
        >
            Are you sure you want to remove {this.state.selectedContacts.size} candidate{this.state.selectedContacts.size == 1 ? '' : 's'} from this job?
          </Dialog>
      </div>
    );
  }
}

export default JobApplicantList;
