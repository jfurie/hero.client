import React from 'react';
import { connect } from 'react-redux';

import { ClientSearchModal } from '../../../components/web';

import { searchCompanies } from '../../../modules/companies';

let debounce = require('debounce');

@connect(state => ({
  companies: state.companies,
}), { searchCompanies }, null, { withRef: true })
class ClientSearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      searchResults: [],
      suggestions: [{}, {}],
      searchModalOpen: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    let results = nextProps.companies.queries.get(this.state.query);

    if (results) {
      this.setState({
        searchResults:  results.toArray(),
      });
    }
  }

  onQuerySubmit() {
    if (this.state.query.length > 1) {
      this.props.searchCompanies(this.state.query);
    }
  }

  onQueryChange(e) {
    this.setState({
      query: e.target.value
    });

    this.onQuerySubmit();
  }

  onQueryClear(e) {
    this.setState({
      query: ''
    });

    e.setValue('');
  }

  onSearchModalClose() {
    this.setState({
      searchModalOpen: false,
    });
  }

  render() {
    return (
      <div>
        <ClientSearchModal
          open={this.state.searchModalOpen}
          query={this.state.query}
          searchResults={this.state.searchResults}
          suggestions={this.state.suggestions}
          onQueryChange={debounce(this.onQueryChange.bind(this), 500)}
          onQuerySubmit={this.onQuerySubmit.bind(this)}
          onQueryClear={this.onQueryClear.bind(this)}
          onSearchModalClose={this.onSearchModalClose.bind(this)} />
      </div>
    );
  }
}

export default ClientSearchPage;
