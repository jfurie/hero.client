import React from 'react';
import { connect } from 'react-redux';

import { ClientSearchModal } from '../../../components/web';

import { searchCompanies } from '../../../modules/companies';

import google from 'google';

let debounce = require('debounce');

@connect(state => ({
  companies: state.companies,
}), { searchCompanies }, null, { withRef: true })
class ClientSearchContainer extends React.Component {

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
    let results = nextProps.companies.queries.get(this.state.query);

    this.setState({
      searchResults: results ? results.toArray() : [],
    });
  }

  onQuerySubmit() {
    if (this.state.query.length > 1) {
      this.props.searchCompanies(this.state.query);
      this.onTextPlacesSearch();
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

  onNearbyPlacesSearch() {
    let self = this;

    let location = new google.maps.LatLng(this.state.position.lat, this.state.position.lng);

    let map = new google.maps.Map(document.createElement('div'), {
      center: location,
    });

    let request = {
      location,
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

  onTextPlacesSearch() {
    let self = this;

    let map = new google.maps.Map(document.createElement('div'));

    let request = {
      query: this.state.query,
    };

    let service = new google.maps.places.PlacesService(map);

    service.textSearch(request, function(results, status) {
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

  onPlaceDetailSearch(placeId, callback) {
    let map = new google.maps.Map(document.createElement('div'));

    let request = {
      placeId,
    };

    let service = new google.maps.places.PlacesService(map);
    service.getDetails(request, function (place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        callback(place);
      }
    });
  }

  onDbClientSelect(dbClient) {
    let client = dbClient ? dbClient.toObject() : {};

    delete client['jobs'];
    delete client['candidates'];

    this._resetState();
    this.props.onClientSelect(client);
  }

  onGoogleClientSelect(googleClient) {
    let self = this;

    this.onPlaceDetailSearch(googleClient.place_id, function (detail) {
      let street_number = detail.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'street_number';
        }).length > 0;
      });

      street_number = street_number && street_number.length > 0 ? street_number[0].short_name : null;

      let route = detail.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'route';
        }).length > 0;
      });

      route = route && route.length > 0 ? route[0].short_name : null;

      let locality = detail.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'locality';
        }).length > 0;
      });

      locality = locality && locality.length > 0 ? locality[0].short_name : null;

      let administrative_area_level_1 = detail.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'administrative_area_level_1';
        }).length > 0;
      });

      administrative_area_level_1 = administrative_area_level_1 && administrative_area_level_1.length > 0 ? administrative_area_level_1[0].short_name : null;

      let country = detail.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'country';
        }).length > 0;
      });

      country = country && country.length > 0 ? country[0].short_name : null;

      let postal_code = detail.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'postal_code';
        }).length > 0;
      });

      postal_code = postal_code && postal_code.length > 0 ? postal_code[0].short_name : null;

      detail.geometry.location = {
        lat: detail.geometry.location.lat(),
        lng: detail.geometry.location.lng(),
      };

      let client = {
        name: detail.name,
        website: detail.website,
        phone: detail.formatted_phone_number,
        location: {
          geoField: {
            lat: detail.geometry.location.lat,
            lng: detail.geometry.location.lng,
          },
          googlePlace: detail,
          addressLine: `${street_number} ${route}`,
          city: locality,
          countrySubDivisionCode: administrative_area_level_1,
          countryCode: country,
          postalCode: postal_code,
        },
      };

      // "street_number", "route", "locality", "administrative_area_level_1", "country", "postal_code"

      self._resetState();
      self.props.onClientSelect(client);
    });
  }

  render() {
    return (
      <div>
        <ClientSearchModal
          open={this.props.open}
          query={this.state.query}
          searchResults={this.state.searchResults}
          suggestions={this.state.suggestions}
          onQueryChange={debounce(this.onQueryChange.bind(this), 500)}
          onQuerySubmit={this.onQuerySubmit.bind(this)}
          onQueryClear={this.onQueryClear.bind(this)}
          onSearchModalClose={this.onSearchModalClose.bind(this)}
          onDbClientSelect={this.onDbClientSelect.bind(this)}
          onGoogleClientSelect={this.onGoogleClientSelect.bind(this)}
        />
      </div>
    );
  }
}

export default ClientSearchContainer;
