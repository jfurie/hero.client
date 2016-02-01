import React from 'react';
import { connect } from 'react-redux';

import { ContactSearchModal } from '../../../components/web';

import { searchContacts } from '../../../modules/contacts';

let debounce = require('debounce');

@connect(state => ({
  contacts: state.contacts,
}), { searchContacts }, null, { withRef: true })
class ContactSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = this._getResetState();
  }

  _getResetState() {
    return {
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
    this.props.onClose();
  }

  onDbContactSelect(dbContact) {
    let contact = dbContact ? (dbContact.toObject ? dbContact.toObject() : dbContact) : {};

    this._resetState();
    this.props.onContactSelect(contact);
  }

  render() {
    return (
      <div>
        <ContactSearchModal
          open={this.props.open}
          query={this.state.query}
          searchResults={this.state.searchResults}
          suggestions={this.state.suggestions}
          onQueryChange={debounce(this.onQueryChange.bind(this), 500)}
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
