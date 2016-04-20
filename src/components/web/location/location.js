import React from 'react';
import Immutable from 'immutable';

import google from 'google';

import {
   TextField
} from 'material-ui';
const style = {
  error: {
    float: 'left',
  },
  textField: {
    'width': '100%',
  },
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
  },
  bodyStyle: {
    paddingTop: '0px',
    height: '100%',
    padding: '0',
  },
  contentStyle: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    top: '-64px',
  },
  toolbar: {
    backgroundColor: '#ffffff',
    height: '64px',
  },
  toolbarIcon: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  toolbarFlat: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  toolbarTitle: {
    lineHeight:'64px',
    float:'left',
  },
  select: {
    textAlign: 'left',
    color: '#000',
  },
  floatLabel: {
    top: '12px',
    color: 'rgba(0, 0, 0, 0.298039)',
    fontSize: '12px',
    transform: 'none',
  },
};

export default class Location extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.refs.queryTextField._getInputNode().setAttribute('autocomplete', 'off');
  }

  _handleChange(e, field) {
    let value = (e.target.value === '') ? (null) : (e.target.value);
    let location = this.props.location.set(field,value);
    this.props.onChange(location);
  }

  autocomplete(e, field) {
    let self = this;

    let map = new google.maps.Map(document.createElement('div'));

    let input = e.target;

    let autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      let place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      let street_number = place.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'street_number';
        }).length > 0;
      });

      street_number = street_number && street_number.length > 0 ? street_number[0].short_name : null;

      let route = place.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'route';
        }).length > 0;
      });

      route = route && route.length > 0 ? route[0].short_name : null;

      let locality = place.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'locality';
        }).length > 0;
      });

      locality = locality && locality.length > 0 ? locality[0].short_name : null;

      let administrative_area_level_1 = place.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'administrative_area_level_1';
        }).length > 0;
      });

      administrative_area_level_1 = administrative_area_level_1 && administrative_area_level_1.length > 0 ? administrative_area_level_1[0].short_name : null;

      let country = place.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'country';
        }).length > 0;
      });

      country = country && country.length > 0 ? country[0].short_name : null;

      let postal_code = place.address_components.filter(function(addrItem) {
        return addrItem.types.filter(function (type) {
          return type == 'postal_code';
        }).length > 0;
      });

      postal_code = postal_code && postal_code.length > 0 ? postal_code[0].short_name : null;

      place.geometry.location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      let name = place.name;

      let location = self.props.location.withMutations((state) => {
        state.set('name', name)
        .set('addressLine', street_number ? `${street_number} ${route}` : route)
        .set('city', locality)
        .set('countrySubDivisionCode', administrative_area_level_1)
        .set('countryCode', country)
        .set('postalCode', postal_code);
      });

      self.props.onChange(location);
    });

    this._handleChange(e, field);
  }

  render(){
    let {location} = this.props;
    return (
      <div>
        <div>
          <TextField
              style={style.textField}
              errorText={(location.get('errors') && location.get('errors').name) || ''}
              errorStyle={style.error}
              onChange={(e) => this._handleChange.bind(this)(e, 'name')}
              value={location.get('name')}
              floatingLabelText="Location Name" />
        </div>
        <div>
          <TextField
              ref="queryTextField"
              style={style.textField}
              errorText={(location.get('errors') && location.get('errors').addressLine) || ''}
              errorStyle={style.error}
              onChange={(e) => this.autocomplete.bind(this)(e, 'addressLine')}
              value={location.get('addressLine')}
              floatingLabelText="Address" />
        </div>
        <div>
          <TextField
              style={style.textField}
              errorText={(location.get('errors') && location.get('errors').city) || ''}
              errorStyle={style.error}
              onChange={(e) => this._handleChange.bind(this)(e, 'city')}
              value={location.get('city')}
              floatingLabelText="City" />
        </div>
        <div>
          <TextField
              style={style.textField}
              errorText={(location.get('errors') && location.get('errors').countrySubDivisionCode) || ''}
              errorStyle={style.error}
              onChange={(e) => this._handleChange.bind(this)(e, 'countrySubDivisionCode')}
              value={location.get('countrySubDivisionCode')}
              floatingLabelText="State (2 letter code)" />
        </div>
        <div>
          <TextField
              style={style.textField}
              errorText={(location.get('errors') && location.get('errors').postalCode) || ''}
              errorStyle={style.error}
              onChange={(e) => this._handleChange.bind(this)(e, 'postalCode')}
              value={location.get('postalCode')}
              floatingLabelText="Postal Code" />
        </div>
        <div>
          <TextField
              style={style.textField}
              errorText={(location.get('errors') && location.get('errors').countryCode) || ''}
              errorStyle={style.error}
              onChange={(e) => this._handleChange.bind(this)(e, 'countryCode')}
              value={location.get('countryCode')}
              floatingLabelText="Country (2 Letter)" />
        </div>
      </div>
    );
  }
}

Location.propTypes = {
  location: React.PropTypes.object,
  onChange:React.PropTypes.func,
};
Location.defaultProps = {
  location: new Immutable.Map(),
};
