import React from 'react';
import { Avatar, FontIcon, Card, FlatButton, Styles } from 'material-ui';
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';

const style = {
  smallListItem: {
    padding: 0,
    margin: '0 16px',
  },
};

class LocationCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAllLocations: false,
    };
  }

  showAllLocations() {
    this.setState({
      showAllLocations: true,
    });
  }

  renderSmallListItem(content,avatar){
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{color:'rgba(0, 0, 0, 0.87)', fontSize:'15px'}}>{content}</div>
        </div>
      </div>
    );
  }

  renderLocation(location) {
    let {maskLocation, zoom} = this.props;

    let options = {
      mapTypeControl: false,
      disableDefaultUI: true,
      draggable: false,
      scrollwheel: false,
      navigationControl: false,
      scaleControl: false,
      disableDoubleClickZoom: true,
      styles: [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f2f2'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#46bcec'},{'visibility':'on'}]}],
    };

    let address;
    let geoField;
    let defaultZoom;
    let name;

    if (location && location.get('geoField')) {
      // location fields
      let line1 = location.get('addressLine');
      let city = location.get('city');
      let postalCode = location.get('postalCode');
      let countrySubDivisionCode = location.get('countrySubDivisionCode');
      let countryCode = location.get('countryCode');
      geoField = location.get('geoField').toJSON();

      if (maskLocation) {
        address = '';
      }
      else {
        address = line1 || '';
      }

      if (city) {
        address += address ? ', ' : '';
        address += `${city}`;
      }

      if (countrySubDivisionCode) {
        address += address ? ', ' : '';
        address += `${countrySubDivisionCode}`;
      }

      if (postalCode) {
        address += address ? ' ' : '';
        address += `${postalCode}`;
      }

      if (!address) {
        address += `${countryCode}`;
      }

      defaultZoom = zoom || 13;
    }
    else {
      address = 'United States';
      geoField = {
        lat: 37.09024,
        lng: -95.712891,
      };

      defaultZoom = 3;
    }

    let marker = {
      position: geoField,
      defaultAnimation: 2,
    };

    let externalLink;

    if (defaultZoom > 3) {
      if (maskLocation) {
        externalLink = `http://maps.google.com/maps?q=${address}&z=${defaultZoom}`;
      }
      else {
        externalLink = `http://maps.google.com/maps?q=${geoField.lat},${geoField.lng}&z=${defaultZoom}`;
      }
    }
    else {
      externalLink = 'http://maps.google.com';
    }

    name = location.get('name') || address;

    return (
      <div>
        <div style={style.smallListItem}>
          {this.renderSmallListItem(name,
          <Avatar
              icon={<FontIcon className="material-icons">place</FontIcon>}
              color={Styles.Colors.grey600}
              backgroundColor={Styles.Colors.white}
          />)}
        </div>
        <div style={{padding: '8px'}}>
          <div
              style={{
                height: '225px',
                width: '100%',
                position: 'relative',
              }}
          >
            <a
                style={{display: 'flex', alignItems: 'center', position: 'absolute', left: -1, right: -1, bottom: -1, top: -1, zIndex: 10, cursor: 'pointer'}}
                href={externalLink}
                target="_blank"
            >
            {
              maskLocation ?
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{marginTop: '-25px', display: 'inline-block', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: Styles.Colors.blue200, border: `2px solid ${Styles.Colors.blue500}`, opacity: '0.5'}}></div>
              </div>
              : (null)
            }
            </a>
            <div style={{position: 'absolute', left: -1, right: -1, bottom: -1, height: '25px', backgroundColor: '#fff', zIndex: 1000}} />
            <GoogleMapLoader
                containerElement={
                  <div
                      {...this.props}
                      style={{
                        height: '225px',
                        width: '100%',
                      }}
                  />
                }
                googleMapElement={
                  <GoogleMap
                      options={options}
                      zoom={defaultZoom}
                      center={geoField}
                  >
                    {
                      !maskLocation && defaultZoom > 3 ?
                      <Marker
                          {...marker}
                      />
                      : (null)
                    }
                  </GoogleMap>
                }
            />
          </div>

        </div>
      </div>
    );
  }

  render() {
    let {location, otherLocations} = this.props;
    let hasMultipleLocations = otherLocations && otherLocations.size > 1;
    return (
      <Card>
        <div style={{padding: 0, margin: '16px 24px 32px 24px', fontSize: '18px', color: Styles.Colors.grey600}}>
          {
            hasMultipleLocations ?
            <div>
              Multiple Locations
              {
                !this.state.showAllLocations ?
                <FlatButton label="(Show All)" style={{color: Styles.Colors.blue500, fontSize: '12px'}} onTouchTap={this.showAllLocations.bind(this)} />
                : (null)
              }

            </div>
            : 'Location'
          }
        </div>
        {
          hasMultipleLocations && this.state.showAllLocations ?
          otherLocations.map(location => {
            return this.renderLocation(location);
          })
          :
          this.renderLocation(location)
        }
      </Card>
    );
  }
}

LocationCard.propTypes = {
  location: React.PropTypes.object,
};

export default LocationCard;
