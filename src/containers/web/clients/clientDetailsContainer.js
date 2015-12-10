import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Header, LocationCard, ContactsList, ClientContactsCreateModal, CompanyJobsList, ContactDetailsModal, NotesCreateModal } from '../../../components/web';
import { getOneCompany } from '../../../modules/companies';
import { getOneLocation } from '../../../modules/locations';
import { getAllJobs } from '../../../modules/jobs';
import { getAllContacts, getContactsByCompany } from '../../../modules/contacts';
import { disableSwipeToOpen, enableSwipeToOpen } from '../../../modules/leftNav';
import { pushState } from 'redux-router';
import ReactSwipe from 'react-swipe';

import { Styles, Tabs, Tab, List, ListItem, ListDivider, FontIcon, IconMenu, IconButton, Avatar, Card, CardHeader, CardText, CardActions, FlatButton } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
//import SwipeableViews from 'react-swipeable-views';

function getData(state, id) {
  let company = ((state.companies.list.size > 0) ? (state.companies.list.get(id)) : (null));
  let location = null;
  let contacts = state.contacts; // TMP

  if (company && company.get('location')) {
    location = ((state.locations.list.size > 0) ? (state.locations.list.get(company.get('location'))) : (null));
  }

  let newContacts = {
    ...contacts,
    list: new Immutable.Map(),
  };

  let contactsByCompanyListIds = contacts.byCompanyId.get(id);
  if (contactsByCompanyListIds) {
    newContacts.list = contacts.list.filter(x => {
      return contactsByCompanyListIds.indexOf(x.get('id')) > -1;
    });
  }

  return {
    company,
    location,
    contacts: newContacts,
    jobs: state.jobs,
  };
}

