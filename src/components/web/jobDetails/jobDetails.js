import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import marked from 'marked';

import { List, ListItem, CardTitle } from 'material-ui';
import defaultImage from './default-job.jpg';
import { NoResultsCard, NotFound, ShareLinkModal, Gravatar, CardBasic, SkillsCard,Confirm, LocationCard, Header, DetailsCard, CustomTabsSwipe, JobApplicantList, CompanyAvatar, CompanyNotesList, MarkedViewer } from '../../../components/web';
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
  smallListItem: {
    padding: 0,
    margin: '16px',
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
      openShareLinkModal: false,
    };
  }

  renderSmallListItem(content,avatar){
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{color:'rgba(0, 0, 0, 0.87)', fontSize:'15px'}}>{content}</div>
        </div>
      </div>
    );
  }

  renderSmallListLink(content,avatar){
    return (
      <div style={{position: 'relative', display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{color:'rgba(0, 0, 0, 0.87)', fontSize:'15px', maxWidth: '240px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{content}</div>
        </div>
        <FontIcon style={{position: 'absolute', display: 'flex', alignItems: 'center', top: 0, bottom: 0, right: 0, color: Styles.Colors.grey700}} className="material-icons">keyboard_arrow_right</FontIcon>
      </div>
    );
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

    let title = job.get('title');

    if (job.get('public')) {
      title = `${job.get('company').get('name')} ${title}`;
    }

    title = cleanTitle(title);

    let url = `${window.location.href.split('/')[0]}//${window.location.href.split('/')[2]}/j/${job.get('shortId')}/${title}`;
    this.setState({
      openShareLinkModal: true,
      shareUrl: url,
    });
  }

  _onCloseShareLinkModal() {
    this.setState({
      openShareLinkModal: false,
    });
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
    if (this.props.isHero) {
      this.props.pushState(null,`/clients/${this.props.job.get('companyId')}`);
    }
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
    let {job} = this.props;

    let title = job.get('title');

    if (job.get('public')) {
      title = `${job.get('company').get('name')} ${title}`;
    }

    title = cleanTitle(title);

    this.props.pushState(null, `/j/${job.get('shortId')}/${title}`);
  }

  viewPrivate(){
    let {job} = this.props;

    let title = job.get('title');

    title = cleanTitle(title);

    this.props.pushState(null, `/j/${job.get('shortId')}/${title}?token=${job.get('token')}`);
  }

  deleteJob(){
    let self = this;
    this.refs.confirm.confirm({
      title:'Delete Job',
      message:'Are you sure you want to delete this Job? (This cannot be undone)',
    }).then(function(){
      self.props.deleteJob(self.props.job.get('id'));
    }).catch(function(){
      console.log('no');
    });
  }

  openInNewTab(url) {
    window.open(url);
  }

  openHiringContact() {
    let {job} = this.props;
    this.props.pushState(null, `/contacts/${job.get('talentAdvocateId')}`);
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
      if(job.get('isHourly')){
        if (job.get('minSalary')) {
          salaryMin = `$${~~(job.get('minSalary'))}/hr`;
        }
        if (job.get('maxSalary')) {
          salaryMax = `$${~~(job.get('maxSalary'))}/hr`;
        }
      } else {
        if (job.get('minSalary')) {
          salaryMin = `$${~~(job.get('minSalary')) / 1000}k`;
        }
        if (job.get('maxSalary')) {
          salaryMax = `$${~~(job.get('maxSalary')) / 1000}k`;
        }
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
      let companyName;
      let companyWebsite;
      let companyTwitter;
      let companyFacebook;
      let companyCrunchbase;
      let productSolution;
      let culture;
      let benefits;
      let techstack;
      let leadership;

      let company = job.get('company');
      let talentAdvocate = job.get('talentAdvocate');
      let talentAdvocateCompany;

      if (company) {
        companyName = company.get('name');
        companyWebsite = company.get('website');
        companyTwitter = company.get('twitterHandle');
        companyFacebook = company.get('facebookHandle');
        companyCrunchbase = company.get('crunchbase');
        productSolution = company.get('productSolution');
        culture = company.get('culture');
        benefits = company.get('benefits');
        techstack = company.get('techstack');
        leadership = company.get('leadership');

        if (companyWebsite && !companyWebsite.startsWith('http')) {
          companyWebsite = `http://${companyWebsite}`;
        }
      }
      else {
        companyName = 'XYZ Company';
      }

      if (talentAdvocate && talentAdvocate.get('companies')) {
        talentAdvocateCompany = talentAdvocate.get('companies').first();
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

      let tabs = ['Details', 'Applicants'];

      if (this.props.isHero) {
        tabs.push('Notes');
      }

      return (

        <div>
          <DetailsCard
              topTitle={<span onTouchTap={this._onTouchCompanyIcon.bind(this)} style={{cursor:'pointer'}}>{companyName}</span>}
              topSubtitle={<span onTouchTap={this._onTouchCompanyIcon.bind(this)} style={{cursor:'pointer'}}>{`${companyName} - ${job.get('department')}`}</span>}
              location={job.get('location')}
              bottomLabel="Job Title"
              bottomTitle={job.get('title')}
              rightLabel="Wage"
              rightTitle={`${salaryMin} - ${salaryMax}`}
              rightSubtitle={job.get('jobType') || 'Permanent'}
              cover={cover}
              actions={actions}
              avatar={<CompanyAvatar onTouchTap={this._onTouchCompanyIcon.bind(this)} style={{width: '95px', cursor:'pointer'}} url={companyWebsite}/>}
              floatActionOnTap={this._onTouchTapShare.bind(this)}
              floatActionContent={<FontIcon className="material-icons">share</FontIcon>}
              floatActionLabel={'Share'}
          />
        <CustomTabsSwipe onChange={this.tabChange.bind(this)} startingTab={this.props.tab} isLight isInline tabs={tabs}>
            <div>
              <Card>
                <CardText>
                  {this.renderBigListItem('Company Mission',productSolution,
                  <Avatar
                      icon={<FontIcon className="material-icons">store</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
              </Card>
              <LocationCard location={job.get('location')} />
              <Card>
                <CardTitle title="Details" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />

                {(companyWebsite) ? (
                  <ListItem>
                  <CardText style={{padding: 0}}
                      onTouchTap={this.openInNewTab.bind(this, `${companyWebsite}`)}
                  >
                    {this.renderSmallListLink(companyWebsite,
                    <Avatar
                        icon={<FontIcon className="material-icons">public</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                  </ListItem>
                ) : (null)}

                <CardText style={style.smallListItem}>
                  {this.renderSmallListItem('Available Immediately',
                  <Avatar
                      icon={<FontIcon className="material-icons">access_time</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
              </Card>
              <SkillsCard skills={categoryLinks} />
              {
                description ?
                <Card>
                  <CardText>
                    <div style={{display:'flex'}}>
                      <div style={{flex:'0 0 56px'}}>
                        <Avatar
                            icon={<FontIcon className="material-icons">stars</FontIcon>}
                            color={Styles.Colors.grey600}
                            backgroundColor={Styles.Colors.white}
                        />
                      </div>
                      <div style={{flex:'1', overflow:'hidden'}}>
                        <div style={style.title}>{'Job Description'}</div>
                        <div className="description">
                          <div dangerouslySetInnerHTML={{__html: description}} />
                        </div>
                      </div>
                    </div>
                  </CardText>
                </Card>
                : (null)
              }
              <Card>
                {culture?(
                  <CardText>
                    {this.renderBigListItem('Culture',culture,
                    <Avatar
                        icon={<FontIcon className="material-icons">face</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ):(<span></span>)}
                {benefits?(
                  <CardText>
                    {this.renderBigListItem('Benefits',benefits,
                    <Avatar
                        icon={<FontIcon className="material-icons">redeem</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ):(<span></span>)}
                {techstack?(
                  <CardText>
                    {this.renderBigListItem('Tech Stack',techstack,
                    <Avatar
                        icon={<FontIcon className="material-icons">storage</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ):(<span></span>)}
                {leadership?(
                  <CardText>
                    {this.renderBigListItem('Leadership',leadership,
                    <Avatar
                        icon={<FontIcon className="material-icons">stars</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ):(<span></span>)}
              </Card>
              {
                companyTwitter || companyFacebook || companyCrunchbase ?
                <Card>
                  <CardTitle title="Social" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
                  {(companyTwitter) ? (
                    <ListItem>
                    <CardText style={{padding: 0}}
                        onTouchTap={this.openInNewTab.bind(this, `https://twitter.com/${companyTwitter}`)}
                    >
                      {this.renderSmallListLink(
                      <span>Twitter: @{companyTwitter}</span>,
                      <Avatar
                          icon={<FontIcon className="fa fa-twitter-square" />}
                          color={Styles.Colors.grey600}
                          backgroundColor={Styles.Colors.white}
                      />)}
                    </CardText>
                    </ListItem>
                  ) : (null)}
                  {(companyFacebook) ? (
                    <ListItem>
                    <CardText style={{padding: 0}}
                        onTouchTap={this.openInNewTab.bind(this, `https://facebook.com/${companyFacebook}`)}
                    >
                      {this.renderSmallListLink(
                      <span>Facebook: @{companyFacebook}</span>,
                      <Avatar
                          icon={<FontIcon className="fa fa-facebook-square" />}
                          color={Styles.Colors.grey600}
                          backgroundColor={Styles.Colors.white}
                      />)}
                    </CardText>
                    </ListItem>
                  ) : (null)}
                  {(companyCrunchbase) ? (
                    <ListItem>
                    <CardText style={{padding: 0}}
                        onTouchTap={this.openInNewTab.bind(this, `${companyCrunchbase}`)}
                    >
                      {this.renderSmallListLink('Crunchbase',
                      <Avatar
                          icon={<FontIcon className="material-icons">public</FontIcon>}
                          color={Styles.Colors.grey600}
                          backgroundColor={Styles.Colors.white}
                      />)}
                    </CardText>
                    </ListItem>
                  ) : (null)}
                </Card>
                : (null)
              }
              {
                talentAdvocate ?
                <Card>
                  <CardTitle title="Hiring Contact" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
                  <CardText>
                    <div style={{display:'flex'}}>
                      <div style={{flex:'0 0 56px'}}>
                        <Avatar
                            icon={<FontIcon className="material-icons">verified_user</FontIcon>}
                            color={Styles.Colors.grey600}
                            backgroundColor={Styles.Colors.white}
                        />
                      </div>
                      {
                        <div style={{width: '100%', marginRight: '8px'}}>
                          <CardBasic
                              onTouchTap={this.openHiringContact.bind(this)}
                              image={<Gravatar email={talentAdvocate.get('email')} status={'notset'} style={{width: '40px'}}/>}
                              title= {<div style={{fontWeight: 'bold'}}>{talentAdvocate.get('displayName')}</div>}
                              subtitle1={talentAdvocateCompany && talentAdvocateCompany.get('name')}
                              subtitle2={talentAdvocate.get('title')}
                              rightContent={<CompanyAvatar style={{width:'40px'}} url={talentAdvocateCompany && talentAdvocateCompany.get('website')} />}
                          />
                        </div>
                      }
                    </div>
                  </CardText>
                </Card>
              : (null)
              }
            </div>
            {
              job.get('candidates') && job.get('candidates').size > 0 ?
              <div style={{minHeight:'800px'}}>
              <JobApplicantList
                  isHero={this.props.isHero}
                  candidates={job.get('candidates')}
                  favoriteContact={this.props.favoriteContact.bind(this)}
                  unfavoriteContact={this.props.unfavoriteContact.bind(this)}
                  editContact={this.props.editContact.bind(this)}
                  deleteCandidate={this.props.deleteCandidate.bind(this)}
                  editApplicantState={this.props.editApplicantState.bind(this)}
                  tab={this.props.tab}
              />
              </div>
              :
              <div style={{minHeight:'400px'}}>
              <NoResultsCard style={{margin: '8px', marginTop: '11px'}} title="No Applicants" text={'You don\'t have any applicants for this job.'} actionLabel="Add Applicant" action={this._onTouchAddCandidate.bind(this)} />
              </div>
            }
            {
              tabs.indexOf('Notes') > -1 ?
              <div style={{minHeight:'500px'}}>
              {
                job.get('notes') && job.get('notes').size > 0 ?
                <List subheader={`${job.get('notes').count()} Note${((job.get('notes').count() !== 1) ? ('s') : (''))}`}>
                  <CompanyNotesList editNote={this.editNote.bind(this)} deleteNote={this.deleteNote.bind(this)} notes={job.get('notes')}/>
                </List>
                :
                <NoResultsCard style={{margin: '8px', marginTop: '11px'}} title="No Notes" text={'You don\'t have any notes for this job.'} actionLabel="Add Note" action={this.createNoteModalOpen.bind(this)} />
              }
              </div>
              : (null)
            }

          </CustomTabsSwipe>
          <Confirm ref="confirm" />
        </div>
      );

    }
    else {
      return (<div></div>);
    }
  }

  render() {

    let { job } = this.props;
    if(job && job.get('show404')){
      return <NotFound />;
    }
    return (
      <div>
        {
          this.props.isHero ?
          <Header showHome transparent goBack={this.goBack.bind(this)} iconRight={
            <IconMenu iconButtonElement={
              <IconButton iconStyle={{color: Styles.Colors.white}} iconClassName="material-icons">more_vert</IconButton>
            }
            >
              <MenuItem onTouchTap={this._onTouchTapEdit.bind(this)} index={0} primaryText="Edit Job" />
              <MenuItem onTouchTap={this._onTouchAddCandidate.bind(this)} index={0} primaryText="Find Candidate" />
              <MenuItem index={0} onTouchTap={this.createNoteModalOpen.bind(this)} primaryText="Add Note" />
              <MenuItem index={0} onTouchTap={this.editSkills.bind(this)} primaryText={`Edit Skills`} />
              <MenuItem index={0} onTouchTap={this.viewPublic.bind(this)} primaryText={`View Public Job`} />
              <MenuItem index={0} onTouchTap={this.viewPrivate.bind(this)} primaryText={`View Private Job`} />

              <Divider />
              <MenuItem index={0} onTouchTap={this.deleteJob.bind(this)} primaryText={`Delete Job`} />
            </IconMenu>
          }
          />
        : (null)
        }
        {this.renderContent(job)}
        <ShareLinkModal url={this.state.shareUrl} open={this.state.openShareLinkModal} onClose={this._onCloseShareLinkModal.bind(this)} />
      </div>
    );
  }
}

JobDetails.propTypes = {
  job: React.PropTypes.object,
  onJobDetailsClose: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
};
