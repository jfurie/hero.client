import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Card, CardText, FontIcon, Divider, CardActions, Styles,Avatar } from 'material-ui';
import { Gravatar, Tag, FavoriteButton, CardBasic, PhoneButton, SmsButton, EmailButton} from '../../../components/web';
import categoryLinkSort from '../../../utils/categoryLinkSort';
let style = {
  layout:{
    display:'flex',
    alignItems: 'stretch',
    position:'relative',
  },
  layoutContactDetails:{
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
    width: '30px',
    height: '30px',
    cursor:'pointer',
  },
  plusAvatar: {
    display: 'inline',
    width: '30px',
    height: '30px',
    padding: '7px 8px 7px 7px',
    fontSize: '16px',
    position: 'relative',
    top: '-11px',
    cursor:'pointer',
  },
  badgeWrap:{
    position: 'relative',
    left: '10px',
  },
  accountOwnerGravatar:{
    display: 'inline',
    width: '25px',
    height: '25px',
    cursor:'pointer',
    container:{
      top:'9px',
      display: 'inline',
      position: 'relative',
      marginRight: '7px',
    },

  },
};

@connect((state) =>
{
  return {categories: state.categories.list};
}, {})
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

  _onTouchTapSave() {
    let {contact} = this.props;

    if (contact.get('isFavorited')) {
      this.props.unfavoriteContact(contact);
    }
    else {
      this.props.favoriteContact(contact);
    }
  }

  renderBasic(companies) {
    let {contact, company} = this.props;

    return (
      <CardBasic
          image={<Gravatar style={{width:'40px', cursor:'pointer',}} email={contact.get('email')} status={contact.get('status')} />}
          title= {<div style={{fontWeight: 'bold', cursor:'pointer'}}>{contact.get('displayName')}</div>}
          subtitle1={<span style={{cursor:'pointer'}}>{company?company.get('name'):companies}</span>}
          subtitle2={<span style={{cursor:'pointer'}}>{contact.get('title')}</span>}
          onTouchTap={this.clickContact.bind(this)}
        ></CardBasic>
    );
  }

  renderTags() {
    let {contact} = this.props;

    let isHot = false;

    if (contact.get('tags')) {
      isHot = contact.get('tags').indexOf('HOT!') > -1;
    }

    return (
      <div>
        <div className="row" style={{justifyContent: 'flex-end'}}>
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
    );
  }

  render(){
    let self = this;
    let {contact,type} = this.props;

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

    function kFormatter(num) {
      return num > 999 ? `${(num/1000).toFixed(0)}k` : num;
    }

    let showSecondRow = false;

    let location;
    if (contact.get('location') && contact.get('location').get('city')) {
      location = (<span>
        <FontIcon style={style.icon} className="material-icons">location_on</FontIcon>
        {contact.get('location').get('city') }
        , {contact.get('location').get('countrySubDivisionCode')}
      </span>);
      showSecondRow = true;
    }
    else {
      location = (<span></span>);
    }

    let salary;
    if (contact.get('desiredSalary')) {
      salary = (<span>${kFormatter(contact.get('desiredSalary'))}</span>);
      showSecondRow = true;
    }
    else {
      salary = (<span>No Salary Info</span>);
    }

    let categoryLinks = contact.get('_categoryLinks');
    let skillImg = <span></span>;
    if(categoryLinks && categoryLinks.size > 0){
      let sorted = categoryLinks.sort(categoryLinkSort);

      let currentCategory = sorted.get(0);
      if(currentCategory.get('experience') > 0){
        let found = self.props.categories.find(x=>x.get('id') == currentCategory.get('categoryId'));
        if(found){
          skillImg = <img style={{width: '40px', height: '40px'}} src={found.get('imageUrl')} />;
        }
      }
    }
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
      type == 'tiny' ? (<div>{this.renderTags()}{this.renderBasic(companies)}</div>) :
      <Card
        style={{
          marginBottom:'8px',
          marginLeft:'8px',
          marginRight:'8px',
        }}>
        <CardText
          style={{
            height: type !=='mini'?'auto':'auto',
          }}>
            {this.renderTags()}
            {this.renderBasic(companies)}
            {type !== 'mini' && showSecondRow?
            (<div>
              <Divider style={{marginTop:'8px'}}></Divider>
              <div style={{marginLeft:'0.5rem', marginRight:'0.5rem'}} >
                <div className="row" style={{display:'flex', alignItems: 'stretch', position:'relative', marginTop: '15px'}}>
                  <div style={{flex:'0 0 50px'}}>
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
          padding: 0,
        }}>
          <PhoneButton phone={contact.get('phone')} />
          <SmsButton phone={contact.get('phone')} />
          <EmailButton email={contact.get('email')} />
          <FavoriteButton isFavorited={contact.get('isFavorited')} onTouchTap={this._onTouchTapSave.bind(this)} />
        </CardActions>

      </Card>
    );
  }
}
