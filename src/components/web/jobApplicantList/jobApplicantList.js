import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { pushState } from 'redux-router';
import { Paper, List, FontIcon, IconButton, Styles } from 'material-ui';
import { JobApplicantListItem } from '../../../components/web';

const style = {
  bar: {
    padding: '10px 10px 5px 15px',
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
      selectedItems: new Immutable.Map(),
      selecting: false,
    };
  }

  select(contact) {
    let id = contact.get('id');
    let selectedItems;

    if (this.state.selectedItems.has(id)) {
      selectedItems = this.state.selectedItems.delete(id);
    }
    else {
      let contactMap = {};
      contactMap[id] = contact;
      selectedItems = this.state.selectedItems.mergeDeep(contactMap);
    }

    if (selectedItems.size > 0) {
      this.setState({
        selectedItems,
        selecting: true,
      });
    }
    else {
      this.setState({
        selectedItems,
        selecting: false,
      });
    }
  }

  unselectAll() {
    this.setState({
      selectedItems: new Immutable.Map(),
      selecting: false,
    });
  }

  vetSelected() {
    alert(this.state.selectedItems.size + ' vetted');
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

  render() {
    let { candidates } = this.props;

    return (
      <div>
      <Paper style={style.bar} className="row between-xs">
        <div style={style.bar.stats}>
          {
            this.state.selecting ?
            <div style={{display:'inline-block'}}>
              <div style={style.bar.stats.item}>
                <IconButton onTouchTap={this.unselectAll.bind(this)} iconStyle={style.bar.icon}>
                  <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
                </IconButton>
                {this.state.selectedItems.size}
              </div>
            </div>
            :
            <div style={{display:'inline-block'}}>
              <div style={style.bar.stats.item}>
                <IconButton iconStyle={style.bar.icon}>
                  <FontIcon className="material-icons">assignment_ind</FontIcon>
                </IconButton>
                {0}
              </div>
              <div style={style.bar.stats.item}>
                <IconButton iconStyle={style.bar.icon}>
                  <FontIcon className="material-icons">assignment_late</FontIcon>
                </IconButton>
                {0}
              </div>
              <div style={style.bar.stats.item}>
                <IconButton iconStyle={style.bar.icon}>
                  <FontIcon className="material-icons">assignment_turned_in</FontIcon>
                </IconButton>
                {0}
              </div>
            </div>
          }

        </div>
        <div style={style.bar.actions}>
          {
            this.state.selecting ?
            <div style={{display:'inline-block'}}>
              <div style={style.bar.actions.item}>
                <IconButton iconStyle={style.bar.icon} tooltipPosition="top-center" tooltip="Delete">
                  <FontIcon className="material-icons">delete</FontIcon>
                </IconButton>
              </div>
              <div style={style.bar.actions.item}>
                <IconButton onTouchTap={this.vetSelected.bind(this)} iconStyle={style.bar.icon} tooltipPosition="top-center" tooltip="Check">
                  <FontIcon className="material-icons">check</FontIcon>
                </IconButton>
              </div>
            </div>
            :<div></div>
          }

          <div style={style.bar.actions.item}>
            <IconButton iconStyle={style.bar.icon} tooltipPosition="top-center" tooltip="More">
              <FontIcon className="material-icons">more_vert</FontIcon>
            </IconButton>
          </div>
        </div>
      </Paper>
      <List style={{backgroundColor: 'transparent'}}>
          {candidates.map((candidate, key) => {
            let selected = this.state.selectedItems.has(candidate.get('contactId'));
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
              />
            );
          })}
      </List>
      </div>
    );
  }
}

export default JobApplicantList;
