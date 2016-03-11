import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, ClientsCreateModal, ClientsList } from '../../../components/web';
import { getAllCompanies, getMyCompanies, createCompany, searchCompany, createCompanyFavorite, deleteCompanyFavorite } from '../../../modules/companies';
import { getCurrentAccount } from '../../../modules/currentAccount';
import { getContactsByCompany } from '../../../modules/contacts';

const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';
@connect((state) => {
  let visibleCompanies = new Immutable.Map();
  if (state.companies.get('currentSearch') != '') {
    let current = state.companies.get('searches').get(state.companies.get('currentSearch'));
    visibleCompanies = state.companies.get('myCompanyIds').filter((x) => {
      return current.indexOf(x.get('id')) > -1;
    });
  } else {
    visibleCompanies = state.companies.get('myCompanyIds');
  }
  //filter hero contacts
  let heroContactIds = state.contacts.byCompanyId.get(HEROCOMPANYID);
  let heroContacts = null;
  if(heroContactIds){
    heroContacts = state.contacts.list.filter(x =>{
      return heroContactIds.indexOf(x.get('id')) > -1;
    });
  }

  return({
    type: state.router.location.query.type,
    companies: state.companies,
    visibleCompanies,
    currentAccount: state.currentAccount,
    heroContacts,
  });
}, { getAllCompanies, getMyCompanies, createCompany, searchCompany, pushState, getCurrentAccount, getContactsByCompany, createCompanyFavorite, deleteCompanyFavorite })
class ClientPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      createModalOpen: false,
    };
  }

  componentDidMount() {
    //this.props.getAllCompanies();
    this.props.getMyCompanies();
    this.props.getCurrentAccount();

    //get the hero compnay contacts
    this.props.getContactsByCompany('568f0ea89faa7b2c74c18080');
    // let self = this;
    // setTimeout(() => {
    //   self.props.getAllCompanies();
    // }, 500);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.companies.creating == false &&
      this.props.companies.creating == true &&
      nextProps.companies.creatingError =='') {
      this.closeModal();
    }
  }

  searchCompany(e) {
    this.props.searchCompany(e.target.value);
  }

  saveCompany(company) {
    this.props.createCompany(company);
  }

  openModal() {

    console.log('openModal');

    this.setState({
      createModalOpen: true,
    });
  }

  closeModal() {
    this.setState({
      createModalOpen: false,
    });
  }

  // click() {
  //   console.log('click');
  // }

  goBack() {
    this.props.history.goBack();
  }

  favoriteCompany(company) {
    this.props.createCompanyFavorite(company.get('id'));
  }

  unfavoriteCompany(company) {
    this.props.deleteCompanyFavorite(company.get('id'));
  }

  render() {

    let { visibleCompanies, heroContacts } = this.props;

    return (
      <div>
        <ClientsCreateModal heroContacts={heroContacts} onSubmit={this.saveCompany.bind(this)} closeModal={this.closeModal.bind(this)} open={this.state.createModalOpen} />
        <Header title={'Clients'} />
        <ClientsList
            clients={visibleCompanies}
            favoriteCompany={this.favoriteCompany.bind(this)}
            unfavoriteCompany={this.unfavoriteCompany.bind(this)}
        />

      </div>);
  }
}

export default ClientPage;
