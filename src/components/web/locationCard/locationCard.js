import React from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui';
//import {GoogleMap, Marker, GoogleMapLoader} from 'react-google-maps';
import GoogleMap from 'google-map-react';

class LocationCard extends React.Component {

  static defaultProps = {
    center: {lat: 59.938043, lng: 30.337157},
    zoom: 9,
    greatPlaceCoords: {lat: 59.724465, lng: 30.080121},
  };

  constructor(props) {
    super(props);

    this.state = {
      markers: [{
        position: {
          lat: 25.0112183,
          lng: 121.52067570000001,
        },
        key: 'Taiwan',
        defaultAnimation: 2,
      }],
    };
  }

  createMapOptions() {
  // next props are exposed at maps
  // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
  // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
  // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
  // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
  // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
    return {
      // zoomControlOptions: {
      //   position: maps.ControlPosition.RIGHT_CENTER,
      //   style: maps.ZoomControlStyle.SMALL
      // },
      // mapTypeControlOptions: {
      //   position: maps.ControlPosition.TOP_RIGHT
      // },
      mapTypeControl: false,
      disableDefaultUI: true
    };
  }

  render() {

    return (
      <Card>
        <CardMedia>
          <div style={{height: '200px', width: '100%'}}>
            <GoogleMap
              defaultCenter={this.props.center}
              defaultZoom={this.props.zoom}
              options={this.createMapOptions} />
          </div>
        </CardMedia>
        <CardTitle title="Title" subtitle="Subtitle"/>
        <CardText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
      </Card>
    );
  }
}

LocationCard.propTypes = {
};

export default LocationCard;
