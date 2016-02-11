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

  openDetails(contact) {
    this.props.pushState(null, `/candidates/${contact.get('id')}`);
  }

  render() {

    let { candidates } = this.props;

    return (
      <div>
        {/*<CandidateDetailsModal open={this.state.candidateDetailsModalOpen} candidate={this.state.selectedCandidate} close={this.closeDetails.bind(this)}/>*/}
        <List style={{backgroundColor:'transparant'}} subheader={`${candidates.length} Candidate${(candidates.length !== 1) ? ('s') : ('')}`}>
            {candidates.map((candidate, key) => {
              return (
                <ContactListItem key={key} contact={candidate.get('contact')} company={candidate.get('company')} onContactClick={this.openDetails.bind(this)}/>
              );
            })}
        </List>
      </div>
    );
  }
}

CandidatesList.propTypes = {
  candidates: React.PropTypes.array.isRequired,
  onOpenCandidateDetails: React.PropTypes.func,
};

export default CandidatesList;
