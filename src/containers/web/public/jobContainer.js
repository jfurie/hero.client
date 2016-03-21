import React from 'react';
import { connect } from 'react-redux';
import { getJobByShortId } from '../../../modules/public';
import { PublicJob } from '../../../components/web';

function getData(state, props) {
  let job = state.publik.get('jobs').get(props.params.shortId);

  return {
    job,
  };
}

@connect((state, props) => (getData(state, props)), {getJobByShortId})
class PublicJobContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getJobByShortId(this.props.params.shortId);
  }

  apply() {
    location.href = '/';
  }

  share() {
    let {job} = this.props;

    let subject = `Check out ${this.props.job.get('title')} on HERO`;

    let url = `${window.location.href.split('/')[0]}//${window.location.href.split('/')[2]}/j/${job.get('shortId')}/${job.get('company').get('name')}-${job.get('title')}`;

    let body = `${encodeURIComponent(job.get('title'))}%0A${encodeURIComponent(url)}`;
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }

  render() {
    let { job } = this.props;

    return (
      <PublicJob
          open
          job={job}
          apply={this.apply.bind(this)}
          share={this.share.bind(this)}
      />
    );
  }
}

export default PublicJobContainer;
