import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import {
  List, ListItem, Divider, FontIcon, IconMenu, IconButton, Styles, MenuItem, Dialog,CardText, CardHeader
} from 'material-ui';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import MapsDirections from 'material-ui/lib/svg-icons/maps/directions';
import Avatar from 'material-ui/lib/avatar';
import FileFolder from 'material-ui/lib/svg-icons/file/folder';

import {
  Header, CustomTabsSwipe, ContactsList,
  CompanyJobsList
} from '../../../components/web';

const style = {
  viewContent: {
  },
  cardTitle: {
    position: 'relative',
  },
  cardTitleComponent: {
    backgroundColor: Styles.Colors.indigo500,
    padding: '21px 16px 26px',
  },
  subtitle: {
    fontWeight: 200,
    opacity: 0.5,
  },
  direction: {
    position: 'absolute',
    right: '10px',
    top: '-28px',
    zIndex: '50',
  },
  subheader:{
    color:'rgba(0, 0, 0, 0.54)',
    lineHeight: '48px',
    fontWeight:'500',
    fontSize:'16px'
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
  actionFontIcon: {
    position: 'relative',
    // left: '-5px',
    top: '8px',
    marginLeft: '0px',
    width: '24px',
    height: '24px',
  },
  actionBox: {
    marginRight: '0px',
  },
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
  toolbar: {
    backgroundColor: '#ffffff',
    height: '64px',
  },
  toolbarIcon: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  toolbarFlat: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  toolbarTitle: {
    lineHeight:'64px',
    float:'left',
  },
};

@connect(() => (
{}), {pushState})
export default class ClientDetails extends React.Component {

  constructor(props){
    super(props);
  }

  editClientModalOpen(){
    if(this.props.editClientModalOpen){
      this.props.editClientModalOpen();
    }
  }

  createContactModalOpen(){
    if(this.props.addContactModalOpen){
      this.props.addContactModalOpen();
    }
  }

  createJobModalOpen(){

  }

  createNoteModalOpen(){

  }

  _handleJobClick(){

  }

  contactDetailsModalOpen(contact){
    //console.log(contact.get('id'));
    this.props.pushState('', `/contacts/${contact.get('id')}`);
  }
  _handleCall(){
    window.location.href='tel:13104980963';
  }
  _handleEmail(){
    let email = this.props.company.get('email');
    if(email){
      window.location.href=`mailto:${email}`;
    }
  }
  _handleShare(){
    let subject = 'Check out '+ this.props.company.get('name')+ ' on HERO';
    let body = encodeURIComponent(this.props.company.get('name')) +'%0A' + encodeURIComponent(window.location.href);
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }

  _handleDirections(){
    let { company } = this.props;
    let location  = company.get('location');
    if(location){
      let locationObj = location.toJSON();
      if(locationObj && locationObj.geoField && locationObj.geoField.lat && locationObj.geoField.lng){
        let lat = locationObj.geoField.lat;
        let lng = locationObj.geoField.lng;
        var link = `https://maps.google.com?saddr=Current+Location&daddr=${lat},${lng}`;
        window.open(link,'_blank');
      }
    }


  }

  closeModal(){

  }

  renderBigListItem(title,content,avatar){
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        <div style={{display:'inline-block'}}>
          <div style={style.title}>{title}</div>
          <div style={style.content}>{content}</div>
        </div>
      </div>
    );
  }

  goBack(){
    if(this.props.onClientDetailsClose)
      this.props.onClientDetailsClose();
  }
  // onSwipe(index){
  //   let tab = '';
  //   switch (index) {
  //   case 1:
  //     tab = 'jobs';
  //     break;
  //   case 3:
  //     tab = 'notes';
  //     break;
  //   default:
  //     tab = '';
  //   }
  //   this.props.pushState('', `/clients/${this.props.params.id}/${tab}`);
  // }
  renderContent(company){

    let inline = true;
    if(company){
      let twitter = company.get('twitterHandle');
      let facebook = company.get('facebookHandle');
      let angelList = company.get('angelList');
      let crunchbase = company.get('crunchbase');
      let jobboard = company.get('jobboard');
      let ziprecruiter = company.get('ziprecruiter');
      let indeed = company.get('indeed');
      let colors = Styles.Colors;
      return (
        <div className="viewContent" style={style.viewContent}>
          <Card>
            <CardMedia>
              <img src="http://southerncaliforniabeaches.org/img/santa-monica-beach-path.jpg" />
            </CardMedia>
            <div style={style.cardTitle}>
              <FloatingActionButton onTouchTap={this._handleDirections.bind(this)} style={style.direction} backgroundColor={Styles.Colors.white}>
                <MapsDirections color={Styles.Colors.grey900}/>
              </FloatingActionButton>
              <CardTitle style={style.cardTitleComponent} subtitleColor={Styles.Colors.white} titleColor={Styles.Colors.white} subtitleStyle={style.subtitle} title={company.get('name')} subtitle={<a style={{color:'#ffffff'}} target="_blank" href={company.get('website')}>{company.get('website')}</a>} />
            </div>
            <CardActions className="row center-xs">
              <div className="col-xs" style={style.actionBox}>
                <div className="box">
                  <FontIcon style={style.actionFontIcon} className="material-icons">phone</FontIcon>
                  <FlatButton onTouchTap={this._handleCall.bind(this)} style={{minWidth: '0px'}} label="Call" >

                  </FlatButton>
                </div>
              </div>
              <div className="col-xs" style={style.actionBox}>
                <div className="box">
                  <FontIcon style={style.actionFontIcon} className="material-icons">star_rate</FontIcon>
                  <FlatButton style={{minWidth: '0px'}} labelPosition="after" label="Save" />
                </div>
              </div>
              <div className="col-xs" style={style.actionBox}>
                <div className="box">
                  <FontIcon style={style.actionFontIcon} className="material-icons">email</FontIcon>
                  <FlatButton onTouchTap={this._handleEmail.bind(this)} style={{minWidth: '0px'}} labelPosition="after" label="Email" />
                </div>
              </div>
              <div className="col-xs" style={style.actionBox}>
                <div className="box">
                  <FontIcon style={style.actionFontIcon} className="material-icons">share</FontIcon>
                  <FlatButton onTouchTap={this._handleShare.bind(this)} style={{minWidth: '0px'}} labelPosition="after" label="Share" />
                </div>
              </div>
            </CardActions>
          </Card>

          <CustomTabsSwipe isLight={true} isInline={inline} ref='customTabsSwipe' tabs={['Details', 'Jobs', 'Contacts']}>
            <Card>
              <CardText>
                {this.renderBigListItem('Company Mission',company.get('productSolution'),<Avatar
                icon={<FontIcon className="material-icons">store</FontIcon>}
                color={colors.grey600}
                backgroundColor={colors.white}
                />)}
              </CardText>
              <CardText>
                {this.renderBigListItem('Culture',company.get('culture'),<Avatar
                icon={<FontIcon className="material-icons">face</FontIcon>}
                color={colors.grey600}
                backgroundColor={colors.white}
                />)}
              </CardText>
              <CardText>
                {this.renderBigListItem('Benefits',company.get('benefits'),<Avatar
                icon={<FontIcon className="material-icons">redeem</FontIcon>}
                color={colors.grey600}
                backgroundColor={colors.white}
                />)}
              </CardText>
              <CardText>
                {this.renderBigListItem('Tech Stack',company.get('techstack'),<Avatar
                  icon={<FontIcon className="material-icons">storage</FontIcon>}
                  color={colors.grey600}
                  backgroundColor={colors.white}
                />)}
              </CardText>
              <CardText>
                {this.renderBigListItem('Leadership',company.get('leadership'),<Avatar
                icon={<FontIcon className="material-icons">stars</FontIcon>}
                color={colors.grey600}
                backgroundColor={colors.white}
                />)}
              </CardText>
              <Divider></Divider>
              <div style={{padding:'8px'}}>
                <List subheader={'Social'}>
                  <div>

                    {(twitter) ? (
                      <div>
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                            primaryText={`@${twitter}`}
                            secondaryText={<p>twitter</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}

                    {(facebook) ? (
                      <div>
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                            primaryText={`facebook.com/${facebook}`}
                            secondaryText={<p>facebook</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}
                    {(angelList) ? (
                      <div>
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                            primaryText={`${angelList}`}
                            secondaryText={<p>angel list</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}
                    {(crunchbase) ? (
                      <div>
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                            primaryText={`${crunchbase}`}
                            secondaryText={<p>Crunchbase</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}

                  </div>
                </List>
              </div>

              <Divider></Divider>
              <div style={{padding:'8px'}}>
                <List subheader={'Job Boards'}>
                  <div>

                    {(jobboard) ? (
                      <div>
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                            primaryText={`${jobboard}`}
                            secondaryText={<p>Jobboard</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}

                    {(ziprecruiter) ? (
                      <div>
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                            primaryText={`${ziprecruiter}`}
                            secondaryText={<p>ziprecruiter</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}
                    {(indeed) ? (
                      <div>
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                            primaryText={`${indeed}`}
                            secondaryText={<p>indeed</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}
                  </div>
                </List>
              </div>


            </Card>

            <List subheader={`${company.get('jobs').count()} Job${((company.get('jobs').count() !== 1) ? ('s') : (''))}`}>
              <CompanyJobsList company={company} onJobClick={this._handleJobClick.bind(this)} jobs={company.get('jobs')}/>
            </List>
            <ContactsList contacts={company.get('contacts')} onOpenContactDetails={this.contactDetailsModalOpen.bind(this)}/>
          </CustomTabsSwipe>

        </div>
      );
    } else {
      return (<div></div>);
    }
  }
  render(){
    let { company } = this.props;
    if(this.props.inline){
      return (
        <div>
          <Header iconRight={
            <IconMenu iconButtonElement={
              <IconButton  iconClassName="material-icons">more_vert</IconButton>
            }>
              <MenuItem index={0} onTouchTap={this.editClientModalOpen.bind(this)} primaryText="Edit Client" />
              <MenuItem index={0} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Contact" />
              <MenuItem index={0} onTouchTap={this.createJobModalOpen.bind(this)} primaryText="Add Job" />
              <MenuItem index={0} onTouchTap={this.createNoteModalOpen.bind(this)} primaryText="Add Note" />
            </IconMenu>
          } transparent
          />


        {this.renderContent(company)}
        </div>
      );
    } else {
      let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      let contentHeight = clientHeight;
      return (
        <div>
          <Dialog
                open={this.props.open}
                autoDetectWindowHeight={false}
                autoScrollBodyContent={false}
                repositionOnUpdate={false}
                defaultOpen={false}
                style={style.dialog}
                bodyStyle={style.bodyStyle}
                contentStyle={style.contentStyle}
            >
            <div style={{minHeight: `${clientHeight}px`, overflowY:'scroll'}}>
              <Header goBack={this.goBack.bind(this)} iconRight={
                <IconMenu iconButtonElement={
                  <IconButton  iconClassName="material-icons">more_vert</IconButton>
                }>
                  <MenuItem index={0} onTouchTap={this.editClientModalOpen.bind(this)} primaryText="Edit Client" />
                  <MenuItem index={0} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Contact" />
                  <MenuItem index={0} onTouchTap={this.createJobModalOpen.bind(this)} primaryText="Add Job" />
                  <MenuItem index={0} onTouchTap={this.createNoteModalOpen.bind(this)} primaryText="Add Note" />
                </IconMenu>
              } transparent
              />
              <div style={{height: `${contentHeight}px`, overflowY:'scroll', WebkitOverflowScrolling:'touch'}}>
                {this.renderContent(company)}
              </div>
            </div>
          </Dialog>

        </div>
      );
    }
  }
}
ClientDetails.propTypes = {
  onClientDetailsClose: React.PropTypes.func,
  editClientModalOpen: React.PropTypes.func,
};
