import React from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui';
//import {GoogleMap, Marker, GoogleMapLoader} from 'react-google-maps';
import GoogleMap from 'google-map-react';

class LocationCard extends React.Component {

  constructor(props) {
    super(props);
  }

  createMapOptions() {
    return {
      mapTypeControl: false,
      disableDefaultUI: true,
      draggable: false,
    };
  }

  render() {

    let {location} = this.props;

    if (location) {

      // location fields
      let name = location.get('name') || 'Location';
      let addressLine = location.get('addressLine');
      let city = location.get('city');
      let postalCode = location.get('postalCode');
      let countrySubDivisionCode = location.get('countrySubDivisionCode');
      let geoField = location.get('geoField').toJSON();

      //let title = location.get('name') || 'Location';
      let subtitle = `${addressLine}` || '';

      if (city) {

        subtitle += ', ';

        if (postalCode) {
          subtitle += `${postalCode} `;
        }
        subtitle += city;
      }

      if (subtitle.length && countrySubDivisionCode) {
        subtitle += `, ${countrySubDivisionCode}`;
      }

      return (
        <Card>
          <CardMedia>
            <div style={{height: '200px', width: '100%'}}>
              <GoogleMap
                center={geoField}
                defaultZoom={13}
                options={this.createMapOptions} />
            </div>
          </CardMedia>
          <CardTitle title={name} subtitle={subtitle}/>
        </Card>
      );
    } else {
      return (null);
    }
  }
}

LocationCard.propTypes = {
  location: React.PropTypes.object,
};

export default LocationCard;
