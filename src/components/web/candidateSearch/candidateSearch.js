import React from 'react';
import { connect } from 'react-redux';

import Immutable from 'immutable';

import { List, ListItem, Divider, Card, CardText, TextField, FontIcon } from 'material-ui';
import Infinite from 'react-infinite';

import { Gravatar, CandidateDetailsModal } from '../../../components/web';

import { searchContacts } from '../../../modules/contacts';

let debounce = require('debounce');

@connect(state => ({
  contacts: state.contacts,
}), { searchContacts }, null, { withRef: true })
export default class CandidateSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query: '',
      results: [],
      candidateDetailsModalOpen: false,
      selectedCandidate: null,
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

    this.onSubmitQuery();
  }

  onSelectContact(contact, candidate) {
    this.setState({
      candidateDetailsModalOpen: true,
      selectedCandidate: candidate ? candidate : new Immutable.Map({
        job: this.props.job,
        contact,
      }),
    });
  }

  createCandidate() {
    this.props.createCandidate(this.state.selectedCandidate.get('contact'), this.state.selectedCandidate.get('job').get('id'));
    this.closeCandidateDetailsModal();
  }

  closeCandidateDetailsModal() {
    this.setState({
      candidateDetailsModalOpen: false,
    });
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
            onChange={debounce(this.onQueryChange.bind(this), 500)}
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

            let candidateIndex = this.props.candidates.map(x => { return x.get('contact').get('id'); }).indexOf(contact.get('id'));
            let candidate = candidateIndex == -1 ? null : this.props.candidates[candidateIndex];

            return (
              <div key={key}>
                <ListItem
                    leftAvatar={<Gravatar email={contact.get('email')} status="notset" />}
                    primaryText={contact.get('displayName')}
                    secondaryText={<p>{secondaryText}</p>}
                    onTouchTap={this.onSelectContact.bind(this, contact, candidate)}
                    rightIcon={<FontIcon className="material-icons">{candidate ? 'check' : 'add'}</FontIcon>}
                />
                <Divider inset={true} />
              </div>
            );
          })}
        </Infinite>
      </List>
      <CandidateDetailsModal open={this.state.candidateDetailsModalOpen} candidate={this.state.selectedCandidate} createCandidate={this.createCandidate.bind(this)} close={this.closeCandidateDetailsModal.bind(this)} />
      </div>
    );
  }
}
