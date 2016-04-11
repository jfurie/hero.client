import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import categoryLinkSort from '../../../utils/categoryLinkSort';
import { Card, CardText, FontIcon, Divider, CardActions, Styles,Avatar } from 'material-ui';
import { ShareLinkModal, CompanyAvatar, Gravatar, Tag, FindButton, FavoriteButton, ShareButton, CardBasic } from '../../../components/web';
let style = {
  layout:{
    display:'flex',
    alignItems: 'stretch',
    position:'relative',
  },
  layoutJobDetails:{
    position:'relative',
  },
  contactsLayout:{
    flex:'0 0 150px',
    marginTop:'8px',
  },
  starLayout:{
    flex:'0 0 150px',
  },
  title:{
    color: 'rgba(0, 0, 0, 0.870588)',
    fontSize: '16px',
    lineHeight: '16px',
  },
  subtitle:{
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '14px',
    lineHeight: '18px',
  },
  icon:{
    fontSize:'14px',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  badge:{
    fontSize:'14px',
    lineHeight: '18px',
    color: 'rgba(255, 255, 255, 1.00)',
    backgroundColor:'#E91B62',
    borderRadius:'6px',
    display:'inline-block',
    padding:'0px 16px',
    marginBottom:'8px',
    height:'18px',
  },
  starOn:{
    color:'#F5A623',
    fontSize:'22px',
    width:'22px',
  },
  status:{
    color:'#4A4A4A',
    fontSize:'14px',
    width:'14px',
    top:'2px',
    marginLeft:'8px',
  },
  statusRed:{
    color: Styles.Colors.red500,
    fontSize:'14px',
    width:'14px',
    top:'2px',
    marginLeft:'8px',
  },
  statusGreen:{
    color: Styles.Colors.green500,
    fontSize:'14px',
    width:'14px',
    top:'2px',
    marginLeft:'8px',
  },
  gravatar: {
    display: 'inline',
    width: '20px',
    height: '20px',
    container: {
      display: 'inline',
      position: 'relative',
      marginRight: 0,
      marginLeft: '7px',
    },
  },
  plusAvatar: {
    display: 'inline',
    width: '20px',
    height: '20px',
    padding: '5px 6px 5px 5px',
    fontSize: '12px',
    position: 'relative',
    marginLeft: '7px',
    top: '-8px',
    lineHeight: 0,
  },
  accountOwnerGravatar:{
    display: 'inline',
    width: '25px',
    height: '25px',
    container:{
      top:'9px',
      display: 'inline',
      position: 'relative',
      marginRight: '7px',
    },

  },
};

function cleanTitle(title){
  return title.replace(/[^A-Za-z0-9_\.~]+/gm, '-');
}

@connect((state) =>
{
  return {categories: state.categories.list};
}, {pushState})
export default class JobListItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      openShareLinkModal: false,
    };
  }
  clickJob(){
    let {job} = this.props;
    this.props.onJobClick(job);
  }

  clickTalentAdvocate() {
    this.props.pushState(null, `/contacts/${this.props.job.get('talentAdvocateId')}`);
  }

  clickApplicants() {
    this.props.pushState(null, `/jobs/${this.props.job.get('id')}?tab=Applicants`);
  }

  _onTouchTapEmail() {
    let email = this.props.job.get('email');
    if(email){
      window.location.href=`mailto:${email}`;
    }
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

  _onTouchTapSave() {
    let {job} = this.props;

    if (job.get('isFavorited')) {
      this.props.unfavoriteJob(job);
    }
    else {
      this.props.favoriteJob(job);
    }
  }

  render(){
    let self = this;
    let {job,type} = this.props;

    let candidates = job.get('candidates');
    candidates = candidates || new Immutable.List();
    let peopleList = [];

    let limit = candidates.count();

    if (candidates.count() > 4) {
      limit = 2;
    }

    candidates.forEach(function(c, key) {
      if ((key < limit) && c.get('contact')) {
        peopleList.push(
        <Gravatar
          style={style.gravatar}
          key={key} email={c.get('contact').get('email')}
          status={'notset'}
          label={c.get('contact').get('displayName')}
          tooltipPosition="right"
        />);
      }
    });

    // add a + circle if needed
    if (limit < candidates.count()) {
      peopleList.push(<Avatar style={style.plusAvatar} key={limit} color="#FF1564" backgroundColor={Styles.Colors.grey300}>+{candidates.count() - limit}</Avatar>);
    }

    let candidatesElm = (<div></div>);
    if (peopleList.length > 0) {
      candidatesElm = (<div>{peopleList}</div>);
    }

    let location = job.get('location') && job.get('location').get('city') ? (
      <span>
        <FontIcon style={style.icon} className="material-icons">location_on</FontIcon>
        {job.get('location').get('city')}
        , {job.get('location').get('countrySubDivisionCode')}
      </span>
    ) : (<span></span>);
    function kFormatter(num) {
      return num > 999 ? `${(num/1000).toFixed(0)}k` : num;
    }
    let salary;
    if (job.get('minSalary') && job.get('maxSalary')) {
      salary = (<span>${kFormatter(job.get('minSalary'))} - {kFormatter(job.get('maxSalary'))}</span>);
    }
    else if (job.get('minSalary')) {
      salary = (<span>${kFormatter(job.get('minSalary'))}</span>);
    }
    else if (job.get('maxSalary')) {
      salary = (<span>{kFormatter(job.get('maxSalary'))}</span>);
    }
    else {
      salary = (<span>No Salary Info</span>);
    }
    let categoryLinks = job.get('_categoryLinks');
    let jobImg = <span></span>;
    if(categoryLinks && categoryLinks.size > 0){
      let sorted = categoryLinks.sort(categoryLinkSort);

      let currentCategory = sorted.get(0);
      if(currentCategory.get('experience') > 0){
        let found = self.props.categories.find(x=>x.get('id') == currentCategory.get('categoryId'));
        if(found){
          jobImg = <img style={{width: '40px', height: '40px'}} src={found.get('imageUrl')} />;
        }
      }
    }

    let isHot = false;
    let isInterviewing = false;

    if (job.get('tags')) {
      isHot = job.get('tags').indexOf('HOT!') > -1;
      isInterviewing = job.get('tags').indexOf('Interviewing') > -1;
    }
    return (
      <div>
      <Card
          style={{
            height: type !=='mini'?'auto':'80px',
            marginBottom:'8px',
            marginLeft:'8px',
            marginRight:'8px',
          }}
      >
        <CardText
            style={{
              height: type !=='mini'?'auto':'auto',
            }}
        >
          {type !=='mini'?(<div>
            <div>
              <div className="row between-xs" style={style.badgeWrap}>
              <div style={{textAlign: 'left'}}>
                {isHot?
                <Tag value={'HOT!'} />
                :<span></span>
                }
                {isInterviewing?
                <Tag value={'Interviewing'} color={'green'}/>
                :<span></span>
                }
              </div>
              <div style={{textAlign: 'right'}}>
                <Tag value={job.get('jobType') || 'Permanent'} color={'green'} fixedWidth={75}/>
              </div>
              </div>
            </div>
          </div>):(<div></div>)}
            <CardBasic
                image={<CompanyAvatar style={{width:'40px'}} url={job.get('company')&&job.get('company').get('website')} />}
                title= {<div style={{fontWeight: 'bold'}}>{job.get('title')}</div>}
                subtitle1={job.get('company')&&job.get('company').get('name')}
                subtitle2={<span>{job.get('department')?job.get('department'):'Tech'} Department</span>}
                onTouchTap={this.clickJob.bind(this)}
                rightContent={
                  job.get('talentAdvocate')?(<div onClick={this.clickTalentAdvocate.bind(this)}>
                    <Gravatar
                        email={job.get('talentAdvocate').get('email')}
                        status={'notset'}
                        style={style.accountOwnerGravatar}
                        label={job.get('talentAdvocate').get('displayName')}
                        tooltipPosition="right"
                    />

                  </div>):(<div></div>)
                }
            />
            {type !== 'mini'?
            (<div>
              <Divider style={{marginTop:'8px'}} />
              <div style={{marginLeft:'0.5rem', marginRight:'0.5rem'}} >
                <div className="row" style={{display:'flex', alignItems: 'stretch', position:'relative', marginTop: '10px'}}>
                  <div style={{flex:'0 0 50px'}}>
                    {jobImg}
                  </div>
                  <div style={{minHeight:'43px'}}>
                    <div style={{fontWeight: 'bold'}}>
                      {salary}
                    </div>
                    <div style={{marginTop: '8px', color: 'rgba(0, 0, 0, 0.54)'}}>
                      {location}
                    </div>
                  </div>
                  <div>
                  <div onClick={this.clickApplicants.bind(this)} style={{marginTop:'0px', position:'absolute', bottom: 0, right: 0, textAlign: 'right'}}>
                      <div>{candidatesElm}</div>
                      <div>
                        <FontIcon style={style.status} className="material-icons">assignment</FontIcon>
                        {job.get('positionCount')|| 0}
                        <FontIcon style={style.status} className="material-icons">assignment_ind</FontIcon>
                        {job.get('stats') && job.get('stats').get('candidateCount')|| 0}
                        <FontIcon style={style.statusRed} className="material-icons">assignment_late</FontIcon>
                        {job.get('stats') && job.get('stats').get('actionsCount')|| 0}
                        <FontIcon style={style.statusGreen} className="material-icons">assignment_turned_in</FontIcon>
                        {job.get('stats') && job.get('stats').get('hiredCount')|| 0}
                      </div>
                  </div>

                </div>
              </div>
            </div>
            </div>
            )
            :(<div>
            </div>)
            }

        </CardText>
        {type !== 'mini'?(<div>
          <CardActions style={{
            backgroundColor:'rgba(100,100,100,0.2)',
            padding: 0,
          }}
          >
            <FindButton />
            <FavoriteButton isFavorited={job.get('isFavorited')} onTouchTap={this._onTouchTapSave.bind(this)} />
            <ShareButton onTouchTap={this._onTouchTapShare.bind(this)} />
          </CardActions>
        </div>):(<div></div>)}

      </Card>
      <ShareLinkModal url={this.state.shareUrl} open={this.state.openShareLinkModal} onClose={this._onCloseShareLinkModal.bind(this)} />
      </div>
    );
  }
}
