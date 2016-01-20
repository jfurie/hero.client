import React from 'react';
import { List, ListItem, Divider } from 'material-ui';
import Infinite from 'react-infinite';

import { CandidateDetailsModal, Gravatar, CandidatesListItemStatus } from '../../../components/web';

class CandidatesList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      detailsCandidate: null,
      detailsModalOpen: false,
    };
  }

  openDetails(candidate){
    this.refs.candidateDetailsModal.getWrappedInstance().show(candidate);
  }

  closeDetails() {

  }

  render() {

    let { candidates } = this.props;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return (
      <div>
        <CandidateDetailsModal ref="candidateDetailsModal"/>
        <List style={{backgroundColor:'transparant'}} subheader={`${candidates.length} Candidate${(candidates.length > 1) ? ('s') : ('')}`}>
          <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
            {candidates.map((candidate, key) => {

              let candidateLocation = '';
              let candidateContact = candidate.get('contact');

              if (candidateContact && candidateContact.get('_address')) {

                if (candidateContact.get('_address').get('city')) {
                  candidateLocation += candidateContact.get('_address').get('city');
                }

                if (candidateLocation.length != 0 && candidateContact.get('_address').get('countrySubDivisionCode')) {
                  candidateLocation += `, ${candidateContact.get('_address').get('countrySubDivisionCode')}`;
                } else {
                  candidateLocation = candidateContact.get('_address').get('countrySubDivisionCode');
                }
              }

              let secondaryText = candidateContact.get('label') || '';
              if (secondaryText.length && candidateLocation) {
                secondaryText += ' | ${candidateLocation}';
              } else if (!secondaryText.length && candidateLocation) {
                secondaryText = candidateLocation;
              }

              return (
                <div key={key}>
                  <ListItem
                      leftAvatar={<Gravatar email={candidateContact.get('email')} status={candidate.get('status')} />}
                      primaryText={candidateContact.get('displayName')}
                      secondaryText={<p>{secondaryText}</p>}
                      secondaryTextLines={1}
                      rightIcon={<CandidatesListItemStatus status={candidate.get('status')} />}
                      onTouchTap={this.openDetails.bind(this, candidate)}
                  />
                  <Divider inset={true} />
                </div>
              );
            })}
          </Infinite>
        </List>
      </div>
    );
  }
}

CandidatesList.propTypes = {
  candidates: React.PropTypes.array.isRequired,
};

export default CandidatesList;
