import React from 'react';
import { connect } from 'react-redux';
import { ContactListItem } from '../../../components/web';
import getContactDataFromState from '../../../dataHelpers/contact';
@connect((state, props) => {
  return {
    contact: getContactDataFromState(state,props.contactId)
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
    return (<ContactListItem
        {...this.props}
    />);
  }
}
