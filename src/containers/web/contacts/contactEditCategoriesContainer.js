import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { getCategoriesIfNeeded } from '../../../modules/categories';
import { getOneContact, setCategoryLocal, setExperience, setPrimary, setFrameworks } from '../../../modules/contacts';
import { ContactEditCategories } from '../../../components/web';
function getData(state, props) {
  let contact = state.contacts.get('list').get(props.params.contactId);
  let skills = Immutable.List();
  if(contact && contact.get('_categoryLinks')){
    skills = contact.get('_categoryLinks');
  }
  return {
    categories: state.categories.list,
    item: state.contacts.get('list').get(props.params.contactId),
    skills,
  };
}
@connect(getData, {getCategoriesIfNeeded, getOneContact,setCategoryLocal, setExperience, setPrimary, setFrameworks})
export default class ContactEditCategoriesContainer extends React.Component {

  constructor(props){
    super(props);
  }

  setContactCategories(contactId, props){
    if(props.categories && props.item){
      props.categories.map(function(category){
        let currentContactCategory = null;
        if(props.item && props.item.get('_categoryLinks')){
          currentContactCategory = props.item
          .get('_categoryLinks')
          .find(x=>{
            return x.get('categoryId') == category.get('id');
          });
        }
        if(!currentContactCategory){
          props.setCategoryLocal(
            contactId,
            {
              categoryId:category.get('id'),
              contactId,
              experience:0,
              primary:true,
              frameworkInclude: category.get('frameworkArr') && category.get('frameworkArr').toArray()
            });
        }
      });
    }
  }

  componentDidMount(){
    this.props.getCategoriesIfNeeded();
    this.props.getOneContact(this.props.params.contactId);
    //this.props.getContactCategoriesByContact(this.props.params.contactId);
    this.setContactCategories(this.props.params.contactId,this.props);

  }
  componentWillReceiveProps(newProps){
    if(newProps.params.contactId != this.props.params.contactId){
      this.props.getOneContact(newProps.params.contactId);
      //this.props.getContactCategoriesByContact(newProps.params.contactId);

    }
    this.setContactCategories(newProps.params.contactId,newProps);
  }
  render(){
    return (
    <div>
      <ContactEditCategories
          {...this.props}
      />
    </div>
    );
  }

}
