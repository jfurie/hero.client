import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, ClientsCreateModal, CompanyAvatar } from '../../../components/web';
import {getAllCompanies, createCompany, searchCompany} from '../../../modules/companies';
import {List, ListItem, ListDivider, Toolbar, ToolbarGroup, TextField, FontIcon, IconMenu, IconButton } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
const Colors = require('material-ui/lib/styles/colors');
var Infinite = require('react-infinite');
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
  }
  state = {createModalOpen:false};
  click(){
    alert('hi');
  }
  searchCompany(e){
    this.props.searchCompany(e.target.value);
  }
  saveCompany(company){
    this.props.createCompany(company);
  }
  openModal(){
    this.setState({
      createModalOpen:true
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.companies.creating == false && this.props.companies.creating == true && nextProps.companies.creatingError ==''){
      this.closeModal();
    }
  }
  componentDidMount() {
    var self = this;
    setTimeout(()=>{
      self.props.getAllCompanies();
    },500);
  }
  closeModal(){
    this.setState({
      createModalOpen:false
    });
  }

  _showClientDetails(id) {
    this.props.pushState(null, `/clients/${id}`);
  }

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
          <Toolbar>
            <ToolbarGroup key={0} float="left">
              <TextField onChange={this.searchCompany.bind(this)}  style={{float:'left', marginTop:'4px'}}
                hintText="Search"
                type="search"
                />


              <FontIcon onTouchTap={this.click.bind(this)} className="material-icons" >search</FontIcon>
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right">
            </ToolbarGroup>
          </Toolbar>
          <List style={{backgroundColor:'transparant'}} subheader={listSubheader}>
            <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
              {visibleCompanies.map((company) => {
                //let imageUrl = 'https://logo.clearbit.com/' + company.get('website');
                return (
                  <div>
                    <ListItem
                      leftAvatar={<CompanyAvatar url={company.get('website')} />}
                      primaryText={company.get('name')}
                      secondaryText={<p>3 Jobs | 20 Candidates</p>}
                      secondaryTextLines={2}
                      onTouchTap={this._showClientDetails.bind(this, company.get('id'))} />
                    <ListDivider inset={true} />
                  </div>
                );
              })}
            </Infinite>
        </List>
      </div>);
  }
}

export default ClientPage;
