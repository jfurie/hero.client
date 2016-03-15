import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { ClientListItem, JobTemplateListItem, ContactListItem, LocationListItem, RangeSlider } from '../../components/web';
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
  let ids = state.jobs.get('myJobIds');
  return ids.map(id =>{
    return state.jobs.get('list').get(id);
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
      salary: [90000, 120000],
    };
  }

  componentDidMount() {

  }

  onSalaryChange(value) {
    console.log(value);

    this.setState({
      salary: value,
    });
  }

  render () {
    let style = {
      item: {
        backgroundColor: '#fff',
        paddingLeft: '10px',
        paddingRight: '10px',
      },
      sliderItem: {
        padding: '20px',
        backgroundColor: '#fff',
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
        <Divider />
        <div style={style.sliderItem}>
          <RangeSlider
            min={0}
            max={180000}
            step={1000}
            value={this.state.salary}
            onChange={this.onSalaryChange.bind(this)}
            format="money"
          />
        </div>
      </div>
    );
  }
}

export default TestPage;
