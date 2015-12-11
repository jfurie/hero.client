import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, ClientsCreateModal, ClientsList } from '../../../components/web';
import {getAllCompanies, createCompany, searchCompany} from '../../../modules/companies';
import {IconMenu, IconButton } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');

@connect(state =>
{
  let visibleCompanies = new Immutable.Map();
  if(state.companies.currentSearch != ''){
    var current =  state.companies.searches.get(state.companies.currentSearch);
    visibleCompanies = state.companies.list.filter(x=>{
      return current.indexOf(x.get('id')) > -1;
    });
  } else{
    visibleCompanies = state.companies.list;
  }
  return({
    type: state.router.location.query.type,
    companies: state.companies,
    visibleCompanies,
  });}
,{getAllCompanies, createCompany, searchCompany, pushState})
class ClientPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      createModalOpen:false,
    };
  }

  componentDidMount() {
    let self = this;
    setTimeout(() => {
      self.props.getAllCompanies();
    }, 500);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.companies.creating == false && this.props.companies.creating == true && nextProps.companies.creatingError ==''){
      this.closeModal();
    }
  }

  searchCompany(e){
    this.props.searchCompany(e.target.value);
  }

  saveCompany(company){
    this.props.createCompany(company);
  }

  openModal(){
    this.setState({
      createModalOpen: true,
    });
  }

  closeModal(){
    this.setState({
      createModalOpen: false,
    });
  }

  click() {
    console.log('click');
  }

  // _showClientDetails(id) {
  //   this.props.pushState(null, `/clients/${id}`);
  // }

  render() {
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let {visibleCompanies} = this.props;

    let listSubheader = visibleCompanies.count() + ' Clients';
    return (
      <div>
        <ClientsCreateModal onSubmit={this.saveCompany.bind(this)} closeModal={this.closeModal.bind(this)} open={this.state.createModalOpen}></ClientsCreateModal>
        <Header iconRight={
            <IconMenu iconButtonElement={
              <IconButton  iconClassName="material-icons">more_vert</IconButton>
            }>
              <MenuItem index={0} onTouchTap={this.openModal.bind(this)} primaryText="Add" />
            </IconMenu>
        } title='Clients' />
        <ClientsList clients={visibleCompanies} />

      </div>);
  }
}

export default ClientPage;
