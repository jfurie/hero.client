import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import marked from 'marked';
//import md5 from 'md5';

//import CommunicationChat from 'material-ui/lib/svg-icons/communication/chat';

import { Header, DetailsCard, CustomTabsSwipe, CandidatesList } from '../../../components/web';
import {
  Dialog, IconButton, FontIcon, Styles,
  IconMenu, MenuItem, Card, CardText, Avatar,
} from 'material-ui';

const style = {
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
  },
  bodyStyle: {
    paddingTop: '0px',
    height: '100%',
    padding: '0',
  },
  contentStyle: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    top: '-64px',
  },
  title:{
    color:'rgba(0, 0, 0, 0.87)',
    fontSize:'15px',
    fontWeight:'500',
  },
  content:{
    color:'rgba(0, 0, 0, 0.54)',
    fontSize:'14px',
    fontWeight:'500',
  },
  card: {
    paddingTop: '4px',
  },
};

@connect(() => (
{}), {pushState})
export default class JobDetails extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      justInvited: false,
      confirmOpen: false,
    };
  }

  renderBigListItem(title,content,avatar){
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        <div style={{display:'inline-block'}}>
          <div style={style.title}>{title}</div>
          <div style={style.content}>{content}</div>
        </div>
      </div>
    );
  }

  goBack() {
    if (this.props.onJobDetailsClose) {
      this.props.onJobDetailsClose();
    }
  }

  _onTouchTapSave() {
    console.log('_onTouchTapSave');
  }

  _onTouchTapShare() {
    console.log('_onTouchTapShare');
  }

  _onTouchTapSearch() {
    console.log('_onTouchTapSearch');
  }

  renderContent(job) {

    if (job) {

      // get cover
      let cover = ((job.get('image')) ? (job.get('image').get('item')) : ('/img/default-job.jpg'));

      // fee percentages
      let feePercent = job.get('feePercent');
      if (!feePercent) {
        feePercent = 'not set';
      } else {
        feePercent += '%';
      }

      // markdown to html
      let description = job.get('description') ? marked(job.get('description')) : '';

      // salary
      let salaryMin = '$?';
      let salaryMax = '$?';

      if (job.get('minSalary')) {
        salaryMin = `$${~~(job.get('minSalary')) / 1000}k`;
      }

      if (job.get('maxSalary')) {
        salaryMax = `$${~~(job.get('maxSalary')) / 1000}k`;
      }

      let actions = [{
        materialIcon: 'search',
        text: 'Find',
        onTouchTap: this._onTouchTapSearch.bind(this),
      }, {
        materialIcon: 'star_rate',
        text: 'Save',
        onTouchTap: this._onTouchTapSave.bind(this),
      }, {
        materialIcon: 'share',
        text: 'Share',
        onTouchTap: this._onTouchTapShare.bind(this),
      }];

      return (

        <div>
          <DetailsCard
              title={job.get('title')}
              subtitle={job.get('company').get('name')}
              extraLeftLine={`${salaryMin} - ${salaryMax}`}
              extraRightLine={job.get('employmentType')}
              cover={cover}
              mainColor={Styles.Colors.amber700}
              actions={actions}
              floatActionOnTap={this._onTouchTapShare.bind(this)}
              floatActionContent={<div><p style={{color: `${Styles.Colors.amber700}`, fontSize: '20px', fontWeight: '500'}}>{job.get('candidates').length}</p></div>}
          />
          <CustomTabsSwipe isLight isInline ref='customTabsSwipe' tabs={['Details', 'Desc', 'Applicants']}>
            <Card style={style.card}>
              <CardText>
                {this.renderBigListItem('Quick Pitch', job.get('quickPitch'), <Avatar
                icon={<FontIcon className="material-icons">info_outline</FontIcon>}
                color={Styles.Colors.grey600}
                backgroundColor={Styles.Colors.white}
                />)}
              </CardText>
              <CardText>
                {this.renderBigListItem('Fee Percentage', feePercent, <Avatar
                icon={<FontIcon className="material-icons">equalizer</FontIcon>}
                color={Styles.Colors.grey600}
                backgroundColor={Styles.Colors.white}
                />)}
              </CardText>
            </Card>
            <div>
              <Card>
                <CardText >
                  <div className='description'>
                    <h3>Job Description</h3>
                    <div dangerouslySetInnerHTML={{__html: description}} />
                  </div>
                </CardText>
              </Card>
            </div>
            <div>
              <CandidatesList candidates={job.get('candidates')} />
            </div>
          </CustomTabsSwipe>

        </div>
      );

    }
    else {
      return (<div></div>);
    }
  }

  render() {

    let { job } = this.props;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let contentHeight = clientHeight;

    return (
      <div>
        <Dialog
            open={this.props.open}
            autoDetectWindowHeight={false}
            autoScrollBodyContent={false}
            repositionOnUpdate={false}
            defaultOpen={false}
            style={style.dialog}
            bodyStyle={style.bodyStyle}
            contentStyle={style.contentStyle}
        >
          <div style={{minHeight: `${clientHeight}px`, overflowY:'scroll'}}>
            <Header transparent goBack={this.goBack.bind(this)} iconRight={
              <IconMenu iconButtonElement={
                <IconButton iconClassName="material-icons">more_vert</IconButton>
              }>
                <MenuItem index={0} primaryText="Edit Job" />
              </IconMenu>
            }
            />
            <div style={{height: `${contentHeight}px`, overflowY:'scroll', WebkitOverflowScrolling:'touch'}}>
              {this.renderContent(job)}
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

JobDetails.propTypes = {
  job: React.PropTypes.object,
  onJobDetailsClose: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
};
