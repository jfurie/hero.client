import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Card, CardText, FontIcon, Divider, CardActions, Styles,Avatar } from 'material-ui';
import { CompanyAvatar, Gravatar, Tag, PhoneButton, EmailButton, FavoriteButton, ShareButton, CardBasic } from '../../../components/web';
let style = {
  layout:{
    display:'flex',
    alignItems: 'stretch',
    position:'relative',
  },
  layoutCompanyDetails:{
    position:'relative',
    paddingTop: '10px',
  },
  imageLayout:{
    flex:'0 0 56px',
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
  },
  plusAvatar: {
    display: 'inline',
    width: '20px',
    height: '20px',
    padding: '5px 6px 5px 5px',
    fontSize: '12px',
    position: 'relative',
    marginRight: '7px',
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

@connect(() => (
{}), {pushState})
export default class ClientListItem extends React.Component {
  constructor(props){
    super(props);
  }
  clickClient(){
    let {company} = this.props;
    this.props.onClientClick(company.get('id'));
  }

  clickClientAdvocate() {
    this.props.pushState(null, `/contacts/${this.props.company.get('clientAdvocateId')}`);
  }

  clickContacts() {
    this.props.pushState(null, `/clients/${this.props.company.get('id')}?tab=Contacts`);
  }

  _onTouchTapEmail() {
    let email = this.props.company.get('email');
    if(email){
      window.location.href=`mailto:${email}`;
    }
  }

  _onTouchTapShare() {
    let subject = `Check out ${this.props.company.get('name')} on HERO`;
    let body = encodeURIComponent(this.props.company.get('name')) +'%0A' + encodeURIComponent(window.location.href);
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }

  _onTouchTapSave() {
    let {company} = this.props;

    if (company.get('isFavorited')) {
      this.props.unfavoriteCompany(company);
    }
    else {
      this.props.favoriteCompany(company);
    }
  }

  renderBasic() {
    let {company} = this.props;

    let location = company.get('location') && company.get('location').get('city') ? (
      <span>
        <FontIcon style={style.icon} className="material-icons">location_on</FontIcon>
        {company.get('location').get('city')}
        , {company.get('location').get('countrySubDivisionCode')}
      </span>
    ) : (<span></span>);

    return (
      <CardBasic
          image={<CompanyAvatar style={{width:'40px'}} url={company && company.get('website')} />}
          title={company && company.get('name')}
          subtitle1={company.get('businessType') || 'Software Company'}
          subtitle2={location}
          onTouchTap={this.clickClient.bind(this)}
          rightContent={
            !this.props.hideRecruiter && company.get('clientAdvocate')?
            (<div onClick={this.clickClientAdvocate.bind(this)}>
              <Gravatar
                  email={company.get('clientAdvocate').get('email')}
                  status={'notset'} style={style.accountOwnerGravatar}
                  label={company.get('clientAdvocate').get('displayName')}
                  tooltipPosition="right"
              />
            </div>):(<div></div>)
          }
      />
    );
  }

  renderTags() {
    let {company} = this.props;

    return (
      <div style={style.badgeWrap}>
      {company.get('tags') && company.get('tags').map(function(tag, i){
        if(i <=3){
          return (
            <Tag key={i} value={tag} />
          );
        }
        return (
          <span key={i}></span>
        );
      })}
    </div>);
  }

  render(){
    let {company, type} = this.props;

    if (company) {

      let contacts = company.get('contacts');
      contacts = contacts || new Immutable.List();
      let peopleList = [];

      let limit = contacts.count();

      if (contacts.count() > 4) {
        limit = 2;
      }

      contacts.forEach(function(c, key) {
        if (key < limit) {
          peopleList.push(<Gravatar
            style={style.gravatar}
            key={key}
            email={c.get('email')}
            status={'notset'}
            label={c.get('displayName')}
            tooltipPosition="left"
          />);
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
        type == 'tiny' ? (<div>{this.renderTags()}{this.renderBasic()}</div>) :
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
            {type !=='mini'?(this.renderTags()):(<div></div>)}
              {this.renderBasic()}
              {type !== 'mini'? (
                <div>
                  <Divider style={{marginTop:'8px'}} />
                  <div style={{marginLeft:'0.5rem', marginRight:'0.5rem'}} >
                    <div onClick={this.clickContacts.bind(this)} className="row between-xs" style={style.layoutCompanyDetails}>
                      <div style={style.contactsLayout} >
                        {secondaryText}
                      </div>
                      <div style={{marginTop:'0px', textAlign: 'right'}}>
                        <FontIcon style={style.status} className="material-icons">assignment</FontIcon>
                        {company.get('stats') && company.get('stats').get('jobCount')|| 0}
                        <FontIcon style={style.status} className="material-icons">assignment_ind</FontIcon>
                        {company.get('stats') && company.get('stats').get('candidateCount')|| 0}
                        <FontIcon style={style.statusRed} className="material-icons">assignment_late</FontIcon>
                        {company.get('stats') && company.get('stats').get('actionsCount')|| 0}
                        <FontIcon style={style.statusGreen} className="material-icons">assignment_turned_in</FontIcon>
                        {company.get('stats') && company.get('stats').get('hiredCount')|| 0}
                      </div>
                    </div>
                  </div>
                </div>
              ):(<div></div>)}
          </CardText>
          {type !== 'mini'?(<div>
            <CardActions style={{
              backgroundColor:'rgba(100,100,100,0.2)',
              padding: 0,
            }}
            >
              <PhoneButton phone={this.props.company && this.props.company.get('phone')} />
              <EmailButton email={this.props.company && this.props.company.get('email')} />
              <FavoriteButton isFavorited={company.get('isFavorited')} onTouchTap={this._onTouchTapSave.bind(this)} />
              <ShareButton />
            </CardActions>
          </div>):(<div></div>)}

        </Card>
      );
    } else {
      return (<div></div>);
    }
  }
}
