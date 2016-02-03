import React from 'react';
import { connect } from 'react-redux';
//import { pushState } from 'redux-router';

import { ContactDetails } from '../../../components/web';
import { getOneContact } from '../../../modules/contacts';

//const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';

function getData(state, props) {
  return {
    contact: state.contacts.list.get(props.params.contactId) || null,
  };
}

@connect((state, props) => (
getData(state, props)),
{getOneContact})
class ContactDetailsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    let self = this;

    setTimeout(() => {
      self.props.getOneContact(self.props.params.contactId);
    }, 500);
  }

  componentWillReceiveProps() {

  }

  onContactDetailsClose(){
    if(this.props.onClose){
      this.props.onClose();
    } else{
      this.props.history.goBack();
    }
  }

  render() {

    let {contact} = this.props;

    return (
      <div>
        <ContactDetails onContactDetailsClose={this.onContactDetailsClose.bind(this)} open={true} contact={contact} />
      </div>
    );
  }
}

export default ContactDetailsPage;
