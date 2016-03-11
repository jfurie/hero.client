import React from 'react';
import { connect } from 'react-redux';
import { getCategoriesIfNeeded } from '../../../modules/categories';
import { getOneContact, setCategoryLocal, setExperience, setPrimary } from '../../../modules/contacts';
import { ContactEditCategories } from '../../../components/web';
function getData(state, props) {
  return {
    categories: state.categories.list,
    contact: state.contacts.get('list').get(props.params.contactId),
    contactCategories: state.contactCategories.byContactId.get(props.params.contactId),
  };
}
@connect(getData, {getCategoriesIfNeeded, getOneContact,setCategoryLocal, setExperience, setPrimary})
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
