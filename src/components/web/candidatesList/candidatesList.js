import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { List } from 'material-ui';
import { ContactListItem } from '../../../components/web';

@connect(() => (
{}), {pushState})
class CandidatesList extends React.Component {

  constructor(props) {
    super(props);
  }

  openDetails(candidate) {
    this.props.pushState(null, `/contacts/${candidate.get('id')}`);
  }

  favoriteContact(contact) {
    if (this.props.favoriteContact) {
      this.props.favoriteContact(contact);
    }
  }

  unfavoriteContact(contact) {
    if (this.props.unfavoriteContact) {
      this.props.unfavoriteContact(contact);
    }
  }

  render() {
    let { candidates } = this.props;

    let candidateCount;

    if (Array.isArray(candidates)) {
      candidateCount = candidates.length;
    }
    else {
      candidateCount = candidates.size;
    }

    candidates = candidates.sort((a, b) => {
      return a.get('contact').get('displayName').localeCompare(b.get('contact').get('displayName'));
    });

    return (
      <List style={{backgroundColor: 'transparent'}} subheader={`${candidateCount} Candidate${(candidateCount !== 1) ? ('s') : ('')}`}>
          {candidates.map((candidate, key) => {
            return (
              <ContactListItem
                  key={key}
                  contact={candidate.get('contact')}
                  company={candidate.get('company')}
                  onContactClick={this.openDetails.bind(this)}
                  favoriteContact={this.favoriteContact.bind(this)}
                  unfavoriteContact={this.unfavoriteContact.bind(this)}
              />
            );
          })}
      </List>
    );
  }
}

export default CandidatesList;
