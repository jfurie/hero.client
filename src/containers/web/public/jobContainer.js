import React from 'react';
import { connect } from 'react-redux';
import { getJobByShortId, applyToJob } from '../../../modules/public';
import { PublicJob, PublicSignUp } from '../../../components/web';
import { getCategoriesIfNeeded } from '../../../modules/categories';
function getData(state, props) {
  let job = state.publik.get('jobs').get(props.params.shortId);
  let newApplicant = state.publik.get('newApplicant');

  let token = props.location.query.token || null;

  return {
    job,
    token,
    newApplicant,
    authToken:state.auth.get('authToken'),
  };
}

function cleanTitle(title){
  return title.replace(/[^A-Za-z0-9_\.~]+/gm, '-');
}

@connect((state, props) => (getData(state, props)), {getJobByShortId, applyToJob,getCategoriesIfNeeded})
class PublicJobContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openSignUpModal: false,
    };
  }

  componentDidMount() {
    this.props.getJobByShortId(this.props.params.shortId, this.props.token);
    this.props.getCategoriesIfNeeded();
  }
  componentWillReceiveProps(nextProps){
    if(this.props.params.shortId !== nextProps.params.shortId || this.props.token !== nextProps.token){
      this.props.getJobByShortId(nextProps.params.shortId, nextProps.token);
    }

    if (this.props.newApplicant != nextProps.newApplicant) {
      this.conversion(nextProps.newApplicant.contact);
    }
  }

  conversion(data) {
    // twitter event
    twttr.conversion.trackPid('ntgf3', { tw_sale_amount: 0, tw_order_quantity: 0 });

    //google event
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'landing',
      'eventAction': 'apply',
    });

    //FB Event
    fbq('track', 'Lead');

    mixpanel.people.set({
      '$email': data.email,
      '$first_name': data.firstName,
      '$last_name': data.lastName,
      '$name': data.displayName,
      '$created': data.created,
      '$phone': data.phone,
      'provider': 'form',
    });

    mixpanel.alias(data.email);
    mixpanel.track('applied');
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

    let title = job.get('title');

    if (job.get('public')) {
      title = `${job.get('company').get('name')} ${title}`;
    }

    title = cleanTitle(title);

    let url = `${window.location.href.split('/')[0]}//${window.location.href.split('/')[2]}/j/${job.get('shortId')}/${title}`;

    let body = `${encodeURIComponent(job.get('title'))}%0A${encodeURIComponent(url)}`;
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }

  render() {
    let { job } = this.props;

    return (
      <div>
        <PublicJob
            open
            authToken={this.props.authToken}
            job={job}
            apply={this.openSignUpModal.bind(this)}
            share={this.share.bind(this)}
            token={this.props.token}
        />
        <PublicSignUp
            triggerModal={this.openSignUpModal.bind(this)}
            open={this.state.openSignUpModal}
            close={this.closeSignUpModal.bind(this)}
            submit={this.apply.bind(this)}
        />
      </div>
    );
  }
}

export default PublicJobContainer;
