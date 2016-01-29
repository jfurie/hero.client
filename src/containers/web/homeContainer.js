import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, JobsList, CustomTabsSwipe, CandidatesList, ClientsList, ActionButton, ActionButtonItem } from '../../components/web';
import { toggleNav } from '../../modules/leftNav';
import { getAllJobs, getMyJobs } from '../../modules/jobs/index';
import { getAllAccountCandidates } from '../../modules/candidates';
import { getAllCompanies, getMyCompanies, createTempCompany } from '../../modules/companies';
import ClientCreateContainer from './clients/clientCreateContainer';
import { Styles } from 'material-ui';

//import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';


//import Overlay from 'material-ui/lib/overlay';
//import StylePropable from 'material-ui/lib/mixins/style-propable';

const style = {
  slide: {
    minHeight: `${window.innerHeight - 160}px`,
    // marginTop: '48px',
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
}), {pushState, toggleNav, getAllJobs, getAllAccountCandidates, getAllCompanies, getMyJobs, getMyCompanies, createTempCompany})
class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openClientCreate: false
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
    this.props.pushState(null,'/clients/'+ job.get('companyId') + '/jobs/'+job.get('id'));
  }
  _handleClose(){
    this.setState({openClientCreate:false});
  }

  _handleOverlayTouchTap() {
    console.log('lol');
  }

  _createContact() {
    console.log('_createContact');
  }

  _createJob() {
    console.log('_createJob');
  }

  _createClient() {
    this.refs.actionButtons.close();
    this.props.createTempCompany({
      id:'tmp'
    });
    this.setState({
      companyId:'tmp',
      openClientCreate:true
    });
  }
  _handleContactSave(id){
    //onSave
    console.log('saved',id);
    this.setState({
      companyId:id,
      openClientCreate:false
    });
  }

  render () {

    let { candidates, companies, myJobs } = this.props;
    let { query } = this.props.location;
    let actions = [
      <ActionButtonItem title={'Contact'} color={Styles.Colors.green500} itemTapped={this._createContact}>
        <ContentAdd />
      </ActionButtonItem>,
      <ActionButtonItem title={'Job'} color={Styles.Colors.purple500} itemTapped={this._createJob}>
        <ContentAdd />
      </ActionButtonItem>,
      <ActionButtonItem title={'Client'} color={Styles.Colors.deepPurple500} itemTapped={::this._createClient}>
        <ContentAdd />
      </ActionButtonItem>,
    ];

    return (
      <div>
        <Header title='Dashboard'></Header>

        <CustomTabsSwipe tabs={['Clients', 'Active Jobs', 'Candidates', 'Client Create Test']} startingTab={1}>
          <div style={style.slide}>
            <ClientsList clients={companies.myCompanyIds} />
          </div>
          <div>
            <JobsList onJobClick={this._handleJobClick.bind(this)} jobs={myJobs}/>
          </div>
          <div style={style.slide}>
            <CandidatesList candidates={candidates}/>
          </div>
          <div>
            <ClientCreateContainer onSave={this._handleContactSave.bind(this)} companyId={this.state.companyId} inline={false} open={this.state.openClientCreate} onClose={this._handleClose.bind(this)}></ClientCreateContainer>
          </div>
        </CustomTabsSwipe>
        <ActionButton ref='actionButtons' actions={actions}/>

      </div>
    );
  }
}

export default HomePage;
