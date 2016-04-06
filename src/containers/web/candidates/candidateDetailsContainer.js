import React from 'react';
import { connect } from 'react-redux';

import { ContactDetails } from '../../../components/web';
import { getCandidateDetail } from '../../../modules/candidates';

function getData(state, props) {
  return {
    candidate: state.candidates.list.get(props.params.candidateId) || null,
  };
}

@connect((state, props) => (
getData(state, props)),
{getCandidateDetail})
class CandidateDetailsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    let self = this;

    setTimeout(() => {
      self.props.getCandidateDetail(self.props.params.candidateId);
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
        <ContactDetails location={this.props.location} onContactDetailsClose={this.onContactDetailsClose.bind(this)} open candidate={candidate} />
      </div>
    );
  }
}

export default CandidateDetailsPage;
