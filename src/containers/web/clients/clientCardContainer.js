import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import { createCompanyFavorite, deleteCompanyFavorite } from '../../../modules/favorites';

import { ClientListItem } from '../../../components/web';

import getCompanyDataFromState from '../../../dataHelpers/company';

function getData(state, props) {

  let companyId = props.companyId;

  return {
    company: getCompanyDataFromState(state, companyId),
  };
}

@connect((state, props) => (
getData(state, props)), {
  pushState, createCompanyFavorite, deleteCompanyFavorite,
})
class ClientCardContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  openDetails() {
    let {company} = this.props;

    this.props.pushState(null, `/clients/${company.get('id')}`);
  }

  favoriteCompany() {
    let {company} = this.props;

    this.props.createCompanyFavorite(company.get('id'));
  }

  unfavoriteCompany() {
    let {company} = this.props;

    this.props.deleteCompanyFavorite(company.get('id'));
  }

  render() {
    let {company} = this.props;

    return (
      <ClientListItem
          onClientClick={this.openDetails.bind(this)}
          company={company}
          favoriteCompany={this.favoriteCompany.bind(this)}
          unfavoriteCompany={this.unfavoriteCompany.bind(this)}
      />
    );
  }
}

export default ClientCardContainer;
