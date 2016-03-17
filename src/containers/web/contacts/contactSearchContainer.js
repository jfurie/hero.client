import React from 'react';
import { connect } from 'react-redux';

import { ContactSearch } from '../../../components/web';

import { searchContacts, createTempContact } from '../../../modules/contacts';
import { createCandidate, resetError } from '../../../modules/candidates';

//let debounce = require('debounce');
import _ from 'lodash';

@connect(state => ({
  contacts: state.contacts,
  candidates:state.candidates,
}), { searchContacts, createTempContact, createCandidate, resetError }, null, { withRef: true })
class ContactSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = this._getResetState();
    this.onQueryChangeImmediate = this.onQueryChangeImmediate.bind(this);
    this.onQueryChange = _.debounce(this.onQueryChange.bind(this), 500);
  }

  _getResetState() {
    return {
      open:true,
      query: '',
      searchResults: [],
      suggestions: [],
      position: {
        lat: 34.016483,
        lng: -118.496859,
      }
    };
  }

  _resetState() {
    this.setState(this._getResetState());
  }

  componentDidMount() {
    let self = this;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        self.setState({
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let self = this;
    let results = nextProps.contacts.get('queries').get(this.state.query);

    this.setState({
      searchResults: results ? results.toArray() : [],
    });

    //Check for success or error saving candidate
    if(nextProps.candidates.saving == false && this.props.candidates.saving == true){
      //a Save was attempted
      if(nextProps.candidates.savingError){
        //Show Snackbar
        setTimeout(function(){
          self.props.resetError();
        },4000);
      } else {
        //Redirect to Job
        self.props.history.replaceState(null,`/jobs/${self.props.params.jobId}/applicants`);
      }
    }
  }

  onQuerySubmit() {
    if (this.state.query.length > 1) {
      this.props.searchContacts(this.state.query);
    }
    else {
      this.setState({
        searchResults: [],
        suggestions: [],
      });
    }
  }

  onQueryChange(e) {
    this.setState({
      query: e.target.value ? e.target.value : '',
    });

    this.onQuerySubmit();
  }

  onQueryChangeImmediate(e){
    e.persist();
    this.onQueryChange(e);
  }

  onQueryClear(e) {
    this.setState({
      query: '',
    });

    e.setValue('');

    this.setState({
      searchResults: [],
      suggestions: [],
    });
  }

  onSearchModalClose() {
    this.setState(this._getResetState());
    if(this.props.onClose){
      this.props.onClose();
    } else {
      this.props.history.goBack();
    }
  }

  onSelect(contact){
    if(this.props.onContactSelect){
      this.props.onContactSelect(contact);
    } else {
      let id = contact.id ? contact.id : 'tmp_' + this._guid();
      contact.id = id;
      contact.companyId = this.props.params.companyId || contact.companyId;

      this.props.createTempContact(contact);
      let self = this;

      setTimeout(function () {
        if(self.props.params.jobId){
          if(contact.id.indexOf('tmp') > -1){
            //this is a temp. need to create
            self.props.history.replaceState(null,`/clients/${contact.companyId}/jobs/${self.props.params.jobId}/candidates/${id}/create`);
          } else {
            self.props.createCandidate(contact, self.props.params.jobId);
          }
        }
        else if(self.props.params.companyId){
          self.props.history.replaceState(null,`/clients/${contact.companyId}/contacts/${id}/create`);
        } else {
          self.props.history.replaceState(null,`/contacts/${id}/create`);
        }
      },500);

    }
  }

  onDbContactSelect(dbContact) {
    let contact = dbContact ? (dbContact.toObject ? dbContact.toObject() : dbContact) : {};

    //this._resetState();
    this.onSelect(contact);
  }

  _guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  render() {
    return (
      <div>
        <ContactSearch
          {...this.props}
          open={this.state.open}
          query={this.state.query}
          searchResults={this.state.searchResults}
          suggestions={this.state.suggestions}
          onQueryChange={this.onQueryChangeImmediate}
          onQuerySubmit={this.onQuerySubmit.bind(this)}
          onQueryClear={this.onQueryClear.bind(this)}
          onSearchModalClose={this.onSearchModalClose.bind(this)}
          onDbContactSelect={this.onDbContactSelect.bind(this)}
        />
      </div>
    );
  }
}

export default ContactSearchContainer;
