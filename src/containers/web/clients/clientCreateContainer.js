import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {ClientsCreate} from '../../../components/web';
import { getContactsByCompany } from '../../../modules/contacts';
import { editCompany, createCompany, getMyCompanies, getOneCompany, updateCompanyImage } from '../../../modules/companies';
import Config from '../../../utils/config';

const HEROCOMPANYID = Config.get('heroCompanyId');

let getData = (state, props) => {
  let company = null;
  if(props.params.companyId){
    company = state.companies.get('list').get(props.params.companyId);
  }
  //filter hero contacts
  let heroContactIds = state.contacts.get('byCompanyId').get(HEROCOMPANYID);
  let heroContacts = null;
  if(heroContactIds){
    heroContacts = state.contacts.get('list').filter(x =>{
      return heroContactIds.indexOf(x.get('id')) > -1;
    });
  }

  let companyImage = null;
  if(company){
    let imageId = company.get('imageId');
    if (imageId) {
      companyImage = state.resources.list.get(imageId);
    }
  }

  return {
    companyImage,
    heroContacts,
    company,
  };
};

@connect(getData,{getContactsByCompany, editCompany, createCompany, getOneCompany, getMyCompanies, updateCompanyImage})
export default class ClientCreateContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      company : this.props.company || new Immutable.Map({errors:new Immutable.Map()}),
      open: true,
    };
  }

  componentDidMount() {
    this.props.getContactsByCompany(HEROCOMPANYID);
    if(this.props.params.companyId && this.props.params.companyId.indexOf('tmp')<=-1 ){
      this.props.getOneCompany(this.props.params.companyId);
    }
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
        setTimeout(function () {
          if(self.props.location.query.returnUrl){
            self.props.history.replaceState(null, self.props.location.query.returnUrl);
          } else{
            let id =newProps.company.get('newId');
            self.props.history.replaceState(null, `/clients/${id}`);
          }
        }, 500);

        this.props.getMyCompanies();
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

  onCompanyCreateImageChange(imageArray){
    this.props.updateCompanyImage(this.props.params.companyId,imageArray);
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
          onImageChange={this.onCompanyCreateImageChange.bind(this)}
          open
          inline
      />
    );
  }
}

ClientCreateContainer.propTypes = {
  inline: React.PropTypes.bool,
  onClose:React.PropTypes.func,
  onSave:React.PropTypes.func,
  open: React.PropTypes.bool,
};
