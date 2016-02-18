import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, JobsList, CustomTabsSwipe, CandidatesList, ClientsList, ActionButton, ActionButtonItem } from '../../components/web';
import { toggleNav } from '../../modules/leftNav';
import { getAllJobs, getMyJobs, createTempJob } from '../../modules/jobs/index';
import { getAllAccountCandidates } from '../../modules/candidates';
import { getAllCompanies, getMyCompanies, createTempCompany } from '../../modules/companies';
import { createTempContact } from '../../modules/contacts';

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

function filterMyCandidates(candidates, auth) {
  if(auth && auth.authToken){
    let accountId = auth.authToken.accountInfo.account.id;

    let myCandidates = [];
    if (accountId && candidates && candidates.byAccountId && candidates.list) {
      if (candidates.byAccountId.size > 0) {
        candidates.byAccountId.get(accountId).forEach(function(candidateId) {
          let c = candidates.list.get(candidateId);
          if (c) {
            myCandidates.push(c);
          }
        });
      }
    }

    return myCandidates;
  }
  return [];
}

function filterMyJobs(state){
  let ids = state.jobs.myJobIds;
  return ids.map(id =>{
    return state.jobs.list.get(id);
  });
}

@connect((state, props) => ({
  user: state.auth.user,
  jobs: state.jobs,
  myJobs:filterMyJobs(state,props),
  candidates: filterMyCandidates(state.candidates, state.auth),
  auth: state.auth,
  companies: state.companies,
}), {pushState, toggleNav, getAllJobs, getAllAccountCandidates, getAllCompanies, getMyJobs, getMyCompanies, createTempCompany, createTempContact, createTempJob})
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
    this.props.getMyJobs();
    this.props.getAllJobs();
    this.props.getAllCompanies();
    this.props.getMyCompanies();
    if(this.props.auth && this.props.auth.authToken){
      this.props.getAllAccountCandidates(this.props.auth.authToken.accountInfo.account.id);
    }
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

    //console.log(this.props.companies && this.props.companies.list);

    // let companyId = null;
    // if (this.props.companies && this.props.companies.list && this.props.companies.list.size) {
    //   companyId = this.props.companies.list.first().get('id');
    // }

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

  _guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }

  render () {
    let { candidates, companies, myJobs } = this.props;

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
        <CustomTabsSwipe tabs={['Clients', 'Active Jobs', 'Candidates']} startingTab={1}>
          <div style={style.slide}>
            <ClientsList clients={companies.myCompanyIds} />
          </div>
          <div>
            <JobsList onJobClick={this._handleJobClick.bind(this)} jobs={myJobs}/>
          </div>
          <div style={style.slide}>
            <CandidatesList candidates={candidates}/>
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
