import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import {
  List, ListItem, Divider, FontIcon, IconMenu, IconButton, Styles, MenuItem, Dialog,
} from 'material-ui';

import MapsDirections from 'material-ui/lib/svg-icons/maps/directions';

import {
  Header, CustomTabsSwipe, ContactsList, CompanyJobsList, DetailsCard,
} from '../../../components/web';

const style = {
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

  _handleDirections(){

    console.log('_handleDirections');

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

  _onTouchTapSave() {
    console.log('_onTouchTapSave');
  }

  _onTouchTapCall() {
    console.log('_onTouchTapCall');
  }

  _onTouchTapEmail() {
    console.log('_onTouchTapEmail');
  }

  _onTouchTapShare() {
    console.log('_onTouchTapShare');
  }

  closeModal(){

  }

  goBack() {
    if (this.props.onClientDetailsClose) {
      this.props.onClientDetailsClose();
    }
  }

  renderContent(company) {

    let inline = true;
    if (company) {

      let twitter = company.get('twitterHandle');
      let facebook = company.get('facebookHandle');

      let actions = [{
        materialIcon: 'phone',
        text: 'Call',
        onTouchTap: this._onTouchTapCall.bind(this),
      }, {
        materialIcon: 'star_rate',
        text: 'Save',
        onTouchTap: this._onTouchTapSave.bind(this),
      }, {
        materialIcon: 'email',
        text: 'Email',
        onTouchTap: this._onTouchTapEmail.bind(this),
      }, {
        materialIcon: 'share',
        text: 'Share',
        onTouchTap: this._onTouchTapShare.bind(this),
      }];

      return (
        <div className="viewContent" style={style.viewContent}>
          <DetailsCard
              title={company.get('name')}
              subtitle={company.get('website')}
              cover={'http://southerncaliforniabeaches.org/img/santa-monica-beach-path.jpg'}
              mainColor={Styles.Colors.indigo500}
              actions={actions}
              floatActionOnTap={this._handleDirections.bind(this)}
              floatActionContent={<MapsDirections color={Styles.Colors.indigo500}/>}
          />

          <CustomTabsSwipe isLight isInline={inline} ref='customTabsSwipe' tabs={['Details', 'Jobs', 'Contacts']}>
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