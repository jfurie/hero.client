import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import marked from 'marked';
import { CardTitle } from 'material-ui';
import defaultImage from './publicJob.jpg';
import {ShareLinkModal, SkillsCard, LocationCard, PublicHeader, DetailsCard, Gravatar, CompanyAvatar, CardBasic, MarkedViewer } from '../../../components/web';
import {ListItem, IconMenu, MenuItem, RaisedButton, FontIcon, Styles, Card, CardText, Avatar, IconButton } from 'material-ui';
import './publicJob.scss';

const style = {
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
export default class PublicJob extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      justInvited: false,
      confirmOpen: false,
    };
  }

  openInNewTab(url) {
    window.open(url);
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
              <MarkedViewer value={content} />
            </div>
          </div>
          :
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={style.title}>{title}</div>
          </div>
        }

      </div>
    );
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

  renderContent(job) {
    if (job) {
      // cover
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

      // actions
      let isHot = false;

      if (job.get('tags')) {
        isHot = job.get('tags').indexOf('HOT!') > -1;
      }

      let actions = [{
        materialIcon: 'phone',
        text: 'Call',
        onTouchTap: this.props.apply.bind(this),
      }, {
        materialIcon: 'star_rate',
        text: 'Save',
        onTouchTap: this.props.apply.bind(this),
      }, {
        materialIcon: 'email',
        text: 'Apply',
        active: isHot,
        onTouchTap: this.props.apply.bind(this),
      }, {
        materialIcon: 'share',
        text: 'Share',
        onTouchTap: this.props.share.bind(this),
      }];

      // company
      let companyName;
      let companyWebsite;
      let companyTwitter;
      let companyFacebook;
      let companyCrunchbase;

      let company = job.get('company');
      let talentAdvocate = job.get('talentAdvocate');
      let talentAdvocateCompany;

      if (company) {
        companyName = company.get('name');
        companyWebsite = company.get('website');
        companyTwitter = company.get('twitterHandle');
        companyFacebook = company.get('facebookHandle');
        companyCrunchbase = company.get('crunchbase');

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

      let categoryLinks =job.get('_categoryLinks');
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
              avatar={<CompanyAvatar style={{width: '95px'}} url={companyWebsite}/>}
              floatActionOnTap={this.props.apply.bind(this)}
              floatActionButtonColor={Styles.Colors.green500}
              floatActionContent={<FontIcon className="material-icons">check</FontIcon>}
              floatActionLabel={'Click to Apply'}
          />
          <div>
            <Card>
              <CardText>
                {this.renderBigListItem('Company Mission',company.get('productSolution'),
                <Avatar
                    icon={<FontIcon className="material-icons">store</FontIcon>}
                    color={Styles.Colors.grey600}
                    backgroundColor={Styles.Colors.white}
                />)}
              </CardText>
            </Card>
            <LocationCard location={job.get('location')} maskLocation zoom={11} />
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
                    <div style={{width: '100%', marginRight: '8px'}}>
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
              {company.get('culture')?(
                <CardText>
                  {this.renderBigListItem('Culture',company.get('culture'),
                  <Avatar
                      icon={<FontIcon className="material-icons">face</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
              ):(<span></span>)}
              {company.get('benefits')?(
                <CardText>
                  {this.renderBigListItem('Benefits',company.get('benefits'),
                  <Avatar
                      icon={<FontIcon className="material-icons">redeem</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
              ):(<span></span>)}
              {company.get('techstack')?(
                <CardText>
                  {this.renderBigListItem('Tech Stack',company.get('techstack'),
                  <Avatar
                      icon={<FontIcon className="material-icons">storage</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
              ):(<span></span>)}
              {company.get('leadership')?(
                <CardText>
                  {this.renderBigListItem('Leadership',company.get('leadership'),
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
                            image={<Gravatar url={talentAdvocate.get('avatarImage') && talentAdvocate.get('avatarImage').get('item')} email={talentAdvocate.get('email')} status={'notset'} style={{width: '40px'}}/>}
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
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        <div style={{padding: '16px 24px', textAlign: 'center', backgroundColor: '#212121'}}>
          <RaisedButton label="Apply Now" primary style={{}} onTouchTap={this.props.apply.bind(this)} />
        </div>
        </div>
      );

    }
    else {
      return (<div></div>);
    }
  }
  _onTouchTapEdit(){
    this.props.pushState(null,`/clients/${this.props.job.get('companyId')}/jobs/${this.props.job.get('id')}/edit?returnUrl=${`/j/${this.props.job.get('shortId')}/${cleanTitle(this.props.job.get('title'))}`}`);
  }
  _onTouchAddCandidate(){
    this.props.pushState(null,`/clients/${this.props.job.get('companyId')}/jobs/${this.props.job.get('id')}/candidates/search`);
  }
  editSkills(){
    this.props.pushState(null, `/jobs/${this.props.job.get('id')}/categories/edit`);
  }
  viewLoggedIn(){
    this.props.pushState(null, `/jobs/${this.props.job.get('id')}`);
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

  render() {
    let iconStyle = {
      color: Styles.Colors.white,
    };
    let iconRight = (
      <span>
        <IconButton iconStyle={iconStyle} onTouchTap={this.props.apply.bind(this)} iconClassName="material-icons">search</IconButton>
        <IconButton iconStyle={iconStyle} onTouchTap={this.props.apply.bind(this)} iconClassName="material-icons">menu</IconButton>
      </span>
    );
    if(this.props.authToken && this.props.authToken.get('id')){
      iconRight = (
        <span>
          <IconButton iconStyle={iconStyle} onTouchTap={this.props.apply.bind(this)} iconClassName="material-icons">search</IconButton>
          <IconMenu iconButtonElement={
            <IconButton iconStyle={{color: Styles.Colors.white}} iconClassName="material-icons">more_vert</IconButton>
          }
          >
            <MenuItem onTouchTap={this._onTouchTapEdit.bind(this)} index={0} primaryText="Edit Job" />
            <MenuItem onTouchTap={this._onTouchAddCandidate.bind(this)} index={0} primaryText="Find Candidate" />
            <MenuItem index={0} onTouchTap={this.editSkills.bind(this)} primaryText={`Edit Skills`} />
            <MenuItem index={0} onTouchTap={this.viewLoggedIn.bind(this)} primaryText={`View Job in App`} />
            {
              this.props.token ?
              <MenuItem index={0} onTouchTap={this.viewPublic.bind(this)} primaryText={`View Public Job`} />
              :
              <MenuItem index={0} onTouchTap={this.viewPrivate.bind(this)} primaryText={`View Private Job`} />
            }
          </IconMenu>
        </span>
      );
    }
    let { job } = this.props;
    return (
      <div>
        <PublicHeader iconRight={iconRight} onTouchTap={this.props.apply.bind(this)} />
        {this.renderContent(job)}
        <ShareLinkModal url={this.props.shareUrl} open={this.props.openShareLinkModal} onClose={this.props.closeShare.bind(this)} />
      </div>
    );
  }
}

PublicJob.propTypes = {
  job: React.PropTypes.object,
  onJobDetailsClose: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
};
