import React from 'react';
import { List } from 'material-ui';
//import Infinite from 'react-infinite';
import { CompanyJobsList } from '../../../components/web';

// TMP
import Immutable from 'immutable';

class JobsList extends React.Component {
  _handleJobClick(job){
    if(this.props.onJobClick){
      this.props.onJobClick(job);
    }
  }
  render() {

    let { jobs, ressourceName, ressourceNamePlurial } = this.props;

    ressourceName = ressourceName || 'Job';
    ressourceNamePlurial = ressourceNamePlurial || 'Jobs';

    if (ressourceName !== 'Job' && ressourceNamePlurial === 'Jobs') {
      ressourceNamePlurial = `${ressourceName}s`;
    }

    // create 2 fakes companies
    let companies = new Immutable.Map();

    let ring = {};
    ring['ring'] = {
      'website': 'http://ring.com',
      'name': 'Ring',
    };

    let washio = {};
    washio['washio'] = {
      'website': 'http://www.getwashio.com/',
      'name': 'Washio',
    };

    companies = companies.mergeDeep(ring);
    companies = companies.mergeDeep(washio);

    let subheader = `${jobs.count() * 2} ${ressourceNamePlurial}`;

    return (
      <List subheader={subheader}>
        <CompanyJobsList jobs={jobs} onJobClick={this._handleJobClick.bind(this)} company={companies.get('ring')} />
        <CompanyJobsList jobs={jobs} onJobClick={this._handleJobClick.bind(this)} company={companies.get('washio')} />
      </List>
    );
  }
}

JobsList.propTypes = {
  jobs: React.PropTypes.object.isRequired,
  ressourceName: React.PropTypes.string,
  ressourceNamePlurial: React.PropTypes.string,
};

export default JobsList;
