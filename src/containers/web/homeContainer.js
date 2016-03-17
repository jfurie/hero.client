import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import { Header, JobsList, CustomTabsSwipe, ContactsList, ClientsList, ActionButton, ActionButtonItem } from '../../components/web';
import { toggleNav } from '../../modules/leftNav';
import { getAllJobs, getMyJobs, createTempJob, getMyFavoriteJobs, createJobFavorite, deleteJobFavorite } from '../../modules/jobs/index';
import { getAllAccountCandidates } from '../../modules/candidates';
import { getCompanyDetails, getAllCompanies, getMyCompanies, createTempCompany, getMyFavoriteCompanies, createCompanyFavorite, deleteCompanyFavorite } from '../../modules/companies';
import { createTempContact, getMyFavoriteContacts, createContactFavorite, deleteContactFavorite } from '../../modules/contacts';

import { Styles } from 'material-ui';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';

const style = {
  slide: {
    minHeight: `${window.innerHeight - 160}px`,
  },
  actionButton: {
    position: 'fixed',
    bottom: '15px',
    right: '15px',
  },
  overlay: {
    zIndex: '1400',
  },
};

let getData = (state, props) => {
  let tab = props.location.query.tab || 'Active Jobs';

  let currentFavorites = state.favorites.get('list');
  let favoriteMap = {};

  let favoriteCompanyIds = [];
  currentFavorites.map(function(favorite){
    favoriteMap[favorite.get('favorableId')] = 1;
    if (favorite.get('favorableType') == 'company') {
      favoriteCompanyIds.push(favorite.get('favorableId'));
    }
  });
  let favoriteContacts = state.contacts.get('list').filter(x=>favoriteMap[x.get('id')]);
  let favoriteJobs = state.jobs.get('list').filter(x=>favoriteMap[x.get('id')]);
  let favoriteCompanies = state.companies.get('list').filter(x=>favoriteMap[x.get('id')]);


  return {
    tab,
    user: state.auth.user,
    jobs: state.jobs,
    contacts: state.contacts,
    auth: state.auth,
    companies: state.companies,
    favoriteContacts,
    favoriteCompanies,
    favoriteJobs,
    favoriteCompanyIds,
  };
};

