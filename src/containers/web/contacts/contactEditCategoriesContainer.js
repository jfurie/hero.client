import React from 'react';
import { connect } from 'react-redux';
import { getCategoriesIfNeeded } from '../../../modules/categories';
import { getOneContact, setCategoryLocal, setExperience, setPrimary } from '../../../modules/contacts';
import { getContactCategoriesByContact } from '../../../modules/contactCategories';
import { ContactEditCategories } from '../../../components/web';
function getData(state, props) {
  return {
    categories: state.categories.list,
    contact: state.contacts.list.get(props.params.contactId),
    contactCategories: state.contactCategories.byContactId.get(props.params.contactId),
  };
}
function setContactCategories(){
  if(this.props.categories){
    this.props.categories.map(function(category){
      let currentContactCategory = null;
      if(this.props.contactCategories && this.props.contactCategories.get(this.props.params.contactId)){
        currentContactCategory = this.props.contactCategories.get(this.props.params.contactId).get(category.get('id'));
      }
      if(!currentContactCategory){
        this.props.setCategoryLocal(contactId,{
          categoryId:category.id,
          experience:0,
          primary:true,
          frameworkInclude: category.get('frameworkArr').toArray()
        });
      }
    });
  }
}
@connect(getData, {getCategoriesIfNeeded, getOneContact,getContactCategoriesByContact,setCategoryLocal, setExperience, setPrimary})
export default class ContactEditCategoriesContainer extends React.Component {

  constructor(props){
    super(props);
  }

  setContactCategories(contactId, props){
    if(props.categories && props.contact){
      props.categories.map(function(category){
        let currentContactCategory = null;
        if(props.contact && props.contact.get('_contactCategories')){
          currentContactCategory = props.contact
          .get('_contactCategories')
          .find(x=>{
            return x.get('categoryId') == category.get('id')
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
