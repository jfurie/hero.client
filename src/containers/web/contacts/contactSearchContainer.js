import React from 'react';
import { connect } from 'react-redux';

import { ContactSearchModal } from '../../../components/web';

import { searchContacts, createTempContact } from '../../../modules/contacts';

//let debounce = require('debounce');
import _ from 'lodash';

@connect(state => ({
  contacts: state.contacts,
}), { searchContacts, createTempContact }, null, { withRef: true })
class ContactSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = this._getResetState();
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
    let results = nextProps.contacts.queries.get(this.state.query);

    this.setState({
      searchResults: results ? results.toArray() : [],
    });
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
      this.props.createTempContact(contact);
      let self = this;
      this.setState({open:false});
      setTimeout(function () {
        if(self.props.params.companyId){
          let companyId = self.props.params.companyId;
          self.props.history.replaceState(null,`/clients/${companyId}/contacts/${id}/create`);
        } else {
          self.props.history.replaceState(null,`/contacts/${id}/create`);
        }
      },500);

    }
  }

  onDbContactSelect(dbContact) {
    let contact = dbContact ? (dbContact.toObject ? dbContact.toObject() : dbContact) : {};

    this._resetState();
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
        <ContactSearchModal
          open={this.state.open}
          query={this.state.query}
          searchResults={this.state.searchResults}
          suggestions={this.state.suggestions}
          onQueryChange={this.onQueryChange}
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
