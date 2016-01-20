import React from 'react';
import { connect } from 'react-redux';

import { List, ListItem, Divider, Card, CardText, TextField, FontIcon } from 'material-ui';
import Infinite from 'react-infinite';

import { Gravatar, CandidateCreateFromContactModal } from '../../../components/web';

import { searchContacts } from '../../../modules/contacts';


@connect(state => ({
  contacts: state.contacts,
}), { searchContacts }, null, { withRef: true })
export default class CandidateSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query: '',
      results: [],
      openModal: false,
      selectedContact: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    let results = nextProps.contacts.queries.get(this.state.query);

    if (results) {
      this.setState({
        results:  results.toArray(),
      });
    }
  }

  onSubmitQuery() {
    if (this.state.query.length > 1) {
      this.props.searchContacts(this.state.query);
    }
  }

  onQueryChange(e) {
    this.setState({
      query: e.target.value
    });
  }

  onSelectContact(contact, isCandidate) {
    this.setState({
      openModal: true,
      selectedContact: contact,
      isCandidate,
    });
  }

  onCloseModal() {
    this.setState({
      openModal: false,
      selectedContact: null,
    });
  }

  onCloseAllModals() {
    this.setState({
      openModal: false,
      selectedContact: null,
    });

    this.props.close();
  }

  render(){
    let results = this.state.results;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return (
      <div>
        <Card>
        <CardText>
          <TextField
            onEnterKeyDown={this.onSubmitQuery.bind(this)}
            onChange={this.onQueryChange.bind(this)}
            fullWidth
            floatingLabelText="Search Candidates"
          >
          </TextField>
          {/*}<TextField
            fullWidth
            floatingLabelText="Location"
            >
          </TextField>
          <div>
            <IconButton iconClassName="material-icons" tooltipPosition="top-center"
          tooltip="View List">view_list</IconButton> |
            <IconButton iconClassName="material-icons" tooltipPosition="top-center"
  tooltip="View Map">location_on</IconButton> |
  <IconButton iconClassName="material-icons" tooltipPosition="top-center"
tooltip="View Favorites">favorite</IconButton>
          </div>*/}
        </CardText>
      </Card>
      <List style={{backgroundColor:'transparant'}} subheader={`${results.length} Candidate${(results.length > 1) ? ('s') : ('')}`}>
        <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
          {results.map((contact, key) => {

            let location = '';

            if (contact.get('_address')) {

              if (contact.get('_address').get('city')) {
                location += contact.get('_address').get('city');
              }

              if (location.length != 0 && contact.get('_address').get('countrySubDivisionCode')) {
                location += `, ${contact.get('_address').get('countrySubDivisionCode')}`;
              } else {
                location = contact.get('_address').get('countrySubDivisionCode');
              }
            }

            let secondaryText = contact.get('label') || '';
            if (secondaryText.length && location) {
              secondaryText += ' | ${location}';
            } else if (!secondaryText.length && location) {
              secondaryText = location;
            }

            let isCandidate = this.props.candidates.map(x => { return x.get('contact').get('id'); }).indexOf(contact.get('id')) == -1 ? false : true;

            return (
              <div key={key}>
                <ListItem
                    leftAvatar={<Gravatar email={contact.get('email')} />}
                    primaryText={contact.get('displayName')}
                    secondaryText={<p>{secondaryText}</p>}
                    onTouchTap={this.onSelectContact.bind(this, contact, isCandidate)}
                    rightIcon={<FontIcon className="material-icons">{isCandidate ? 'check' : 'add'}</FontIcon>}
                />
                <Divider inset={true} />
              </div>
            );
          })}
        </Infinite>
      </List>
      <CandidateCreateFromContactModal open={this.state.openModal} contact={this.state.selectedContact} close={this.onCloseModal.bind(this)} closeAll={this.onCloseAllModals.bind(this)} jobId={this.props.jobId} isCandidate={this.state.isCandidate} />
      </div>
    );
  }
}
