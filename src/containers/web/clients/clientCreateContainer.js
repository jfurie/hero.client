import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {ClientsCreate} from '../../../components/web';
import { getContactsByCompany } from '../../../modules/contacts';
import { editCompany, createCompany, getOneCompany } from '../../../modules/companies';
const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';
let getData = (state, props) => {
  let company = null;
  if(props.params.companyId){
    company = state.companies.list.get(props.params.companyId);
  }
  //filter hero contacts
  let heroContactIds = state.contacts.byCompanyId.get(HEROCOMPANYID);
  let heroContacts = null;
  if(heroContactIds){
    heroContacts = state.contacts.list.filter(x =>{
      return heroContactIds.indexOf(x.get('id')) > -1;
    });
  }
  return {
    heroContacts,
    company
  };
};

@connect(getData,{getContactsByCompany, editCompany, createCompany, getOneCompany})
export default class ClientCreateContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      company : this.props.company || new Immutable.Map({errors:new Immutable.Map()}),
      open:true
    };
  }
  componentDidMount() {
    //get the hero compnay contacts
    this.props.getContactsByCompany(HEROCOMPANYID);
    //console.log('this.props.getOneCompany', this.props.companyId);
    if (this.props.params.companyId) {
      this.props.getOneCompany(this.props.params.companyId);
    }
    // let self = this;
    // setTimeout(() => {
    //   self.props.getAllCompanies();
    // }, 500);

  }
  componentWillReceiveProps(newProps){
    this.setState({company: newProps.company});
    
    if( newProps.company && newProps.company.get('saving') == false
    && this.props.company && this.props.company.get('saving') == true
    && !newProps.company.get('savingError')){
      if(this.props.onSave){
        this.props.onSave(newProps.company.get('id'));
      } else {
        let self = this;
        let id =newProps.company.get('id');
        setTimeout(function () {
          self.props.history.replaceState(null, `/clients/${id}`);
        }, 500);
      }

    }

    if(newProps.params.companyId != this.props.params.companyId && newProps.params.companyId.indexOf('tmp')<=-1 ){
      this.props.getOneCompany(newProps.params.companyId);
    }
  }
  _handleChange(company){
    this.setState({company});
  }
  _handleSave(company){
    this.setState({company});
    if(company.get('id') && company.get('id').indexOf('tmp') <= -1){
      this.props.editCompany(company);
    } else {
      this.props.createCompany(company);
    }

  }
  _handleClose(){
    this.setState({open:false});
    if(this.props.onClose){
      this.props.onClose();
    } else {
      this.props.history.goBack();
    }

  }


  render(){
    return (
      <ClientsCreate
        {...this.props}
        closeModal={this._handleClose.bind(this)}
        heroContacts={this.props.heroContacts}
        company={this.state.company}
        onSubmit={this._handleSave.bind(this)} o
        onCompanyChange={this._handleChange.bind(this)}
        open={true}
        inline={false}  />
    );
  }
}

ClientCreateContainer.propTypes = {
  inline: React.PropTypes.bool,
  open: React.PropTypes.bool,
  onClose:React.PropTypes.func,
  onSave:React.PropTypes.func,
};

// function guid() {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000)
//       .toString(16)
//       .substring(1);
//   }
//   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//     s4() + '-' + s4() + s4() + s4();
// }
//
// ClientCreateContainer.defaultProps = {
//     companyId: 'tmp_'+ guid()
// }
