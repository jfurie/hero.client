import React from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui';
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

    let {location, marker} = this.props;

    if (location) {

      // location fields
      let name = location.get('name') || 'Location';
      let addressLine = location.get('addressLine');
      let city = location.get('city');
      let postalCode = location.get('postalCode');
      let countrySubDivisionCode = location.get('countrySubDivisionCode');
      let geoField = location.get('geoField').toJSON();

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

      // update the marker with the geoField lat lng
      if (marker) {
        let markersProps = marker.props;
        marker = React.cloneElement(marker, {
          ...markersProps,
          lat: geoField.lat,
          lng: geoField.lng,
        });
      }

      return (
        <Card>
          <CardMedia>
            <div style={{height: '200px', width: '100%'}}>
              <GoogleMap
                center={geoField}
                defaultZoom={13}
                options={this.createMapOptions}
              >
              {(marker) ? (
                marker
              ) : (null)}
              </GoogleMap>
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
  marker: React.PropTypes.element,
};

export default LocationCard;
