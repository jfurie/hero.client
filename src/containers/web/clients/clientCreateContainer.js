import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {ClientsCreate} from '../../../components/web';
import { getContactsByCompany } from '../../../modules/contacts';
const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';
let getData = (state) => {
  //filter hero contacts
  let heroContactIds = state.contacts.byCompanyId.get(HEROCOMPANYID);
  let heroContacts = null;
  if(heroContactIds){
    heroContacts = state.contacts.list.filter(x =>{
      return heroContactIds.indexOf(x.get('id')) > -1;
    });
  }
  return {
    heroContacts
  };
};

@connect(getData,{getContactsByCompany})
export default class ClientCreateContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      company : new Immutable.Map({errors:new Immutable.Map()}),
      open:true
    }
  }
  componentDidMount() {
    //get the hero compnay contacts
    this.props.getContactsByCompany(HEROCOMPANYID);
    // let self = this;
    // setTimeout(() => {
    //   self.props.getAllCompanies();
    // }, 500);
  }

  _handleChange(company){
    this.setState({company});
  }
  _handleSave(company){
    this.setState({company});
  }
  _handleClose(){
    this.setState({open:false});
    this.props.onClose();
  }


  render(){
    return (
      <ClientsCreate closeModal={this._handleClose.bind(this)} heroContacts={this.props.heroContacts} company={this.state.company} onSubmit={this._handleSave.bind(this)} onCompanyChange={this._handleChange.bind(this)} open={this.props.open} inline={this.props.inline} {...this.props} />
    );
  }
}

ClientCreateContainer.propTypes = {
  inline: React.PropTypes.bool,
  open: React.PropTypes.bool,
  onClose:React.PropTypes.func
};
