import React from 'react';
import Immutable from 'immutable';
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
  _handleChange(e, field) {
    let value = (e.target.value === '') ? (null) : (e.target.value);
    var location = this.props.location.set(field,value);
    this.props.onChange(location);
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
              style={style.textField}
              errorText={(location.get('errors') && location.get('errors').addressLine) || ''}
              errorStyle={style.error}
              onChange={(e) => this._handleChange.bind(this)(e, 'addressLine')}
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
              errorText={(location.get('errors') && location.get('errors').country) || ''}
              errorStyle={style.error}
              onChange={(e) => this._handleChange.bind(this)(e, 'country')}
              value={location.get('country')}
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
