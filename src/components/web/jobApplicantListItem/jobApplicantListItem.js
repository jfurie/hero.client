import React from 'react';
import { Card, CardText, FontIcon, Divider, CardActions, Styles,Avatar, IconButton } from 'material-ui';
import { Gravatar, Tag, FavoriteButton, Stars, PhoneButton, SmsButton, EmailButton} from '../../../components/web';
import md5 from 'md5';

let style = {
  cardBasic: {
    avatar: {
      border: '2px solid',
      borderColor: Styles.Colors.grey500,
    },
    layout:{
      display:'flex',
      alignItems: 'stretch',
      position:'relative',
    },
    imageLayout:{
      flex:'0 0 56px',
      height: '50px',
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
      fontWeight: 'bold',
      textAlign: 'left',
    },
    subtitle:{
      color: 'rgba(0, 0, 0, 0.54)',
      fontSize: '14px',
      lineHeight: '18px',
      textAlign: 'left',
    },
  },
  layout:{
    display:'flex',
    alignItems: 'stretch',
    position:'relative',
  },
  layoutContactDetails:{
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
    position: 'relative',
    left: '10px',
    textAlign: 'left',
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

export default class JobApplicantListItem extends React.Component {
  constructor(props){
    super(props);
  }

  clickName(){
    let {contact} = this.props;
    this.props.onContactClick(contact);
  }

  clickAvatar(){
    let {contact} = this.props;
    this.props.select(contact);
  }

  _onTouchTapEmail() {
    let email = this.props.contact.get('email');
    if(email){
      window.location.href=`mailto:${email}`;
    }
  }

  _onTouchTapShare() {
    let subject = 'Check out '+ this.props.contact.get('name')+ ' on HERO';
    let body = encodeURIComponent(this.props.contact.get('name')) +'%0A' + encodeURIComponent(window.location.href);
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }

  _onTouchTapSave() {
    let {contact} = this.props;

    if (contact.get('isFavorited')) {
      this.props.unfavoriteContact(contact);
    }
    else {
      this.props.favoriteContact(contact);
    }
  }

  _onTouchTapCheck() {
    let {contact} = this.props;

    if (contact.get('isVetted')) {
      this.props.unvetContact(contact);
    }
    else {
      this.props.vetContact(contact);
    }
  }

  _onTouchTapDelete() {
    let {contact} = this.props;

    this.props.deleteContact(contact);
  }

  renderBasic() {
    let {contact, company, selected, selecting} = this.props;

    let emailHash = '00000000000000000000000000000000';

    if (contact.get('email')) {
      emailHash = md5(contact.get('email'));
    }

    let avatarSrc = `https://www.gravatar.com/avatar/${emailHash}?d=mm`;

    return (
      <div style={style.cardBasic.layout}>
        <div onClick={this.clickAvatar.bind(this)} style={style.cardBasic.imageLayout}>
          {
            selected ?
            <Avatar
                style={style.cardBasic.avatar}
                icon={<FontIcon className="material-icons">check</FontIcon>}
                color="#fff"
                backgroundColor={Styles.Colors.grey500}
            />
            :
            selecting ?
            <Avatar
                style={style.cardBasic.avatar}
                color="#fff"
                backgroundColor="#fff"
            />
            :
            <Avatar
                style={style.cardBasic.avatar}
                src={avatarSrc}
                size={42}
            />
          }
        </div>
        <div onClick={this.clickName.bind(this)}>
          <div style={style.cardBasic.title}>
            <div style={{fontWeight: 'bold'}}>{contact.get('displayName')}</div>
          </div>
          <div style={style.cardBasic.subtitle}>
            {company?company.get('name'):''}
          </div>
          <div style={style.cardBasic.subtitle}>
            {contact.get('title')}
          </div>
        </div>
        <div style={{position: 'absolute', bottom:'0', right:'0'}}>
          <Stars score={contact.get('rating')} />
        </div>
      </div>
    );
  }

  renderTags() {
    let {contact} = this.props;

    let isHot = false;

    if (contact.get('tags')) {
      isHot = contact.get('tags').indexOf('HOT!') > -1;
    }

    let isVetted = false;

    if (contact.get('isVetted')) {
      isVetted = true;
    }

    return (
      <div>
        <div className="row" style={style.badgeWrap}>
          <Tag value={'Vetted'} active={isVetted} />
          <Tag value={'Active'} active={contact.get('isActive')} />
          <Tag value={'HOT!'} active={isHot} />
        </div>
      </div>
    );
  }

  render(){
    let {contact,type} = this.props;

    let location = contact.get('location') && contact.get('location').get('city') ? (
      <span>
        <FontIcon style={style.icon} className="material-icons">location_on</FontIcon>
        {contact.get('location').get('city') }
        , {contact.get('location').get('countrySubDivisionCode')}
      </span>
    ) : (<span></span>);
    function kFormatter(num) {
      return num > 999 ? `${(num/1000).toFixed(0)}k` : num;
    }
    let salary;
    if (contact.get('desiredSalary')) {
      salary = (<span>${kFormatter(contact.get('desiredSalary'))}</span>);
    }
    else {
      salary = (<span>No Salary Info</span>);
    }

    let skillImg = <img style={{width: '40px', height: '40px'}} src='http://www.w3devcampus.com/wp-content/uploads/logoAndOther/logo_JavaScript.png' />;

    let companies = '';

    if (contact.get('companies')) {
      for (let i = 0; i < contact.get('companies').size; i++) {
        companies += contact.get('companies').get(i).get('name');
        if (i + 1 < contact.get('companies').size) {
          companies += ', ';
        }
      }
    }

    return (
      type == 'tiny' ? (<div>{this.renderTags()}{this.renderBasic()}</div>) :
      <Card
        style={{
          height: type !=='mini'?'auto':'169px',
          marginBottom:'8px',
          marginLeft:'8px',
          marginRight:'8px',
        }}>
        <CardText
          style={{
            height: type !=='mini'?'auto':'auto',
          }}>
            {this.renderTags()}
            {this.renderBasic()}
            {type !== 'mini'?
            (<div>
              <Divider style={{marginTop:'8px'}}></Divider>
              <div style={{marginLeft:'0.5rem', marginRight:'0.5rem'}} >
                <div className="row" style={{display:'flex', alignItems: 'stretch', position:'relative', marginTop: '15px', marginLeft: '47px'}}>
                  <div style={{flex:'0 0 56px'}}>
                    {skillImg}
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
                  <div style={{lineHeight:'25px', marginTop:'0px', position:'absolute', bottom: '-7px', right: 0, textAlign: 'right'}}>
                    {contact.get('talentAdvocate')?(<div>
                      <Gravatar url={contact.get('talentAdvocate').get('email')} status={'notset'} style={style.accountOwnerGravatar}></Gravatar> <div style={{display:'inline-block',lineHeight:'25px'}}>{contact.get('talentAdvocate').get('displayName')}</div>
                    </div>):(<div></div>)}
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
        <CardActions
            style={{
              backgroundColor:'rgba(100,100,100,0.2)',
              boxShadow:'inset 0 1px 6px rgba(0, 0, 0, 0.24)',
            }}
            className="row between-xs"
        >
          <div>
            <PhoneButton phone={contact.get('phone')} />
            <SmsButton phone={contact.get('phone')} />
            <EmailButton email={contact.get('email')} />
            <FavoriteButton isFavorited={contact.get('isFavorited')} onTouchTap={this._onTouchTapSave.bind(this)} />
          </div>
          <div style={{marginRight: 0}}>
          <IconButton onTouchTap={this._onTouchTapDelete.bind(this)} iconStyle={{color:Styles.Colors.grey600}} tooltipPosition="top-center" tooltip="Delete">
            <FontIcon className="material-icons">delete</FontIcon>
          </IconButton>
          <IconButton onTouchTap={this._onTouchTapCheck.bind(this)} iconStyle={{color:contact.get('isVetted') ? Styles.Colors.green500 : Styles.Colors.grey600}} tooltipPosition="top-center" tooltip={contact.get('isVetted') ? 'Vetted' : 'Vet'}>
            <FontIcon className="material-icons">check</FontIcon>
          </IconButton>
          <IconButton iconStyle={{color:Styles.Colors.grey600}} tooltipPosition="top-center" tooltip="More">
            <FontIcon className="material-icons">more_vert</FontIcon>
          </IconButton>
          </div>
        </CardActions>

      </Card>
    );
  }
}
