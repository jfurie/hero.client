import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, ClientsCreateModal, ClientsList } from '../../../components/web';
import { getAllCompanies, createCompany, searchCompany } from '../../../modules/companies';
import { getCurrentAccount } from '../../../modules/currentAccount';

import { IconButton } from 'material-ui';

@connect((state) => {
  let visibleCompanies = new Immutable.Map();
  if (state.companies.currentSearch != '') {
    let current = state.companies.searches.get(state.companies.currentSearch);
    visibleCompanies = state.companies.list.filter((x) => {
      return current.indexOf(x.get('id')) > -1;
    });
  } else {
    visibleCompanies = state.companies.list;
  }
  return({
    type: state.router.location.query.type,
    companies: state.companies,
    visibleCompanies,
    currentAccount: state.currentAccount,
  });
}, { getAllCompanies, createCompany, searchCompany, pushState, getCurrentAccount })
class ClientPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      createModalOpen: false,
    };
  }

  componentDidMount() {
    this.props.getAllCompanies();
    this.props.getCurrentAccount();
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

  render() {

    let { visibleCompanies, currentAccount } = this.props;

    return (
      <div>
        <ClientsCreateModal users={currentAccount.usersList} onSubmit={this.saveCompany.bind(this)} closeModal={this.closeModal.bind(this)} open={this.state.createModalOpen} />
        <Header
            iconRight={<IconButton onTouchTap={this.openModal.bind(this)}
            iconClassName='material-icons'>add</IconButton>}
            title={'Clients'}
        />
        <ClientsList clients={visibleCompanies} />

      </div>);
  }
}

export default ClientPage;
