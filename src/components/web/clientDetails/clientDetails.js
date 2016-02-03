import React from 'react';
import {
  List, ListItem, Divider, FontIcon, IconMenu, IconButton, Styles, MenuItem, Dialog
} from 'material-ui';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import MapsDirections from 'material-ui/lib/svg-icons/maps/directions';


import {
  Header, CustomTabsSwipe, ContactsList,
  CompanyJobsList
} from '../../../components/web';

const style = {
  // slide: {
  //   minHeight: `${window.innerHeight - 160}px`,
  //   // marginTop: '48px',
  // },
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

  }
  createJobModalOpen(){

  }
  createNoteModalOpen(){

  }
  _handleJobClick(){

  }
  contactDetailsModalOpen(){

  }

  _handleDirections(){
    var link = 'https://maps.google.com?saddr=Current+Location&daddr=Hero.jobs';
    window.open(link,'_blank');
  }
  closeModal(){

  }
  goBack(){
    if(this.props.onClientDetailsClose)
      this.props.onClientDetailsClose();
  }
  onSwipe(index){
    let tab = '';
    switch (index) {
    case 1:
      tab = 'jobs';
      break;
    case 3:
      tab = 'notes';
      break;
    default:
      tab = '';
    }
    this.props.pushState('', `/clients/${this.props.params.id}/${tab}`);
  }
  renderContent(company){

    let inline = true;
    if(company){
      let twitter = company.get('twitterHandle');
      let facebook = company.get('facebookHandle');
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
              <CardTitle style={style.cardTitleComponent} subtitleColor={Styles.Colors.white} titleColor={Styles.Colors.white} subtitleStyle={style.subtitle} title={company.get('name')} subtitle={company.get('website')} />
            </div>
            <CardActions className="row center-xs">
              <div className="col-xs" style={style.actionBox}>
                <div className="box">
                  <FontIcon style={style.actionFontIcon} className="material-icons">phone</FontIcon>
                  <FlatButton style={{minWidth: '0px'}} label="Call" />
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
                  <FlatButton style={{minWidth: '0px'}} labelPosition="after" label="Email" />
                </div>
              </div>
              <div className="col-xs" style={style.actionBox}>
                <div className="box">
                  <FontIcon style={style.actionFontIcon} className="material-icons">share</FontIcon>
                  <FlatButton style={{minWidth: '0px'}} labelPosition="after" label="Share" />
                </div>
              </div>
            </CardActions>
          </Card>

          <CustomTabsSwipe isInline={inline} ref='customTabsSwipe' onSwipeEnd={this.onSwipe.bind(this)} startingTab={this.props.tabId} tabs={['Details', 'Jobs', 'Contacts']}>
            <List>
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
                    <Divider inset />
                    <ListItem
                        leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                        primaryText={`facebook.com/${facebook}`}
                        secondaryText={<p>facebook</p>}
                        secondaryTextLines={1}
                    />
                  </div>
                ) : (null)}

              </div>
            </List>
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
