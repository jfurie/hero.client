import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { ClientListItem, JobTemplateListItem, ContactListItem, LocationListItem } from '../../components/web';
import { toggleNav } from '../../modules/leftNav';
import { getAllJobs, getMyJobs } from '../../modules/jobs/index';
import { getAllAccountCandidates } from '../../modules/candidates';
import { getAllCompanies, getMyCompanies, createTempCompany } from '../../modules/companies';
import { createTempContact } from '../../modules/contacts';
import Immutable from 'immutable';
import { ListItem, Divider, FontIcon } from 'material-ui';
let ReactSwipe = require('react-swipe');

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
}), {pushState, toggleNav, getAllJobs, getAllAccountCandidates, getAllCompanies, getMyJobs, getMyCompanies, createTempCompany, createTempContact})
class TestPage extends React.Component {

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

  _handleClientSave(id){
    //onSave
    console.log('saved',id);
    this.setState({
      companyId:id,
      openClientCreate:false,
    });
    var self = this;
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
    let id = client.id ? client.id : 'tmp_' + this._guid();
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
    var self = this;
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
    let id = contact.id ? contact.id : 'tmp_' + this._guid();
    contact.id = id;

    this.props.createTempContact(contact);
    this.setState({
      contactId: id,
      contactSearchModalOpen: false,
    });
    var self = this;
    setTimeout(function () {
      self.setState({
        contactId: id,
        openContactCreate: true
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

  onJobSearchOpen() {
    this.refs.actionButtons.close();
    this.props.history.pushState(null,'/jobs/search');
  }

  _guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  render () {
    let style = {
      item: {
        backgroundColor: '#fff',
        paddingLeft: '10px',
        paddingRight: '10px',
      },
      leftNav: {
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        left: '-10px',
        top: 0,
        bottom: 0,
      },
      rightNav: {
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        right: '-10px',
        top: 0,
        bottom: 0,
      },
      navIcon: {
        alignSelf: 'center',
        fontSize: '2em',
      },
    };

    let company = new Immutable.Map({
      name: 'Google',
      businessType: 'Technology company',
      website: 'http://google.com',
      location: new Immutable.Map({ name: 'Main Office', addressLine: '1600 Amphitheatre Pkwy', city: 'Mountain View', countrySubDivisionCode: 'CA', postalCode: '94043'}),
      tags: ['HOT!'],
    });

    let jobTemplate = new Immutable.Map({
      title: 'Javascript Engineer',
      description: 'Front end/Back end javascript engineer',
    });

    let contact = new Immutable.Map({
      displayName: 'Joshis Furry',
      title: 'CoFounder & CTO',
    });

    let location = company.get('location');

    return (
      <div>
        <ListItem style={style.item}>
        <div>
          <div style={style.leftNav}><FontIcon style={style.navIcon} className="material-icons">keyboard_arrow_left</FontIcon></div>
          <div style={style.rightNav}><FontIcon style={style.navIcon} className="material-icons">keyboard_arrow_right</FontIcon></div>
          <ReactSwipe continuous={true}>
            <div>
              <ClientListItem company={company} type="tiny" />
            </div>
            <div>
              <ClientListItem company={company} type="tiny" />
            </div>
            <div>
              <ClientListItem company={company} type="tiny" />
            </div>
          </ReactSwipe>
        </div>
        </ListItem>
        <Divider />
        <ListItem style={style.item}>
          <JobTemplateListItem jobTemplate={jobTemplate} type="tiny" />
        </ListItem>
        <Divider />
        <ListItem style={style.item}>
          <ContactListItem contact={contact} company={company} type="tiny" />
        </ListItem>
        <Divider />
        <ListItem style={style.item}>
          <LocationListItem location={location} type="tiny" />
        </ListItem>
      </div>
    );
  }
}

export default TestPage;