const style = {
  tabs: {
    backgroundColor: Styles.Colors.grey900,
  },
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

@connect((state, props) => (
  getData(state, props.params.id)),
  {getOneCompany, getOneLocation, getAllContacts, disableSwipeToOpen, enableSwipeToOpen, getContactsByCompany, getAllJobs, pushState})
class ClientDetailsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      createModalOpen: false,
      contactDetailsModalOpen: false,
    };
  }

  componentDidMount() {
    this.props.getOneCompany(this.props.params.id);
    this.props.getContactsByCompany(this.props.params.id);
    this.props.getAllJobs();
  }

  componentWillUpdate() {
    // if (!this.props.location && !nextProps.location && nextProps.company && nextProps.company.get('location')) {
    //   //this.props.getOneLocation(nextProps.company.get('location'));
    // }
  }

  componentWillUnmount() {
    this.props.enableSwipeToOpen();
  }

  saveClient() {
    console.log('cool!');
  }

  _handleChangeIndex(index) {

    if (this.state.slideIndex !== index) {
      this.setState({
        slideIndex: index,
      });

      //console.log('_handleChangeIndex');

      if (index === 1) {
        this.props.disableSwipeToOpen();
      }

      if (index === 0) {
        this.props.enableSwipeToOpen();
      }
    }
  }

  _handleChangeTabs(value) {

    let index = ~~(value);
    //this.refs.swipeableViews.slide(index);

    //console.log(this.refs.swipeableViews);
    //
    // if (index > 0) {
    //   this.props.disableSwipeToOpen();
    // } else {
    //   this.props.enableSwipeToOpen();
    // }

    if (this.state.index !== index) {
      this.setState({
        slideIndex: index,
      });
      //console.log('_handleChangeTabs');

      if (index === 1) {
        this.props.disableSwipeToOpen();
      }

      if (index === 0) {
        this.props.enableSwipeToOpen();
      }
    }
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

  contactDetailsModalOpen(contact) {
    this.setState({
      contactDetailsModalOpen: true,
      detailsContact: contact,
    });
  }

  contactDetailsModalClose() {
    this.setState({
      contactDetailsModalOpen: false,
      detailsContact: null,
    });
  }
  _handleJobClick(job){
    this.props.pushState(null,'/jobs/1a');
  }

  createNoteModalOpen() {
    this.refs.notesCreateModal.show();
  }

  render() {

    //console.log('render!');

    let {company, location, contacts, jobs} = this.props;

    if (company) {

      let website = company.get('website');
      let twitter = company.get('twitterHandle');
      let indeedId = company.get('indeedId');
      let heroContact = '/img/rameet.jpg';

      return (
        <div>
          <ClientContactsCreateModal onSubmit={this.saveClient.bind(this)} closeModal={this.createContactModalClose.bind(this)} open={this.state.createContactModalOpen}></ClientContactsCreateModal>
          <ContactDetailsModal open={this.state.contactDetailsModalOpen} closeModal={this.contactDetailsModalClose.bind(this)} contact={this.state.detailsContact}/>
          <NotesCreateModal ref='notesCreateModal' />

          <Header iconRight={
            <IconMenu iconButtonElement={
              <IconButton  iconClassName="material-icons">more_vert</IconButton>
            }>
              <MenuItem index={0} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Contact" />
              <MenuItem index={0} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Job" />
              <MenuItem index={0} onTouchTap={this.createNoteModalOpen.bind(this)} primaryText="Add Note" />
            </IconMenu>
          } title={company.get('name')} />

          <Tabs tabItemContainerStyle={style.tabs} onChange={this._handleChangeTabs.bind(this)} value={this.state.slideIndex + ''}>
            <Tab label="Details" value="0"></Tab>
            <Tab label="Jobs" value="1"></Tab>
            <Tab label="Contacts" value="2"></Tab>
            <Tab label="Notes" value="3"></Tab>
          </Tabs>

          {/* <SwipeableViews index={this.state.slideIndex} onChangeIndex={this._handleChangeIndex.bind(this)}>*/}
          <ReactSwipe speed={250} slideToIndex={this.state.slideIndex} transitionEnd={this._handleChangeIndex.bind(this)} ref="swipeableViews" continuous={false}>
            <div style={style.slide}>
              <List>
                <div>

                  {(website) ? (
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                      primaryText={website}
                      secondaryText={<p>website</p>}
                      secondaryTextLines={1}
                    />
                  ) : (null)}

                  {(twitter) ? (
                    <div>
                      <ListDivider inset />
                      <ListItem
                        leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                        primaryText={`@${twitter}`}
                        secondaryText={<p>twitter</p>}
                        secondaryTextLines={1}
                      />
                    </div>
                  ) : (null)}

                  {(indeedId) ? (
                    <div>
                      <ListDivider inset />
                      <ListItem
                        leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                        primaryText={`@${indeedId}`}
                        secondaryText={<p>indeed Id</p>}
                        secondaryTextLines={1}
                      />
                    </div>
                  ) : (null)}

                </div>
              </List>
              <div id="innerView">
                {(company.get('location')) ? (
                    <LocationCard style={{height: '200px'}} location={location} />
                ) : (<p>No location provided.</p>)}
              </div>
              <List subheader="Your HERO talent advocate">
                {(heroContact) ? (
                  <ListItem
                    leftAvatar={<Avatar src={heroContact} />}
                    primaryText={'Rameet Singh'}
                    secondaryText={<p>Hero Talent Advocate</p>}
                    secondaryTextLines={1}
                  />
                ) : (null)}
                </List>
            </div>
            <div style={style.slide}>
              <List subheader={`${jobs.list.count()} Jobs`}>
                <CompanyJobsList company={company} onJobClick={this._handleJobClick.bind(this)} jobs={jobs.list}/>
              </List>
            </div>
            <div style={style.slide}>
              <ContactsList contacts={contacts.list} onOpenContactDetails={this.contactDetailsModalOpen.bind(this)}/>
            </div>
            <div style={style.slide}>
              <Card initiallyExpanded>
                <CardHeader
                  title="Rameet Singh"
                  subtitle="Private | 59 mins ago"
                  avatar={<Avatar src={heroContact} />}>
                </CardHeader>
                <CardText expandable>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                  Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                </CardText>
                <CardActions expandable>
                  <FlatButton label="Edit"/>
                  <FlatButton label="Delete"/>
                </CardActions>
              </Card>
              <Card initiallyExpanded>
                <CardHeader
                  title="Rameet Singh"
                  subtitle="Private | 60 mins ago"
                  avatar={<Avatar src={heroContact} />}>
                </CardHeader>
                <CardText expandable>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                  Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                </CardText>
                <CardActions expandable>
                  <FlatButton label="Edit"/>
                  <FlatButton label="Delete"/>
                </CardActions>
              </Card>
            </div>
          </ReactSwipe>
            {/* </SwipeableViews>*/}
        </div>
      );
    } else {
      return (null);
    }
  }
}

export default ClientDetailsPage;
