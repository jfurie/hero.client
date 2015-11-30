import React from 'react';

class ContactsList extends React.Component {

  render() {

    let { contacts } = this.props;

    return (
      <table style={{border: '1px solid black'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact Info</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => {

            let contactLocation = '';

            if (contact.get('_address')) {

              if (contact.get('_address').get('city')) {
                contactLocation += contact.get('_address').get('city');
              }

              if (contactLocation.length != 0 && contact.get('_address').get('countrySubDivisionCode')) {
                contactLocation += ', ' + contact.get('_address').get('countrySubDivisionCode');
              } else {
                contactLocation = contact.get('_address').get('countrySubDivisionCode');
              }

            }

            return (
              <tr key={index}>
                <td style={{padding: '14px', border: '1px solid black'}}>{contact.get('displayName')}<br />{contact.get('label')}</td>
                <td style={{padding: '14px', border: '1px solid black'}}><b>email: </b>{contact.get('email')}<br /><b>phone: </b>{contact.get('phone')}<br /><b>website: </b>{contact.get('website')}</td>
                <td style={{padding: '14px', border: '1px solid black'}}>{contactLocation}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

ContactsList.propTypes = {
  contacts: React.PropTypes.object.isRequired,
};

export default ContactsList;
