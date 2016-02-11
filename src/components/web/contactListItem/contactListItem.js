import React from 'react';
import Immutable from 'immutable';
import { Card, CardText, FontIcon, Divider, CardActions, Styles,Avatar } from 'material-ui';
import { Gravatar, Tag, FavoriteButton, CardBasic, Stars, PhoneButton, SmsButton, EmailButton} from '../../../components/web';
let style = {
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

export default class ContactListItem extends React.Component {
  constructor(props){
    super(props);
  }
  clickContact(){
    let {contact} = this.props;
    this.props.onContactClick(contact);
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
  render(){
    let {contact,company,type} = this.props;

    let candidates = contact.get('candidates');
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

    let isHot = false;

    if (contact.get('tags')) {
      isHot = contact.get('tags').indexOf('HOT!') > -1;
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
      <Card
        style={{
          height: type !=='mini'?'auto':'169px',
          marginBottom:'8px',
          marginLeft:'8px',
          marginRight:'8px',
        }}>
        <CardText
          style={{
            height: type !=='mini'?'auto':'auto'
          }}>
            <div>
              <div className="row" style={style.badgeWrap}>
              <div style={{textAlign: 'left'}}>
              {isHot?
              <Tag value={'HOT!'} />
              :<span></span>
              }
              {contact.get('isActive')?
              <Tag value={'Active'} color={'gray'}/>
              :<span></span>
              }
              {contact.get('isVetted')?
              <Tag value={'Vetted'} color={'green'} />
              :<span></span>
              }
              </div>
              </div>
            </div>
            <CardBasic
                image={<Gravatar style={{width:'40px'}} email={contact.get('email')} status={contact.get('status')} />}
                title= {<div style={{fontWeight: 'bold'}}>{contact.get('displayName')}</div>}
                subtitle1={company?company.get('name'):''}
                subtitle2={contact.get('title')}
                onTouchTap={this.clickContact.bind(this)}
                stars={<Stars score={contact.get('rating')}></Stars>}
              ></CardBasic>
            {type !== 'mini'?
            (<div>
              <Divider style={{marginTop:'8px'}}></Divider>
              <div style={{marginLeft:'0.5rem', marginRight:'0.5rem'}} >
                <div className="row" style={{display:'flex', alignItems: 'stretch', position:'relative', marginTop: '15px'}}>
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
        <CardActions style={{
          backgroundColor:'rgba(100,100,100,0.2)',
          boxShadow:'inset 0 1px 6px rgba(0, 0, 0, 0.24)'

        }}>
          <PhoneButton phone={contact.get('phone')} />
          <SmsButton phone={contact.get('phone')} />
          <EmailButton email={contact.get('email')} />
          <FavoriteButton />
        </CardActions>

      </Card>
    );
  }
}
