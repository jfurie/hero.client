import React from 'react';
import { connect } from 'react-redux';

import { ClientSearchModal } from '../../../components/web';

import { searchCompanies } from '../../../modules/companies';

import google from 'google';

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
      suggestions: [],
      searchModalOpen: true,
      position: {
        lat: 34.016483,
        long: -118.496859,
      },
    };
  }

  componentDidMount() {
    let self = this;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        self.setState({
          position: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          },
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let results = nextProps.companies.queries.get(this.state.query);

    this.setState({
      searchResults: results ? results.toArray() : [],
    });
  }

  onQuerySubmit() {
    if (this.state.query.length > 1) {
      this.props.searchCompanies(this.state.query);
      this.onPlacesSearch();
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
    this.setState({
      searchModalOpen: false,
    });
  }

  onPlacesSearch() {
    let self = this;

    let thirdSt = new google.maps.LatLng(this.state.position.lat, this.state.position.long);

    let map = new google.maps.Map(document.createElement('div'), {
      center: thirdSt,
    });

    let request = {
      location: thirdSt,
      radius: '50000',
      keyword: this.state.query,
    };

    let service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        self.setState({
          suggestions: results,
        });
      } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        self.setState({
          suggestions: [],
        });
      }
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
          onSearchModalClose={this.onSearchModalClose.bind(this)}
        />
      </div>
    );
  }
}

export default ClientSearchPage;
