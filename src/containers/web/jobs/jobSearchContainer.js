import React from 'react';
import { connect } from 'react-redux';

import { JobSearch } from '../../../components/web';

import { searchJobs, createTempJob } from '../../../modules/jobs';

//let debounce = require('debounce');
import _ from 'lodash';

@connect(state => ({
  jobs: state.jobs,
  companies: state.companies.get('myCompanyIds'),
}), { searchJobs, createTempJob }, null, { withRef: true })
class JobSearchContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = this._getResetState();
    this.onQueryChangeImmediate = this.onQueryChangeImmediate.bind(this);
    this.onQueryChange = _.debounce(this.onQueryChange.bind(this), 500);
  }

  componentDidMount() {
    let self = this;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        self.setState({
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let results = nextProps.jobs.get('queries').get(this.state.query);

    this.setState({
      searchResults: results ? results.toArray() : [],
    });
  }

  _getResetState() {
    return {
      open:true,
      query: '',
      searchResults: [],
      suggestions: [],
      position: {
        lat: 34.016483,
        lng: -118.496859,
      },
    };
  }

  _resetState() {
    this.setState(this._getResetState());
  }

  onQuerySubmit() {
    if (this.state.query.length > 1) {
      this.props.searchJobs(this.state.query);
    }
    else {
      this.setState({
        searchResults: [],
        suggestions: [],
      });
    }
  }

  onQueryChange(e) {
    this.setState({
      query: e.target.value ? e.target.value : '',
    });

    this.onQuerySubmit();
  }

  onQueryChangeImmediate(e){
    e.persist();
    this.onQueryChange(e);
  }

  onQueryClear(e) {
    this.setState({
      query: '',
    });

    e.setValue('');

    this.setState({
      searchResults: [],
      suggestions: [],
    });
  }

  onSearchModalClose() {
    this.setState(this._getResetState());
    if(this.props.onClose){
      this.props.onClose();
    } else {
      this.props.history.goBack();
    }
  }

  onSelect(job){
    if(this.props.onJobSelect) {
      this.props.onJobSelect(job);
    } else {
      let id = (job.id) ? (job.id) : (`tmp_${this._guid()}`);
      job.id = id;
      job.companyId = this.props.params.companyId || job.companyId || (this.props.companies.first() && this.props.companies.first().get('id'));

      this.props.createTempJob(job);

      let self = this;
      this.setState({open:false});

      setTimeout(function () {
        self.props.history.replaceState(null,`/clients/${job.companyId}/jobs/${id}/create`);
      }, 500);
    }
  }

  onDbJobSelect(dbJob) {
    let job = dbJob ? (dbJob.toObject ? dbJob.toObject() : dbJob) : {};

    this._resetState();
    this.onSelect(job);
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

  render() {
    return (
      <div>
        <JobSearch
          open={this.state.open}
          query={this.state.query}
          searchResults={this.state.searchResults}
          suggestions={this.state.suggestions}
          onQueryChange={this.onQueryChangeImmediate}
          onQuerySubmit={this.onQuerySubmit.bind(this)}
          onQueryClear={this.onQueryClear.bind(this)}
          onSearchModalClose={this.onSearchModalClose.bind(this)}
          onDbJobSelect={this.onDbJobSelect.bind(this)}
        />
      </div>
    );
  }
}

export default JobSearchContainer;
