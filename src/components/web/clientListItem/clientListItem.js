import React from 'react';
import Immutable from 'immutable';
import { Card, CardText, FontIcon, Divider, IconButton,CardActions, Styles,Avatar } from 'material-ui';
import { CompanyAvatar, Gravatar, Stars } from '../../../components/web';
let style = {
  layout:{
    display:'flex',
    alignItems: 'stretch',
    position:'relative',
  },
  layoutCompanyDetails:{
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

class PhoneButton extends React.Component {
  _onTouchTapCall() {
    window.location.href='tel:'+this.props.phone;
  }
  render(){
    if(this.props.phone){
      return (
        <IconButton onTouchTap={this._onTouchTapCall.bind(this)} iconStyle={{color:'#4A4A4A'}} tooltipPosition="top-center" tooltip="Call">
          <FontIcon style={{width:'24px'}} className="material-icons">phone</FontIcon>
        </IconButton>
      );
    } else {
      return (<span></span>);
    }
  }
}
class EmailButton extends React.Component {
  _onTouchTapEmail() {
    let email = this.props.email;
    if(email){
      window.location.href=`mailto:${email}`;
    }
  }
  render(){
    if(this.props.email){
      return (
        <IconButton onTouchTap={this._onTouchTapEmail.bind(this)} iconStyle={{color:'#4A4A4A'}} tooltipPosition="top-center" tooltip="Email">
          <FontIcon style={{width:'24px'}} className="material-icons">email</FontIcon>
        </IconButton>
      );
    } else {
      return (<span></span>);
    }
  }
}

class FavoriteButton extends React.Component {
  render(){
    return (
      <IconButton iconStyle={{color:'#4A4A4A'}} tooltipPosition="top-center" tooltip="Star">
        <FontIcon style={{width:'24px'}} className="material-icons">star_rate</FontIcon>
      </IconButton>
    );
  }
}
class ShareButton extends React.Component {
  _onTouchTapShare() {
    let subject = 'Check out '+ this.props.company.get('name')+ ' on HERO';
    let body = encodeURIComponent(this.props.company.get('name')) +'%0A' + encodeURIComponent(window.location.href);
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }
  render(){
    return (
      <IconButton onTouchTap={this._onTouchTapShare.bind(this)} iconStyle={{color:'#4A4A4A'}} tooltipPosition="top-center" tooltip="Share">
        <FontIcon style={{width:'24px'}} className="material-icons">share</FontIcon>
      </IconButton>
    );
  }
}

export default class ClientListItem extends React.Component {
  constructor(props){
    super(props);
  }
  clickClient(){
    let {company} = this.props;
    this.props.onClientClick(company.get('id'));
  }


  _onTouchTapEmail() {
    let email = this.props.company.get('email');
    if(email){
      window.location.href=`mailto:${email}`;
    }
  }

  _onTouchTapShare() {
    let subject = 'Check out '+ this.props.company.get('name')+ ' on HERO';
    let body = encodeURIComponent(this.props.company.get('name')) +'%0A' + encodeURIComponent(window.location.href);
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }
  render(){
    let {company, type} = this.props;

    let contacts = company.get('contacts');
    contacts = contacts || new Immutable.List();
    let peopleList = [];

    let limit = contacts.count();

    if (contacts.count() > 4) {
      limit = 2;
    }

    contacts.forEach(function(c, key) {
      if (key < limit) {
        peopleList.push(<Gravatar style={style.gravatar} key={key} email={c.get('email')} status={'notset'}/>);
      }
    });

    // add a + circle if needed
    if (limit < contacts.count()) {
      peopleList.push(<Avatar style={style.plusAvatar} key={limit} color="#FF1564" backgroundColor={Styles.Colors.grey300}>+{contacts.count() - limit}</Avatar>);
    }

    let secondaryText = (<div>No Contacts Yet</div>);
    if (peopleList.length > 0) {
      secondaryText = (<div style={style.peopleList}>{peopleList}</div>);
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
              <div style={style.badgeWrap}>
                {company.get('tags') && company.get('tags').map(function(tag, i){
                  if(i <=3){
                    return (
                      <span style={style.badge} >{tag}!</span>
                    );
                  }
                  return (
                    <span></span>
                  );
                })}
              </div>
            </div>
          </div>):(<div></div>)}

            <div onTouchTap={this.clickClient.bind(this)} style={style.layout}>


                <div style={style.imageLayout}>
                  <CompanyAvatar style={{width:'40px'}} url={company && company.get('website')} />
                </div>
                <div>
                  <div style={style.title}>
                      {company && company.get('name')}
                  </div>
                  <div style={style.subtitle}>
                      {company.get('businessType')|| 'Company'}
                  </div>
                  <div style={style.subtitle}>
                      <FontIcon style={style.icon} className="material-icons">location_on</FontIcon>
                        {company.get('location')&& company.get('location').get('city') }
                        , {company.get('location')&& company.get('location').get('countrySubDivisionCode')}

                  </div>

                </div>
                <div style={{position: 'absolute', bottom:'0', right:'0'}}>
                  <Stars score={company.get('rating')}></Stars>
                </div>
            </div>
            {type !== 'mini'?
            (<div>
              <Divider style={{marginTop:'8px'}}></Divider>
              <div style={{marginLeft:'0.5rem', marginRight:'0.5rem'}} >
                <div className="row between-xs" style={style.layoutCompanyDetails}>
                  <div style={style.contactsLayout} >
                    {secondaryText}
                  </div>
                  <div>
                  <div style={{lineHeight:'25px', marginTop:'0px', textAlign:'right'}}>
                      {company.get('clientAdvocate')?(<div>
                        <Gravatar url={company.get('clientAdvocate').get('email')} status={'notset'} style={style.accountOwnerGravatar}></Gravatar> <div style={{display:'inline-block',lineHeight:'25px'}}>{company.get('clientAdvocate').get('displayName')}</div>
                      </div>):(<div></div>)}
                      <div style={{marginTop:'8px'}}>

                        <FontIcon style={style.status} className="material-icons">assignment</FontIcon>
                        {company.get('stats') && company.get('stats').get('jobCount')|| 0}
                        <FontIcon style={style.status} className="material-icons">assignment_ui</FontIcon>
                        { company.get('stats') && company.get('stats').get('candidateCount')|| 0}
                        <FontIcon style={style.statusRed} className="material-icons">assignment_late</FontIcon>
                        {company.get('stats') && company.get('stats').get('actionsCount')|| 0}
                        <FontIcon style={style.statusGreen} className="material-icons">assignment_turned_in</FontIcon>
                        {company.get('stats') && company.get('stats').get('hiredCount')|| 0}
                      </div>
                  </div>

                </div>
              </div>
            </div>
            </div>)
            :(<div>
            </div>)
            }

        </CardText>
        {type !== 'mini'?(<div>
          <CardActions style={{
            backgroundColor:'rgba(74,144,226,0.5)',
            boxShadow:'inset 0 1px 6px rgba(0, 0, 0, 0.24)'

          }}>
            <PhoneButton phone={this.props.company && this.props.company.get('phone')} />
            <EmailButton email={this.props.company && this.props.company.get('email')} />
            <FavoriteButton />
            <ShareButton />
          </CardActions>
        </div>):(<div></div>)}

      </Card>
    );
  }
}
