import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { createContact, createCompanyContact, getOneContact, getContactsByCompany } from '../../../modules/contacts';

import { ContactCreate } from '../../../components/web';

let getData = (state, props) => {
  let contact = null;
  let company = null;

  if (props.contactId) {
    contact = state.contacts.list.get(props.contactId);
  }

  if (props.companyId) {
    company = state.companies.myCompanyIds.get(props.companyId);
  }

  return {
    contact,
    company,
    companies: state.companies.myCompanyIds,
  };
};

@connect(getData, { createContact, createCompanyContact, getOneContact, getContactsByCompany })
export default class ContactCreateContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contact : this.props.contact || new Immutable.Map({errors:new Immutable.Map()}),
      open: true,
    };
  }

  componentDidMount() {
    //this.props.getOneContact(this.props.contactId);
  }

  componentWillReceiveProps(newProps){
    if((newProps.contact && !this.props.contact)
    || (newProps.contact && newProps.contact.get('id') != this.props.contact.get('id') )){
      this.setState({
        contact: newProps.contact,
      });
    }
    if( newProps.contact && newProps.contact.get('saving') == false
    && this.props.contact && this.props.contact.get('saving') == true){
      this.props.onSave(newProps.contact.get('id'));
    }

    if(newProps.contactId != this.props.contactId && newProps.contactId.indexOf('tmp')<=-1 ){
      this.props.getOneContact(newProps.contactId);
    }
  }

  _handleChange(contact){
    this.setState({
      contact,
    });
  }

  _handleSave(contact){
    contact.set('displayName', `${this.state.contact.get('firstName')} ${this.state.contact.get('lastName')}`);

    contact.set('sourceInfo', {
      referrer: 'hero.client',
    });

    this.setState({
      contact,
    });

    if (this.props.companyId) {
      this.props.createCompanyContact(this.props.companyId, contact);
    }
    else {
      this.props.createContact(contact);
    }

    this.props.onClose();
  }

  _handleClose(){
    this.setState({
      open:false,
    });

    this.props.onClose();
  }

  render(){
    return (
      <ContactCreate
        {...this.props}
        contact={this.state.contact}
        closeModal={this._handleClose.bind(this)}
        onSubmit={this._handleSave.bind(this)}
        onContactChange={this._handleChange.bind(this)}
        open={this.props.open}
        inline={this.props.inline}  />
    );
  }
}

ContactCreateContainer.propTypes = {
  inline: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onSave: React.PropTypes.func,
  open: React.PropTypes.bool,
};
