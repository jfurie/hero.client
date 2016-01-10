import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import {
  Header, CustomTabsSwipe, LocationCard, ContactsList, ClientContactsCreateModal,
  CompanyJobsList, ContactDetailsModal, NotesCreateModal, JobCreateModal,
  JobDetailsModal, ClientsEditModal, CompanyAvatar, Gravatar
} from '../../../components/web';

import { getOneCompany } from '../../../modules/companies/index';
import { getOneLocation } from '../../../modules/locations';
import { getImageByJobId } from '../../../modules/resources';
import { getJobsByCompany, updateJobLocal, updateJobImageLocal, saveLocalJob, replaceJobLocal, getOneJob } from '../../../modules/jobs/index';
import { getAllContacts, getContactsByCompany } from '../../../modules/contacts';
import { getAllCandidates } from '../../../modules/candidates';
import { invite } from '../../../modules/users';
import getCompanyDataFromState from '../../../dataHelpers/company';
import getJobDataFromState from '../../../dataHelpers/job';

import {
  List, ListItem, Divider, FontIcon, IconMenu, IconButton,
  Avatar, Card, CardHeader, CardText, CardActions, FlatButton,
} from 'material-ui';
const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';
import MenuItem from 'material-ui/lib/menus/menu-item';

function getData(state, props) {

  let companyId = props.params.id;
  let jobId = props.params.jobId;
  let tab = props.params.tab;
  let tabId = 0;
  let localJobResource = null;


  let heroContactIds = state.contacts.byCompanyId.get(HEROCOMPANYID);
  let heroContacts = null;
  if(heroContactIds){
    heroContacts = state.contacts.list.filter(x =>{
      return heroContactIds.indexOf(x.get('id')) > -1;
    });
  }

  switch (tab) {
  case 'jobs':
    tabId = 1;
    break;
  default:
    tabId = 0;
  }


  var imageId = state.jobs.localJob.get('imageId');
  if(imageId){
    localJobResource = state.resources.list.get(imageId);
  }

  return {
    tabId,
    company: getCompanyDataFromState(state, companyId),
    job: getJobDataFromState(state, jobId),
    localJob: state.jobs.localJob,
    localJobResource,
  };
}

