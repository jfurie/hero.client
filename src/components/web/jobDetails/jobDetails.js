import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import marked from 'marked';

import { List, CardTitle } from 'material-ui';
import defaultImage from './default-job.jpg';
import {SkillsCard,Confirm, LocationCard, Header, DetailsCard, CustomTabsSwipe, JobApplicantList, CompanyAvatar, CompanyNotesList, MarkedViewer } from '../../../components/web';
import {
  IconButton, FontIcon, Styles, Divider,
  IconMenu, MenuItem, Card, CardText, Avatar,
} from 'material-ui';
import './jobDetails.scss';

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
function cleanTitle(title){
  return title.replace(/[^A-Za-z0-9_\.~]+/gm, '-');
}
@connect(() => (
{}), {pushState, replaceState})
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
        {
          content ?
          <div style={{display: 'inline-block'}}>
            <div style={style.title}>{title}</div>
            <div style={style.content}>
              <MarkedViewer value={content} /></div>
          </div>
          :
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={style.title}>{title}</div>
          </div>
        }

      </div>
    );
  }

  goBack() {
    if (this.props.onJobDetailsClose) {
      this.props.onJobDetailsClose();
    }
  }

  _onTouchTapSave() {
    let {job} = this.props;

    if (job.get('isFavorited')) {
      this.props.unfavoriteJob();
    }
    else {
      this.props.favoriteJob();
    }
  }

  _onTouchTapHot() {
    this.props.toggleTag(this.props.job.get('id'), 'HOT!');
  }

  _onTouchTapShare() {
    let {job} = this.props;

    let subject = `Check out ${this.props.job.get('title')} on HERO`;
    let title = this.props.job.get('company').get('name') + '-' +this.props.job.get('title');
    title = cleanTitle(title);
    let url = `${window.location.href.split('/')[0]}//${window.location.href.split('/')[2]}/j/${job.get('shortId')}/${title}`;

    let body = `${encodeURIComponent(job.get('title'))}%0A${encodeURIComponent(url)}`;
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }

  _onTouchTapSearch() {
    this.props.pushState(null,`/clients/${this.props.job.get('companyId')}/jobs/${this.props.job.get('id')}/candidates/search`);
  }
  _onTouchAddCandidate(){
    this.props.pushState(null,`/clients/${this.props.job.get('companyId')}/jobs/${this.props.job.get('id')}/candidates/search`);
  }

  _onTouchTapEdit(){
    this.props.pushState(null,`/clients/${this.props.job.get('companyId')}/jobs/${this.props.job.get('id')}/edit`);
  }

  _onTouchCompanyIcon(){
    this.props.pushState(null,`/clients/${this.props.job.get('companyId')}`);
  }
  editSkills(){
    this.props.pushState(null, `/jobs/${this.props.job.get('id')}/categories/edit`);
  }
  createNoteModalOpen(){
    if(this.props.addNoteModalOpen){
      this.props.addNoteModalOpen();
    }
  }

  editNote(note){
    this.props.addNoteModalOpen(note);
  }

  deleteNote(note){
    this.props.deleteNote(note);
  }
  tabChange(number){
    if(number){
      this.props.replaceState(null,`/jobs/${this.props.job.get('id')}?tab=${number}`);
    }
  }

  viewPublic(){
    let self = this;
    let title = self.props.job.get('company').get('name') + '-' +self.props.job.get('title');
    title = cleanTitle(title);
    self.props.pushState(null, `/j/${self.props.job.get('shortId')}/${title}`);
  }
  deleteJob(){
    let self = this;
    this.refs.confirm.confirm({
      title:'Delete Job',
      message:'Are you sure you want to delete this Job? (This cannot be undone)'
    }).then(function(){
      self.props.deleteJob(self.props.job.get('id'));
    }).catch(function(){
      console.log('no');
    });
  }

  renderContent(job) {

    if (job) {

      // get cover
      let cover = ((job.get('image') && job.get('image').get('item')) ? (job.get('image').get('item')) : (defaultImage));

      // markdown to html
      let description = job.get('description') ? marked(job.get('description')) : '';

      // salary
      let salaryMin = '$[?]';
      let salaryMax = '$[?]';

      if (job.get('minSalary')) {
        salaryMin = `$${~~(job.get('minSalary')) / 1000}k`;
      }

      if (job.get('maxSalary')) {
        salaryMax = `$${~~(job.get('maxSalary')) / 1000}k`;
      }

      // fee
      // let fee = 'Fee: [?]%';
      //
      // if (job.get('fee')) {
      //   fee = `Fee: ${job.get('fee')}%`;
      // }

      let isHot = false;

      if (job.get('tags')) {
        isHot = job.get('tags').indexOf('HOT!') > -1;
      }

      // details card
      let actions = [{
        materialIcon: 'search',
        text: 'Find',
        onTouchTap: this._onTouchTapSearch.bind(this),
      }, {
        materialIcon: 'star_rate',
        text: job.get('isFavorited') ? 'Saved' : 'Save',
        active: job.get('isFavorited'),
        onTouchTap: this._onTouchTapSave.bind(this),
      }, {
        materialIcon: 'favorite',
        text: 'HOT!',
        active: isHot,
        activeColor: Styles.Colors.pink500,
        onTouchTap: this._onTouchTapHot.bind(this),
      }, {
        materialIcon: 'share',
        text: 'Share',
        onTouchTap: this._onTouchTapShare.bind(this),
      }];

      // company
      let company = job.get('company');
      let companyWebsite = null;
      let companyName = null;
      if (company) {
        companyWebsite = company.get('website');
        companyName = company.get('name');
      }
      else {
        companyName = 'XYZ Company';
      }

      // location stuff
      let location = job.get('location');
      let addressLine = null;

      if (location) {
        let address = location.get('addressLine') || '';
        let city = location.get('city') || null;
        let countrySubDivisionCode = location.get('countrySubDivisionCode') || null;

        if (city && countrySubDivisionCode) {
          city += `, ${countrySubDivisionCode}`;
        }

        addressLine = address;
        if (addressLine.length) {
          addressLine += `. ${city}`;
        } else {
          addressLine = city;
        }
      }
      let categoryLinks = job.get('_categoryLinks');


      return (

        <div>
          <DetailsCard
              topTitle={companyName}
              topSubtitle={`${companyName} - ${job.get('department')}`}
              location={job.get('location')}
              bottomLabel="Job Title"
              bottomTitle={job.get('title')}
              rightLabel="Wage"
              rightTitle={`${salaryMin} - ${salaryMax}`}
              rightSubtitle={job.get('jobType') || 'Permanent'}
              cover={cover}
              actions={actions}
              avatar={<CompanyAvatar onTouchTap={this._onTouchCompanyIcon.bind(this)} style={{width: '95px'}} url={companyWebsite}/>}
              floatActionOnTap={this._onTouchTapShare.bind(this)}
              floatActionContent={<FontIcon className="material-icons">share</FontIcon>}
              floatActionLabel={'Share'}
          />
        <CustomTabsSwipe onChange={this.tabChange.bind(this)} startingTab={this.props.tab} isLight isInline tabs={['Details', 'Desc', 'Applicants', 'Notes']}>
            <div>
              <Card style={style.card}>
                <CardTitle title="Details" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
                <CardText>
                  {this.renderBigListItem('Quick Pitch', job.get('quickPitch'),
                  <Avatar
                      icon={<FontIcon className="material-icons">info_outline</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Bonus & perks', job.get('bonusPerks'),
                  <Avatar
                      icon={<FontIcon className="material-icons">redeem</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
              </Card>

              <LocationCard location={job.get('location')} />
              <SkillsCard skills={categoryLinks} />
            </div>
            <div style={{minHeight:'800px'}}>
              <Card>
                <CardText >
                  <div className="description">
                    <div dangerouslySetInnerHTML={{__html: description}} />
                  </div>
                </CardText>
              </Card>
            </div>
            <div style={{minHeight:'800px'}}>
              <JobApplicantList
                  candidates={job.get('candidates')}
                  favoriteContact={this.props.favoriteContact.bind(this)}
                  unfavoriteContact={this.props.unfavoriteContact.bind(this)}
                  editContact={this.props.editContact.bind(this)}
                  deleteCandidate={this.props.deleteCandidate.bind(this)}
                  editApplicantState={this.props.editApplicantState.bind(this)}
                  tab={this.props.tab}
              />
            </div>
            <List subheader={`${job.get('notes').count()} Note${((job.get('notes').count() !== 1) ? ('s') : (''))}`}>
              <CompanyNotesList editNote={this.editNote.bind(this)} deleteNote={this.deleteNote.bind(this)} notes={job.get('notes')}/>
            </List>
          </CustomTabsSwipe>
          <Confirm ref='confirm' />
        </div>
      );

    }
    else {
      return (<div></div>);
    }
  }

  render() {

    let { job } = this.props;
    return (
      <div>
        <Header showHome={true} transparent goBack={this.goBack.bind(this)} iconRight={
          <IconMenu iconButtonElement={
            <IconButton iconStyle={{color: Styles.Colors.white}} iconClassName="material-icons">more_vert</IconButton>
          }>
            <MenuItem onTouchTap={this._onTouchTapEdit.bind(this)} index={0} primaryText="Edit Job" />
            <MenuItem onTouchTap={this._onTouchAddCandidate.bind(this)} index={0} primaryText="Find Candidate" />
            <MenuItem index={0} onTouchTap={this.createNoteModalOpen.bind(this)} primaryText="Add Note" />
            <MenuItem index={0} onTouchTap={this.editSkills.bind(this)} primaryText={`Edit Skills`} />
            <MenuItem index={0} onTouchTap={this.viewPublic.bind(this)} primaryText={`View Public Job`} />
            <Divider />
            <MenuItem index={0} onTouchTap={this.deleteJob.bind(this)} primaryText={`Delete Job`} />
          </IconMenu>
        }
        />
        {this.renderContent(job)}
      </div>
    );
  }
}

JobDetails.propTypes = {
  job: React.PropTypes.object,
  onJobDetailsClose: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
};
