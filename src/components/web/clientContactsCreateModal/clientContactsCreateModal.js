import React from 'react';
import { connect } from 'react-redux';
import { IconButton, ToolbarGroup, FlatButton, TextField, ToolbarTitle, Toolbar } from 'material-ui';
import {Dialog} from '../';
import { createCompanyContact } from '../../../modules/contacts';
import phoneFormatter from 'phone-formatter';

import validateContact from '../../../validators/contact';

const style = {
  error: {
    float: 'left',
  },
  textField: {
    'width': '100%',
  },
};

@connect(() => (
{}), {createCompanyContact}, null, {withRef: true})
export default class ClientContactsCreateModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      contact: {},
      errors: {},
      open: false,
    };
  }

  show() {
    this.setState({
      open: true,
    });
  }

  closeModal(){
    this.setState({
      open: false,
    });
  }

  _handleChange(e, field) {
    let newContact = this.state.contact;
    let value = (e.target.value === '') ? (null) : (e.target.value);

    if (value) {
      newContact[field] = value;
    } else {
      delete newContact[field];
    }

    this.setState({
      contact: newContact,
    });
  }

  _handleSubmit(){

    // format phone number
    if (this.state.contact.phone) {
      let newContact = this.state.contact;
      newContact.phone = phoneFormatter.format(newContact.phone, '(NNN) NNN-NNNN');
      this.setState({
        contact: newContact,
      });
    }

    let errors = validateContact(this.state.contact);

    this.setState({
      errors,
    });

    if (errors.validationErrors === 0) {

      let contact = this.state.contact;
      contact.displayName = `${this.state.contact.firstName} ${this.state.contact.lastName}`;

      contact.sourceInfo = {
        referrer: 'hero.client',
      };

      // temp for now (will be replaced by location component)
      contact._address = {
        addressLine: contact.addressLine,
        postalCode: contact.postalCode,
        city: contact.city,
        countryCode: 'US',
        countrySubDivisionCode: 'CA',
      };

      delete contact.addressLine;
      delete contact.postalCode;
      delete contact.city;
      // end temp

      this.props.createCompanyContact(this.props.companyId, contact);
      this.closeModal();
    }
  }
  toolbar(){
    return (
      <Toolbar style={{backgroundColor:'#ffffff', height:'64px'}}>
        <ToolbarGroup key={0} float="left">
          <IconButton onTouchTap={this.closeModal.bind(this)} style={{marginTop:'8px',float:'left', marginRight:'8px', marginLeft:'-16px'}} iconClassName='material-icons'>close</IconButton>
          <ToolbarTitle style={{lineHeight:'64px', float:'left'}} text="Create Contact" />
        </ToolbarGroup>
        <ToolbarGroup key={1} float="right">
          <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={{marginTop:'14px', marginRight:'-16px', marginLeft:'auto'}}>Save</FlatButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }
  render(){
    //let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return (
      <Dialog
          toolbar={this.toolbar()}
          open={this.state.open}>
        <div >


        <div className="row center-xs">
            <div className="col-xs-10 col-md-6">
                <div className="box">
                  <form onSubmit={this._handleSubmit.bind(this)}>
                    <div>
                      <TextField
                          style={style.textField}
                          errorText={this.state.errors['firstName'] || ''}
                          errorStyle={style.error}
                          onChange={(e) => this._handleChange.bind(this)(e, 'firstName')}
                          floatingLabelText="First Name" />
                    </div>
                    <div>
                      <TextField
                          style={style.textField}
                          errorText={this.state.errors['lastName'] || ''}
                          errorStyle={style.error}
                          onChange={(e) => this._handleChange.bind(this)(e, 'lastName')}
                          floatingLabelText="Last Name" />
                    </div>
                    <div>
                      <TextField
                          type='email'
                          style={style.textField}
                          errorText={this.state.errors['email'] || ''}
                          errorStyle={style.error}
                          onChange={(e) => this._handleChange.bind(this)(e, 'email')}
                          floatingLabelText="Email" />
                    </div>
                    <div>
                      <TextField
                          style={style.textField}
                          errorText={this.state.errors['phone'] || ''}
                          errorStyle={style.error}
                          value={this.state.contact.phone || ''}
                          onChange={(e) => this._handleChange.bind(this)(e, 'phone')}
                          floatingLabelText="Phone (optional)" />
                    </div>
                    <div>
                      <TextField
                          style={style.textField}
                          errorText={this.state.errors['addressLine'] || ''}
                          errorStyle={style.error}
                          onChange={(e) => this._handleChange.bind(this)(e, 'addressLine')}
                          floatingLabelText="Address (optional)" />
                    </div>
                    <div>
                      <TextField
                          style={style.textField}
                          errorText={this.state.errors['postalCode'] || ''}
                          errorStyle={style.error}
                          onChange={(e) => this._handleChange.bind(this)(e, 'postalCode')}
                          floatingLabelText="Postal Code (optional)" />
                    </div>
                    <div>
                      <TextField
                          style={style.textField}
                          errorText={this.state.errors['city'] || ''}
                          errorStyle={style.error}
                          onChange={(e) => this._handleChange.bind(this)(e, 'city')}
                          floatingLabelText="City (optional)" />
                    </div>
                  </form>
                </div>
            </div>
        </div>
        </div>
      </Dialog>
    );
  }
}

ClientContactsCreateModal.propTypes = {
  companyId: React.PropTypes.string,
};
