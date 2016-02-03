import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { createContact, createCompanyContact, getOneContact, getContactsByCompany } from '../../../modules/contacts';

import { ContactCreate } from '../../../components/web';

let getData = (state, props) => {
  let contact = null;
  let company = null;

  if (props.params.contactId) {
    contact = state.contacts.list.get(props.params.contactId);
  }

  if (props.params.companyId) {
    company = state.companies.myCompanyIds.get(props.params.companyId);
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
    if (this.props.params.contactId) {
      this.props.getOneContact(this.props.params.contactId);
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({company: newProps.contact});

    if( newProps.contact && newProps.contact.get('saving') == false
    && this.props.contact && this.props.contact.get('saving') == true
    && !newProps.contact.get('savingError')){
      if(this.props.onSave){
        this.props.onSave(newProps.contact.get('id'));
      } else {
        let self = this;
        let id =newProps.contact.get('id');
        setTimeout(function () {
          self.props.history.replaceState(null, `/clients/${id}`);
        }, 500);
      }

    }

    if(newProps.params.contactId != this.props.params.contactId && newProps.params.contactId.indexOf('tmp')<=-1 ){
      this.props.getOneContact(newProps.params.contactId);
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
    this.setState({open:false});
    if(this.props.onClose){
      this.props.onClose();
    } else {
      this.props.history.goBack();
    }
  }

  render(){
    return (
      <ContactCreate
        {...this.props}
        contact={this.state.contact}
        closeModal={this._handleClose.bind(this)}
        onSubmit={this._handleSave.bind(this)}
        onContactChange={this._handleChange.bind(this)}
        open={true}
        inline={false}  />
    );
  }
}

ContactCreateContainer.propTypes = {
  inline: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onSave: React.PropTypes.func,
  open: React.PropTypes.bool,
};
