import React from 'react';

import { ClientSearchModal } from '../../../components/web';

class ClientSearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      searchResults: [{}, {}, {}],
      suggestions: [{}, {}],
      searchModalOpen: true,
    };
  }

  onQuerySubmit() {
    if (this.state.query.length > 1) {
      //this.props.searchClients(this.state.query);
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
          onQueryChange={this.onQueryChange.bind(this)}
          onQuerySubmit={this.onQuerySubmit.bind(this)}
          onQueryClear={this.onQueryClear.bind(this)}
          onSearchModalClose={this.onSearchModalClose.bind(this)} />
      </div>
    );
  }
}

export default ClientSearchPage;
