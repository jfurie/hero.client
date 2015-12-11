import React from 'react';
import { List, ListItem, ListDivider, Avatar } from 'material-ui';
import Infinite from 'react-infinite';

import { RingCandidate } from '../../../components/web';

class CandidatesList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      detailscandidate: null,
      detailsModalOpen: false,
    };
  }

  openDetails(){

    // if (this.props.onOpencandidateDetails) {
    //   this.props.onOpencandidateDetails(candidate);
    // }
    //console.log(candidate);

    // this.setState({
    //   detailscandidate: candidate,
    //   detailsModalOpen: true,
    // });
  }

  closeDetails(){
    // this.setState({
    //   detailscandidate: null,
    //   detailsModalOpen: false,
    // });
  }

  render() {

    let { candidates } = this.props;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return (
      <div>
        <List style={{backgroundColor:'transparant'}} subheader={`${candidates.count()} Candidates`}>
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
              let p = 'https://cap.stanford.edu/profiles/viewImage?profileId=65672&type=square';
              let status = 'vetted';
              return (
                <div>
                  <ListItem
                    leftAvatar={<Avatar><RingCandidate key={key} picture={p} status={status} size={'large'}/></Avatar>}
                    primaryText={candidate.get('displayName')}
                    secondaryText={<p>{secondaryText} <br/> vetted</p>}
                    secondaryTextLines={2}
                  />
                  <ListDivider inset={true} />
                </div>
              );
            })}
          </Infinite>
        </List>
        {/*<candidateDetailsModal open={this.state.detailsModalOpen} candidate={this.state.detailscandidate}/>*/}
      </div>
    );
  }
}

CandidatesList.propTypes = {
  candidates: React.PropTypes.object.isRequired,
};

export default CandidatesList;
