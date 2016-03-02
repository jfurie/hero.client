import React from 'react';
import { connect } from 'react-redux';
import { GlobalSearch } from '../../../components/web';
import { search } from '../../../modules/search';
import { replaceState, pushState } from 'redux-router';
import _ from 'lodash';
let getData = (state, props) => {
  var query = props.location.state && props.location.state.query || '';
  let searchResults = state.search.bySearchQuery.get(query);
  return {
    searchResults
  };
};
@connect(getData, { search, replaceState, pushState })
export default class SearchContainer extends React.Component {
  constructor(props){
    super(props);
    this.handleQueryChangeDebounce = _.debounce(this.handleQueryChangeDebounce.bind(this), 500);
  }
  componentDidMount(){
    if(this.props.location.state && this.props.location.state.query){
      this.props.search(this.props.location.state.query);
    }
  }
  handleSearchModalClose(){
    this.props.history.goBack();
  }
  handleQuerySubmit(){
    this.props.search(this.props.location.state.query);
  }
  handleQueryChange(e){
    this.props.replaceState({query:e.target.value, }, document.location.pathname+document.location.search);
    this.handleQueryChangeDebounce();
  }
  handleQueryChangeDebounce(){
    this.props.search(this.props.location.state.query);
  }
  handleItemSelect(item){
    console.log(item.toJSON());
    switch (item.get('type')) {
    case 'company':
      this.props.pushState(null,`/clients/${item.get('_id')}`);
      break;
    case 'job':
      this.props.pushState(null,`/jobs/${item.get('_id')}`);
      break;
    case 'contact':
      this.props.pushState(null,`/contacts/${item.get('_id')}`);
      break;
    default:

    }

  }
  render(){
    console.log(this.props.location.state);
    console.log(this.props.searchResults);
    return (
      <div><GlobalSearch
        {...this.props}
        searchResults={this.props.searchResults}
        onSearchModalClose={this.handleSearchModalClose.bind(this)}
        onQuerySubmit={this.handleQuerySubmit.bind(this)}
        onQueryChange={this.handleQueryChange.bind(this)}
        onItemSelect={this.handleItemSelect.bind(this)}
         /></div>
    );
  }
}
