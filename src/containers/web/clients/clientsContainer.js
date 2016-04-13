import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, ClientsCreateModal, ClientsList, ActionButtonItem, ActionButton } from '../../../components/web';
import { getCompanyDetails, getAllCompanies, getMyCompanies, createCompany, searchCompany, createCompanyFavorite, deleteCompanyFavorite } from '../../../modules/companies';
import { getCurrentAccount } from '../../../modules/currentAccount';
import { getContactsByCompany } from '../../../modules/contacts';
import { Styles } from 'material-ui';
import Config from '../../../utils/config';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
const HEROCOMPANYID = Config.get('heroCompanyId');


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

  let myCompanyIds = [];

  visibleCompanies.map(x => {
    myCompanyIds.push(x.get('id'));
  });

  //filter hero contacts
  let heroContactIds = state.contacts.get('byCompanyId').get(HEROCOMPANYID);
  let heroContacts = null;
  if(heroContactIds){
    heroContacts = state.contacts.get('list').filter(x =>{
      return heroContactIds.indexOf(x.get('id')) > -1;
    });
  }

  return({
    type: state.router.location.query.type,
    companies: state.companies,
    myCompanyIds,
    visibleCompanies,
    currentAccount: state.currentAccount,
    heroContacts,
  });
}, { getCompanyDetails, getAllCompanies, getMyCompanies, createCompany, searchCompany, pushState, getCurrentAccount, getContactsByCompany, createCompanyFavorite, deleteCompanyFavorite })
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
    this.props.getContactsByCompany(HEROCOMPANYID);
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
    onClientSearchOpen() {
    this.refs.actionButtons.close();
    this.props.history.pushState(null,`/clients/search`);
  }

  render() {

    let { visibleCompanies, heroContacts } = this.props;
    let actions = [
      <ActionButtonItem title={'Contact'} color={Styles.Colors.green500} itemTapped={this.onContactSearchOpen.bind(this)}>
        <ContentAdd />
      </ActionButtonItem>,
    ];
    return (
      <div>
        <ClientsCreateModal heroContacts={heroContacts} onSubmit={this.saveCompany.bind(this)} closeModal={this.closeModal.bind(this)} open={this.state.createModalOpen} />
        <Header title={'Clients'} />
        <ClientsList
            clients={visibleCompanies}
            favoriteCompany={this.favoriteCompany.bind(this)}
            unfavoriteCompany={this.unfavoriteCompany.bind(this)}
        />
        <ActionButton ref="actionButtons" actions={actions}/>

      </div>);
  }
}

export default ClientPage;
