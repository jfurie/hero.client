import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import {
  Header, CustomTabsSwipe, LocationCard, ContactsList, ClientContactsCreateModal,
  CompanyJobsList, ContactDetailsModal, NotesCreateModal, JobCreateModal, JobDetailsModal,
  ClientsEditModal, Gravatar,
} from '../../../components/web';

import { getOneCompany } from '../../../modules/companies';
import { getOneLocation } from '../../../modules/locations';
import { getJobsByCompany, updateJobLocal, updateJobImageLocal, saveLocalJob, replaceJobLocal } from '../../../modules/jobs/index';
import { getAllContacts, getContactsByCompany } from '../../../modules/contacts';
//import { getCurrentAccount } from '../../../modules/currentAccount';

import {
  List, ListItem, Divider, FontIcon, IconMenu, IconButton,
  Card, CardHeader, CardText, CardActions, FlatButton, Avatar,
} from 'material-ui';

import MenuItem from 'material-ui/lib/menus/menu-item';

function getData(state, props) {
  let id = props.params.id;
  let company = ((state.companies.list.size > 0) ? (state.companies.list.get(id)) : (null));
  let location = null;
  let contacts = state.contacts; // TMP
  let localJobResource = null;
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

  let imageId = state.jobs.localJob.get('imageId');
  if (imageId) {
    localJobResource = state.resources.list.get(imageId);
  }

  return {
    company,
    location,
    contacts: newContacts,
    jobs: state.jobs,
    localJob: state.jobs.localJob,
    localJobResource,
    //currentAccount: state.currentAccount,
  };
}

const style = {
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

@connect((state, props) => (
getData(state, props)), {
  getOneCompany, getOneLocation, getAllContacts, getContactsByCompany,
  getJobsByCompany, pushState, updateJobLocal, updateJobImageLocal,
  saveLocalJob, replaceJobLocal,
})
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
    this.props.getJobsByCompany(this.props.params.id);
    //this.props.getCurrentAccount();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.localJob.get('success')){
      this.refs.jobCreateModal.closeModal();
      this.props.replaceJobLocal({companyId:this.props.params.id});
    }
  }


  componentWillUpdate() {
  }

  // saveClient() {
  //   console.log('cool!');
  // }

  createContactModalOpen(){
    this.refs.clientContactsCreateModal.getWrappedInstance().show();
  }

  editClientModalOpen() {
    this.refs.clientEditModal.getWrappedInstance().show();
  }

  // editClientModalClose() {
  //   this.setState({
  //     detailsJob:null,
  //     openJob:false
  //   });
  // }

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

  createJobModalOpen() {
    this.props.replaceJobLocal({companyId:this.props.params.id});
    this.refs.jobCreateModal.show();
  }
  onJobCreateChange (job){
    this.props.updateJobLocal(job);
  }
  onJobCreateImageChange(imageArray){
    this.props.updateJobImageLocal(imageArray);
  }
  render() {

    let {company, location, contacts, jobs} = this.props;

    if (company) {

      let website = company.get('website');
      let twitter = company.get('twitterHandle');
      let facebook = company.get('facebookHandle');
      let heroContact = '/img/rameet.jpg';

      return (
        <div>

          <JobDetailsModal closeModal={this.closeJobModal.bind(this)} job={this.state.detailsJob} seachCandidates={contacts.list} contacts={contacts} open={this.state.openJob}></JobDetailsModal>

          <ClientContactsCreateModal ref="clientContactsCreateModal" companyId={this.props.params.id}/>
          <ClientsEditModal ref="clientEditModal" company={company}/>

          <ContactDetailsModal open={this.state.contactDetailsModalOpen} closeModal={this.contactDetailsModalClose.bind(this)} contact={this.state.detailsContact}/>
          <NotesCreateModal ref='notesCreateModal' />
          <JobCreateModal contacts={contacts} saveJob={this.props.saveLocalJob} jobImage={this.props.localJobResource} onImageChange={this.onJobCreateImageChange.bind(this)} onJobChange={this.onJobCreateChange.bind(this)} job={this.props.localJob} ref='jobCreateModal'/>

          <Header iconRight={
            <IconMenu iconButtonElement={
              <IconButton  iconClassName="material-icons">more_vert</IconButton>
            }>
              <MenuItem index={0} onTouchTap={this.editClientModalOpen.bind(this)} primaryText="Edit Client" />
              <MenuItem index={0} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Contact" />
              <MenuItem index={0} onTouchTap={this.createJobModalOpen.bind(this)} primaryText="Add Job" />
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
                      <Divider inset />
                      <ListItem
                        leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                        primaryText={`@${twitter}`}
                        secondaryText={<p>twitter</p>}
                        secondaryTextLines={1}
                      />
                    </div>
                  ) : (null)}

                  {(facebook) ? (
                    <div>
                      <Divider inset />
                      <ListItem
                        leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                        primaryText={`facebook.com/${facebook}`}
                        secondaryText={<p>facebook</p>}
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

              {(company.get('clientAdvocate')) ? (
                <List subheader={`${company.get('name')}'s talents advocate`} >
                  <ListItem
                    leftAvatar={<Gravatar email={company.get('clientAdvocate').get('email')} />}
                    primaryText={company.get('clientAdvocate').get('email')}
                    secondaryText={<p>Talents Advocate</p>}
                    secondaryTextLines={1}
                  />
                </List>
              ) : (null)}


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
