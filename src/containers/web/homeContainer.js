import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Header, JobsList, CustomTabsSwipe, CandidatesList, ClientsList } from '../../components/web';
import { toggleNav } from '../../modules/leftNav';
import { getAllJobs } from '../../modules/jobs/index';
import { getAllContacts } from '../../modules/contacts';
import { getAllCompanies } from '../../modules/companies';

const style = {
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

@connect(state => ({
  user: state.auth.user,
  jobs: state.jobs,
  contacts: state.contacts,
  companies: state.companies,
}), {pushState, toggleNav, getAllJobs, getAllContacts, getAllCompanies})
class HomePage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getAllJobs();
    this.props.getAllContacts();
    this.props.getAllCompanies();
  }

  _handleJobClick(){
    this.props.pushState(null,'/jobs/1a');
  }

  render () {

    let { jobs, contacts, companies } = this.props;

    return (
      <div>
        <Header title='Dashboard'></Header>

        <CustomTabsSwipe tabs={['Clients', 'Active Jobs', 'Candidates']} startingTab={1}>
          <div style={style.slide}>
            <ClientsList clients={companies.list} />
          </div>
          <div>
            <JobsList onJobClick={this._handleJobClick.bind(this)} jobs={jobs.list}/>
          </div>
          <div style={style.slide}>
            <CandidatesList candidates={contacts.list}/>
          </div>
        </CustomTabsSwipe>

      </div>
    );
  }
}

export default HomePage;
