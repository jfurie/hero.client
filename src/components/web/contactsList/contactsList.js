import React from 'react';
import { List, ListItem, ListDivider, Avatar } from 'material-ui';
import Infinite from 'react-infinite';

import { ContactDetailsModal } from '../../../components/web';

class ContactsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      detailsContact: null,
      detailsModalOpen: false,
    };
  }

  openDetails(contact){

    if (this.props.onOpenContactDetails) {
      this.props.onOpenContactDetails(contact);
    }
    //console.log(contact);

    // this.setState({
    //   detailsContact: contact,
    //   detailsModalOpen: true,
    // });
  }

  closeDetails(){
    // this.setState({
    //   detailsContact: null,
    //   detailsModalOpen: false,
    // });
  }

  render() {

    let { contacts } = this.props;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    let count = contacts.count();
    let ressourceName = 'Contact';

    if (count > 1) {
      ressourceName += 's';
    }

    return (
      <div>
        <List style={{backgroundColor:'transparant'}} subheader={`${count} ${ressourceName}`}>
          <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
            {contacts.map((contact, key) => {

              let contactLocation = '';

              if (contact.get('_address')) {

                if (contact.get('_address').get('city')) {
                  contactLocation += contact.get('_address').get('city');
                }

                if (contactLocation.length != 0 && contact.get('_address').get('countrySubDivisionCode')) {
                  contactLocation += `, ${contact.get('_address').get('countrySubDivisionCode')}`;
                } else {
                  contactLocation = contact.get('_address').get('countrySubDivisionCode');
                }
              }

              let secondaryText = contact.get('label') | '';
              if (secondaryText.length && contactLocation) {
                secondaryText += ' | ${contactLocation}';
              } else if (!secondaryText.length && contactLocation) {
                secondaryText = contactLocation;
              }

              let p = 'https://cap.stanford.edu/profiles/viewImage?profileId=65672&type=square';

              return (
                <div>
                  <ListItem
                    leftAvatar={<Avatar src={p}></Avatar>}
                    primaryText={contact.get('displayName')}
                    secondaryText={<p>{secondaryText}</p>}
                    secondaryTextLines={2}
                    onTouchTap={this.openDetails.bind(this, contact)}
                    key={key}
                  />
                  <ListDivider inset={true} />
                </div>
              );
            })}
          </Infinite>
        </List>
        <ContactDetailsModal open={this.state.detailsModalOpen} contact={this.state.detailsContact}/>
      </div>
    );
  }
}

ContactsList.propTypes = {
  contacts: React.PropTypes.object.isRequired,
  onOpenContactDetails: React.PropTypes.func,
};

export default ContactsList;
