import React from 'react';
import { connect } from 'react-redux';
import { Header, CandidatesList } from '../../../components/web';
import { getMyCandidates } from '../../../modules/candidates';
import { createContactFavorite, deleteContactFavorite } from '../../../modules/contacts';

@connect(state => ({
  candidates: state.candidates,
  auth: state.auth,
}), { getMyCandidates, createContactFavorite, deleteContactFavorite })
class MyCandidatesPage extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.getMyCandidates();
  }

  favoriteContact(contact) {
    this.props.createContactFavorite(contact.get('id'));
  }

  unfavoriteContact(contact) {
    this.props.deleteContactFavorite(contact.get('id'));
  }

  render() {

    let {candidates} = this.props;

    return (
      <div>
        <Header title={'Candidates'}/>
        <CandidatesList
            candidates={candidates.myCandidateIds}
            favoriteContact={this.favoriteContact.bind(this)}
            unfavoriteContact={this.unfavoriteContact.bind(this)}
        />
      </div>);
  }
}

export default MyCandidatesPage;
