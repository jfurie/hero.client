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
    let subject = `Check out ${this.props.job.get('title')} on HERO`;
    let body = `${encodeURIComponent(this.props.job.get('title'))}%0A${encodeURIComponent(window.location.href)}`;
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
