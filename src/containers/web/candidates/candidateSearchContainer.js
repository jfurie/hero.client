import React from 'react';
import { CandidateSearch } from '../../../components/web';

export default class CandidateSearchContainer extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div><CandidateSearch /></div>
    );
  }
}
