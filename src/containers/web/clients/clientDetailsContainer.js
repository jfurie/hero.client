import React from 'react';
import { connect } from 'react-redux';
import { Header,ClientContactsCreateModal } from '../../../components/web';
import { getOneCompany } from '../../../modules/companies';
import { Styles, Tabs, Tab, List, ListItem, ListDivider, FontIcon, IconMenu, IconButton } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
import SwipeableViews from 'react-swipeable-views';

function getCompany(companies, id) {
  return ((companies.list.size > 0) ? (companies.list.get(id)) : (null));
}

const style = {
  tabs: {
    backgroundColor: Styles.Colors.grey900,
  },
};

@connect((state, props) => ({
  type: state.router.location.query.type,
  company: getCompany(state.companies, props.params.id),
}), {getOneCompany})
class ClientDetailsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      createModalOpen:false
    };
  }

  componentDidMount() {
    this.props.getOneCompany(this.props.params.id);
  }

  _handleChangeIndex(index) {
    this.setState({
      slideIndex: index,
    });
  }

  _handleChangeTabs(value) {
    this.setState({
      slideIndex: parseInt(value, 10),
    });
  }
  createContactModalOpen(){
    this.setState({
      createContactModalOpen:true
    });
  }
  createContactModalClose(){
    this.setState({
      createContactModalOpen:false
    });
  }
  saveContact(){
    console.log('save!');
  }

  render() {

    let {company} = this.props;

    if (company) {
      return (
        <div>
          <ClientContactsCreateModal onSubmit={this.saveContact.bind(this)} closeModal={this.createContactModalClose.bind(this)} open={this.state.createContactModalOpen}></ClientContactsCreateModal>
          <Header iconRight={
            <IconMenu iconButtonElement={
              <IconButton  iconClassName="material-icons">more_vert</IconButton>
            }>
              <MenuItem index={0} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Contact" />
            </IconMenu>
          } title={company.get('name')} />
          <Tabs tabItemContainerStyle={style.tabs} onChange={this._handleChangeTabs.bind(this)} value={this.state.slideIndex + ''}>
            <Tab label="Details" value="0"></Tab>
            <Tab label="Location" value="1"></Tab>
          </Tabs>
          <SwipeableViews index={this.state.slideIndex} onChangeIndex={this._handleChangeIndex.bind(this)}>
            <List>
              <div>
                <ListItem
                  leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                  primaryText={company.get('website')}
                  secondaryText={<p>website</p>}
                  secondaryTextLines={1}
                />
                <ListDivider inset />
                <ListItem
                  leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                  primaryText={`@${company.get('twitterHandle')}`}
                  secondaryText={<p>twitter</p>}
                  secondaryTextLines={1}
                />
                <ListDivider inset />
                <ListItem
                  leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                  primaryText={company.get('indeedId')}
                  secondaryText={<p>indeed Id</p>}
                  secondaryTextLines={1}
                />
              </div>
            </List>
            <div>
              slide n°2
            </div>
          </SwipeableViews>
        </div>
      );
    } else {
      return (null);
    }
  }
}

export default ClientDetailsPage;
