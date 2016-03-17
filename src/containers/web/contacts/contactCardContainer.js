import React from 'react';
import { connect } from 'react-redux';
import { ContactListItem } from '../../../components/web';
@connect((state, props) => {
  return {
    contact: state.contacts.getIn('list',props.contactId)
  };
},{

})
export default class ContactCardContainer extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){

  }
  componentWillReceiveProps(){

  }
  render(){
    <ContactListItem
        {...this.props}
    />
  }
}
