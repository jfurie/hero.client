import React from 'react';
import { List, ListItem, Divider } from 'material-ui';
import Infinite from 'react-infinite';

import { CandidateDetailsModal, Gravatar } from '../../../components/web';

class CandidatesList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      detailsCandidate: null,
      detailsModalOpen: false,
    };
  }

  openDetails(candidate){
    this.refs.candidateDetailsModal.show(candidate);
  }

  closeDetails() {

  }

  render() {

    let { candidates } = this.props;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return (
      <div>
        <CandidateDetailsModal ref="candidateDetailsModal"/>
        <List style={{backgroundColor:'transparant'}} subheader={`${candidates.count()} Candidate${(candidates.count() > 1) ? ('s') : ('')}`}>
          <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
            {candidates.map((candidate, key) => {

              let candidateLocation = '';

              if (candidate.get('_address')) {

                if (candidate.get('_address').get('city')) {
                  candidateLocation += candidate.get('_address').get('city');
                }

                if (candidateLocation.length != 0 && candidate.get('_address').get('countrySubDivisionCode')) {
                  candidateLocation += `, ${candidate.get('_address').get('countrySubDivisionCode')}`;
                } else {
                  candidateLocation = candidate.get('_address').get('countrySubDivisionCode');
                }
              }

              let secondaryText = candidate.get('label') | '';
              if (secondaryText.length && candidateLocation) {
                secondaryText += ' | ${candidateLocation}';
              } else if (!secondaryText.length && candidateLocation) {
                secondaryText = candidateLocation;
              }
              //let p = 'https://cap.stanford.edu/profiles/viewImage?profileId=65672&type=square';
              let status = 'vetted';
              return (
                <div key={key}>
                  <ListItem
                    leftAvatar={<Gravatar email={candidate.get('email')} status={status}/>}
                    primaryText={candidate.get('displayName')}
                    secondaryText={<p>{secondaryText} <br/> vetted</p>}
                    secondaryTextLines={2}
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
  candidates: React.PropTypes.object.isRequired,
};

export default CandidatesList;
