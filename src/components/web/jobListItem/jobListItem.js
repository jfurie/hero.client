import React from 'react';
import Immutable from 'immutable';
import { Card, CardText, FontIcon, Divider, CardActions, Styles,Avatar } from 'material-ui';
import { CompanyAvatar, Gravatar, Tag, FindButton, FavoriteButton, ShareButton, CardBasic } from '../../../components/web';
let style = {
  layout:{
    display:'flex',
    alignItems: 'stretch',
    position:'relative',
  },
  layoutJobDetails:{
    position:'relative',
  },
  imageLayout:{
    flex:'0 0 56px',
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
    height:'18px'
  },
  starOn:{
    color:'#F5A623',
    fontSize:'22px',
    width:'22px'
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
    width: '30px',
    height: '30px',
  },
  plusAvatar: {
    display: 'inline',
    width: '30px',
    height: '30px',
    padding: '7px 8px 7px 7px',
    fontSize: '16px',
    position: 'relative',
    top: '-11px',
  },
  badgeWrap:{
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

export default class JobListItem extends React.Component {
  constructor(props){
    super(props);
  }
  clickJob(){
    let {job} = this.props;
    this.props.onJobClick(job);
  }


  _onTouchTapEmail() {
    let email = this.props.job.get('email');
    if(email){
      window.location.href=`mailto:${email}`;
    }
  }

  _onTouchTapShare() {
    let subject = 'Check out '+ this.props.job.get('name')+ ' on HERO';
    let body = encodeURIComponent(this.props.job.get('name')) +'%0A' + encodeURIComponent(window.location.href);
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }
  render(){
    let {job,type} = this.props;

    let candidates = job.get('candidates');
    candidates = candidates || new Immutable.List();
    let peopleList = [];

    let limit = candidates.count();

    if (candidates.count() > 4) {
      limit = 2;
    }

    candidates.forEach(function(c, key) {
      if (key < limit) {
        peopleList.push(<Gravatar style={style.gravatar} key={key} email={c.get('email')} status={'notset'}/>);
      }
    });

    // add a + circle if needed
    if (limit < candidates.count()) {
      peopleList.push(<Avatar style={style.plusAvatar} key={limit} color="#FF1564" backgroundColor={Styles.Colors.grey300}>+{candidates.count() - limit}</Avatar>);
    }

    let candidatesElm = (<div>No Candidates Yet</div>);
    if (peopleList.length > 0) {
      candidatesElm = (<div style={style.peopleList}>{peopleList}</div>);
    }
    let department = 'Tech Department';
    let location = job.get('location') && job.get('location').get('city') ? (
      <span>
        <FontIcon style={style.icon} className="material-icons">location_on</FontIcon>
        {job.get('location').get('city') }
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

    let jobImg = <img style={{width: '40px', height: '40px'}} src='http://www.w3devcampus.com/wp-content/uploads/logoAndOther/logo_JavaScript.png' />;

    let isHot = false;
    let isInterviewing = false;

    if (job.get('tags')) {
      isHot = job.get('tags').indexOf('HOT!') > -1;
      isInterviewing = job.get('tags').indexOf('Interviewing') > -1;
    }

    return (
      <Card
        style={{
          height: type !=='mini'?'auto':'80px',
          marginBottom:'8px',
          marginLeft:'8px',
          marginRight:'8px',
        }}>
        <CardText
          style={{
            height: type !=='mini'?'auto':'auto'
          }}>
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
                {job.get('employmentType')?
                <Tag value={job.get('employmentType')} color={'green'} />
                :<span></span>
                }
              </div>
              </div>
            </div>
          </div>):(<div></div>)}
            <CardBasic
                image={<CompanyAvatar style={{width:'40px'}} url={job.get('company').get('website')} />}
                title= {<div style={{fontWeight: 'bold'}}>{job.get('title')}</div>}
                subtitle1={job.get('company').get('name')}
                subtitle2={<span>{job.get('department')?job.get('department'):'Tech'} Department</span>}
                onTouchTap={this.clickJob.bind(this)}
              ></CardBasic>
            {type !== 'mini'?
            (<div>
              <Divider style={{marginTop:'8px'}}></Divider>
              <div style={{marginLeft:'0.5rem', marginRight:'0.5rem'}} >
                <div className="row" style={{display:'flex', alignItems: 'stretch', position:'relative', marginTop: '15px'}}>
                  <div style={{flex:'0 0 56px'}}>
                    {jobImg}
                  </div>
                  <div>
                    <div style={{fontWeight: 'bold'}}>
                      {salary}
                    </div>
                    <div style={{marginTop: '8px', color: 'rgba(0, 0, 0, 0.54)'}}>
                      {location}
                    </div>
                  </div>
                  <div>
                  <div style={{lineHeight:'25px', marginTop:'0px', position:'absolute', bottom: '-7px', right: 0}}>
                      {job.get('talentAdvocate')?(<div>
                        <Gravatar url={job.get('talentAdvocate').get('email')} status={'notset'} style={style.accountOwnerGravatar}></Gravatar> <div style={{display:'inline-block',lineHeight:'25px'}}>{job.get('talentAdvocate').get('displayName')}</div>
                      </div>):(<div></div>)}
                      <div style={{marginTop:'5px'}}>

                        <FontIcon style={style.status} className="material-icons">assignment</FontIcon>
                        {job.get('positionCount')|| 0}
                        <FontIcon style={style.status} className="material-icons">assignment_ind</FontIcon>
                        { job.get('stats') && job.get('stats').get('candidateCount')|| 0}
                        <FontIcon style={style.statusRed} className="material-icons">assignment_late</FontIcon>
                        {job.get('stats') && job.get('stats').get('actionsCount')|| 0}
                        <FontIcon style={style.statusGreen} className="material-icons">assignment_turned_in</FontIcon>
                        {job.get('stats') && job.get('stats').get('hiredCount')|| 0}
                      </div>
                  </div>

                </div>
              </div>
            </div>
            <Divider style={{marginTop:'8px'}}></Divider>
            <div style={{marginLeft:'0.5rem', marginRight:'0.5rem'}} >
            <div className="row between-xs" style={style.layoutJobDetails}>
            <div></div>
            <div>
              <div style={{marginTop: '10px'}}>
                {candidatesElm}
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
            boxShadow:'inset 0 1px 6px rgba(0, 0, 0, 0.24)'

          }}>
            <FindButton />
            <FavoriteButton />
            <ShareButton />
          </CardActions>
        </div>):(<div></div>)}

      </Card>
    );
  }
}
