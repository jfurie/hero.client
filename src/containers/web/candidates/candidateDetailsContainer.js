import React from 'react';
import { connect } from 'react-redux';
//import { pushState } from 'redux-router';

import { ContactDetails } from '../../../components/web';
import { getOneCandidate } from '../../../modules/candidates';

//const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';

function getData(state, props) {
  return {
    candidate: state.candidates.list.get(props.params.candidateId) || null,
  };
}

@connect((state, props) => (
getData(state, props)),
{getOneCandidate})
class CandidateDetailsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    let self = this;

    setTimeout(() => {
      self.props.getOneCandidate(self.props.params.candidateId);
    }, 500);
  }

  componentWillReceiveProps() {

  }

  onContactDetailsClose(){
    if(this.props.onClose){
      this.props.onClose();
    } else{
      this.props.history.goBack();
    }
  }

  render() {

    let {candidate} = this.props;

    return (
      <div>
        <ContactDetails onContactDetailsClose={this.onContactDetailsClose.bind(this)} open candidate={candidate} />
      </div>
    );
  }
}

export default CandidateDetailsPage;
