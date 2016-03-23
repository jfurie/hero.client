import React from 'react';
import { connect } from 'react-redux';
import { getJobByShortId, applyToJob } from '../../../modules/public';
import { PublicJob, PublicSignUp } from '../../../components/web';

function getData(state, props) {
  let job = state.publik.get('jobs').get(props.params.shortId);

  return {
    job,
  };
}

@connect((state, props) => (getData(state, props)), {getJobByShortId, applyToJob})
class PublicJobContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openSignUpModal: false,
    };
  }

  componentDidMount() {
    this.props.getJobByShortId(this.props.params.shortId);
  }

  openSignUpModal() {
    this.setState({
      openSignUpModal: true,
    });
  }

  closeSignUpModal() {
    this.setState({
      openSignUpModal: false,
    });
  }

  apply(contact) {
    this.props.applyToJob(contact, this.props.job.get('id'));
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
      <div>
        <PublicJob
            open
            job={job}
            apply={this.openSignUpModal.bind(this)}
            share={this.share.bind(this)}
        />
        <PublicSignUp
            open={this.state.openSignUpModal}
            close={this.closeSignUpModal.bind(this)}
            submit={this.apply.bind(this)}
        />
      </div>
    );
  }
}

export default PublicJobContainer;
