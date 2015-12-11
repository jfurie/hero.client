import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Header, CustomTabsSwipe, LocationCard, ContactsList, ClientContactsCreateModal, CompanyJobsList, ContactDetailsModal, NotesCreateModal, JobDetailsModal } from '../../../components/web';
import { getOneCompany } from '../../../modules/companies';
import { getOneLocation } from '../../../modules/locations';
import { getAllJobs } from '../../../modules/jobs';
import { getAllContacts, getContactsByCompany } from '../../../modules/contacts';
import { pushState } from 'redux-router';

import { List, ListItem, ListDivider, FontIcon, IconMenu, IconButton, Avatar, Card, CardHeader, CardText, CardActions, FlatButton } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');

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
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

@connect((state, props) => (
getData(state, props.params.id)),
{getOneCompany, getOneLocation, getAllContacts, getContactsByCompany, getAllJobs, pushState})
class ClientDetailsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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

  }

  saveClient() {
    console.log('cool!');
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
    this.setState({
      detailsJob:job,
      openJob:true
    });
  }
  closeJobModal(){
    this.setState({
      detailsJob:null,
      openJob:false
    });
  }

  createNoteModalOpen() {
    this.refs.notesCreateModal.show();
  }

  render() {

    let {company, location, contacts, jobs} = this.props;

    if (company) {

      let website = company.get('website');
      let twitter = company.get('twitterHandle');
      let indeedId = company.get('indeedId');
      let heroContact = '/img/rameet.jpg';

      return (
        <div>
          <JobDetailsModal closeModal={this.closeJobModal.bind(this)} job={this.state.detailsJob} contacts={contacts} open={this.state.openJob}></JobDetailsModal>
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

          <CustomTabsSwipe tabs={['Details', 'Jobs', 'Contacts', 'Notes']}>
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
          </CustomTabsSwipe>
        </div>
      );
    } else {
      return (null);
    }
  }
}

export default ClientDetailsPage;