@connect(getData, {pushState, getCompanyDetails, replaceState, toggleNav, getAllJobs, getAllAccountCandidates, getMyFavoriteContacts, getAllCompanies, getMyJobs, createJobFavorite, deleteJobFavorite, getMyCompanies, createTempCompany, createTempContact, createTempJob, getMyFavoriteCompanies, createCompanyFavorite, deleteCompanyFavorite, getMyFavoriteJobs, createContactFavorite, deleteContactFavorite})
class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openClientCreate: false,
      clientSearchModalOpen: false,

      openContactCreate: false,
      contactSearchModalOpen: false,
    };
  }

  componentDidMount() {
    //this.props.getMyFavoriteJobs();
    //this.props.getMyFavoriteCompanies();
    //this.props.getMyFavoriteContacts();
    // let self = this;
    //
    // setTimeout(() => {
    //   if(self.props.favoriteCompanyIds){
    //
    //     self.props.getCompanyDetails(self.props.favoriteCompanyIds, ['contacts']);
    //   }
    // }, 500);
  }

  _handleJobClick(job){
    this.props.pushState(null, `/clients/${job.get('companyId')}/jobs/${job.get('id')}`);
  }

  _handleClose(){
    this.setState({openClientCreate:false});
  }

  _handleClientSave(id){

    this.setState({
      companyId:id,
      openClientCreate:false,
    });

    let self = this;

    setTimeout(function () {
      self.props.pushState(null, `/clients/${id}`);
    }, 500);
  }

  onClientSearchOpen() {
    this.refs.actionButtons.close();
    this.props.history.pushState(null,`/clients/search`);
  }

  onClientSearchClose() {
    this.setState({
      clientSearchModalOpen: false,
    });
  }

  onClientSelect(client) {
    let id = (client.id) ? (client.id) : (`tmp_${this._guid()}`);
    client.id = id;

    this.props.createTempCompany(client);
    this.setState({
      companyId: id,
      clientSearchModalOpen: false,
      openClientCreate: true,
    });
  }

  onClientCreateClose() {
    this.setState({
      openClientCreate: false,
    });
  }

  onClientDetailsClose(){
    let self = this;
    setTimeout(function () {
      self.props.history.goBack();
    }, 10);
  }

  onContactSearchOpen() {
    this.refs.actionButtons.close();
    this.props.history.pushState(null,`/contacts/search`);
  }

  onContactSearchClose() {
    this.setState({
      contactSearchModalOpen: false,
    });
  }

  onContactSelect(contact) {
    let id = (contact.id) ? (contact.id) : (`tmp_${this._guid()}`);
    contact.id = id;

    this.props.createTempContact(contact);
    this.setState({
      contactId: id,
      contactSearchModalOpen: false,
    });
    let self = this;
    setTimeout(function () {
      self.setState({
        contactId: id,
        openContactCreate: true,
      });
    }, 10);
  }

  onContactCreateClose() {
    this.setState({
      openContactCreate: false,
    });
  }

  onContactCompanyChange(companyId) {
    this.setState({
      companyId,
    });
  }

  // onJobSearchOpen() {
  //   this.refs.actionButtons.close();
  //   this.props.history.pushState(null,'/jobs/search');
  // }

  onJobCreateOpen() {
    this.refs.actionButtons.close();

    // create tpm job
    let job = {
      id: `tmp_${this._guid()}`,
      //companyId,
    };

    this.props.createTempJob(job);
    let self = this;

    setTimeout(function () {
      //self.props.history.replaceState(null,`/clients/${job.companyId}/jobs/${job.id}/create`);
      self.props.history.replaceState(null,`/jobs/${job.id}/create`);

    }, 500);

    //this.props.history.pushState(null,'/jobs/search');
  }

  favoriteCompany(company) {
    this.props.createCompanyFavorite(company.get('id'));
  }

  unfavoriteCompany(company) {
    this.props.deleteCompanyFavorite(company.get('id'));
  }

  favoriteJob(job) {
    this.props.createJobFavorite(job.get('id'));
  }

  unfavoriteJob(job) {
    this.props.deleteJobFavorite(job.get('id'));
  }

  favoriteContact(contact) {
    this.props.createContactFavorite(contact.get('id'));
  }

  unfavoriteContact(contact) {
    this.props.deleteContactFavorite(contact.get('id'));
  }

  _guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }

  tabChange(tab) {
    this.props.replaceState({}, `?tab=${tab}`);
  }

  render () {

    let { contacts, companies, jobs, favoriteContacts, favoriteCompanies, favoriteJobs } = this.props;

    let actions = [
      <ActionButtonItem title={'Contact'} color={Styles.Colors.green500} itemTapped={this.onContactSearchOpen.bind(this)}>
        <ContentAdd />
      </ActionButtonItem>,
      <ActionButtonItem title={'Job'} color={Styles.Colors.purple500} itemTapped={this.onJobCreateOpen.bind(this)}>
        <ContentAdd />
      </ActionButtonItem>,
      <ActionButtonItem title={'Client'} color={Styles.Colors.deepPurple500} itemTapped={this.onClientSearchOpen.bind(this)}>
        <ContentAdd />
      </ActionButtonItem>,
    ];

    return (
      <div>
        <Header title="Dashboard" />
        <CustomTabsSwipe tabs={['Clients', 'Active Jobs', 'Candidates']} startingTab={this.props.tab} onChange={this.tabChange.bind(this)}>
          <div style={style.slide}>
            <ClientsList
                clients={favoriteCompanies}
                favoriteCompany={this.favoriteCompany.bind(this)}
                unfavoriteCompany={this.unfavoriteCompany.bind(this)}
            />
          </div>
          <div>
            <JobsList
                onJobClick={this._handleJobClick.bind(this)}
                jobs={favoriteJobs}
                favoriteJob={this.favoriteJob.bind(this)}
                unfavoriteJob={this.unfavoriteJob.bind(this)}
            />
          </div>
          <div style={style.slide}>
            <ContactsList
                contacts={favoriteContacts}
                favoriteContact={this.favoriteContact.bind(this)}
                unfavoriteContact={this.unfavoriteContact.bind(this)}
            />
          </div>
        </CustomTabsSwipe>
        <ActionButton ref="actionButtons" actions={actions}/>
      {
        /*
        <ClientDetailsContainer
            open={this.props.params.clientDetailsOpen}
            companyId={this.props.params.companyId}
            inline={false}
            onClose={this.onClientDetailsClose.bind(this)}></ClientDetailsContainer>
        */
      }
        <div>
            {this.props.children}
        </div>
    </div>
    );
  }
}

export default HomePage;