const style = {
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

@connect((state, props) => (
getData(state, props)),
{ getOneCompany, getOneLocation, getAllContacts, getContactsByCompany, getJobsByCompany, pushState, updateJobLocal, updateJobImageLocal, saveLocalJob, replaceJobLocal, getOneJob, getImageByJobId, invite, getAllCandidates })
class ClientDetailsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      createModalOpen: false,
      contactDetailsModalOpen: false,
      openJob: false,
    };
  }

  componentDidMount() {

    let self = this;

    setTimeout(() => {
      self.props.getOneCompany(self.props.params.id);
      self.props.getContactsByCompany(self.props.params.id);
      self.props.getJobsByCompany(self.props.params.id);

      if (self.props.params.jobId) {
        self.props.getOneJob(self.props.params.jobId);
        self.props.getImageByJobId(self.props.params.jobId);
        self.props.getAllCandidates(self.props.params.jobId);
      }
      self.props.getContactsByCompany('568f0ea89faa7b2c74c18080');
    }, 500);
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.localJob.get('success')) {
      this.refs.jobCreateModal.closeModal();
      this.props.replaceJobLocal({companyId:this.props.params.id});
    }

    if (nextProps.params.jobId && nextProps.params.jobId != this.props.params.jobId) {
      this.props.getOneJob(nextProps.params.jobId);
      this.props.getImageByJobId(nextProps.params.jobId);
      this.props.getAllCandidates(nextProps.params.jobId);
    }
  }

  createContactModalOpen(){
    this.refs.clientContactsCreateModal.getWrappedInstance().show();
  }

  editClientModalOpen() {
    this.refs.clientEditModal.getWrappedInstance().show();
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

  _handleJobClick(job) {
    this.props.pushState({}, `/clients/${this.props.params.id}/jobs/${job.get('id')}`);
  }

  closeJobModal() {
    this.props.pushState('', `/clients/${this.props.params.id}/jobs`);
    this.setState({
      detailsJob: null,
      openJob: false,
    });
  }
  _inviteHandler(){
    var email = this.state.detailsContact.get('email');
    this.props.invite(email, window.location.origin + '/invited');
  }

  createNoteModalOpen() {
    this.refs.notesCreateModal.show();
  }

  createJobModalOpen() {
    this.props.replaceJobLocal({companyId:this.props.params.id});
    this.refs.jobCreateModal.show();
  }

  onJobCreateChange (job, dontMergeDeep){
    this.props.updateJobLocal(job, dontMergeDeep);
  }

  onJobCreateImageChange(imageArray){
    this.props.updateJobImageLocal(imageArray);
  }

  onSwipe(index){
    let tab = '';
    switch (index) {
    case 1:
      tab = 'jobs';
      break;
    default:
      tab = '';
    }
    this.props.pushState('', `/clients/${this.props.params.id}/${tab}`);
  }

  render() {

    let {company} = this.props;

    if (company) {

      let website = company.get('website');
      let twitter = company.get('twitterHandle');
      let facebook = company.get('facebookHandle');
      let heroContact = '/img/rameet.jpg';
      return (
        <div>
          <JobDetailsModal closeModal={this.closeJobModal.bind(this)} job={this.props.job} open={(this.props.params.jobId)?(true):(false)} />

          <ClientContactsCreateModal ref="clientContactsCreateModal" companyId={this.props.params.id}/>
          <ClientsEditModal ref="clientEditModal" company={company}/>

          <ContactDetailsModal open={this.state.contactDetailsModalOpen} onInvite={this._inviteHandler.bind(this)} closeModal={this.contactDetailsModalClose.bind(this)} contact={this.state.detailsContact}/>
          <NotesCreateModal ref='notesCreateModal' />
          <JobCreateModal contacts={company.get('contacts')} saveJob={this.props.saveLocalJob} jobImage={this.props.localJobResource} onImageChange={this.onJobCreateImageChange.bind(this)} onJobChange={this.onJobCreateChange.bind(this)} job={this.props.localJob} ref='jobCreateModal'/>

          <Header iconRight={
            <IconMenu iconButtonElement={
              <IconButton  iconClassName="material-icons">more_vert</IconButton>
            }>
              <MenuItem index={0} onTouchTap={this.editClientModalOpen.bind(this)} primaryText="Edit Client" />
              <MenuItem index={0} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Contact" />
              <MenuItem index={0} onTouchTap={this.createJobModalOpen.bind(this)} primaryText="Add Job" />
              <MenuItem index={0} onTouchTap={this.createNoteModalOpen.bind(this)} primaryText="Add Note" />
            </IconMenu>
          } title={company.get('name')}
          />

        <CustomTabsSwipe onSwipeEnd={this.onSwipe.bind(this)} startingTab={this.props.tabId} tabs={['Details', 'Jobs', 'Contacts', 'Notes']}>
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
                    <LocationCard style={{height: '200px'}} location={company.get('location')} marker={<CompanyAvatar url={company.get('website')} />}/>
                ) : (null)}
              </div>
              <List subheader="Your HERO talent advocate">
                {(company.get('clientAdvocate')) ? (
                  <ListItem
                    leftAvatar={<Gravatar email={company.get('clientAdvocate').get('email')} status={'vetted'} />}
                    primaryText={company.get('clientAdvocate').get('displayName')}
                    secondaryText={<p>Hero Talent Advocate</p>}
                    secondaryTextLines={1}
                  />
                ) : (null)}
                </List>

            </div>
            <div style={style.slide}>
              <List subheader={`${company.get('jobs').count()} Job${((company.get('jobs').count() > 1) ? ('s') : (''))}`}>
                <CompanyJobsList company={company} onJobClick={this._handleJobClick.bind(this)} jobs={company.get('jobs')}/>
              </List>
            </div>
            <div style={style.slide}>
              <ContactsList contacts={company.get('contacts')} onOpenContactDetails={this.contactDetailsModalOpen.bind(this)}/>
            </div>
            <div style={style.slide}>
              <Card initiallyExpanded>
                <CardHeader
                    title="Rameet Singh"
                    subtitle="Private | 59 mins ago"
                    avatar={<Avatar src={heroContact} />}
                />
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
                    avatar={<Avatar src={heroContact} />}
                />
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
