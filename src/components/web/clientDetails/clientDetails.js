import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import {
  List, ListItem, Divider, FontIcon, IconMenu, IconButton, Styles, MenuItem, Dialog, CardText,
} from 'material-ui';
import Card from 'material-ui/lib/card/card';

import MapsDirections from 'material-ui/lib/svg-icons/maps/directions';
import Avatar from 'material-ui/lib/avatar';

import {
  Header, CustomTabsSwipe, ContactsList, CompanyJobsList,
  CompanyNotesList, DetailsCard, CompanyAvatar,
} from '../../../components/web';

const style = {
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
    this.handleResize.bind(this);
    this.state = {windowHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight};
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
    if(this.props.addJobModalOpen){
      this.props.addJobModalOpen();
    }
  }

  createNoteModalOpen(){
    if(this.props.addNoteModalOpen){
      this.props.addNoteModalOpen();
    }
  }

  _handleJobClick(job){
    this.props.pushState('', `/jobs/${job.get('id')}`);
  }

  editNote(note){
    this.props.addNoteModalOpen(note);
  }

  deleteNote(note){
    this.props.deleteNote(note);
  }

  contactDetailsModalOpen(contact){
    this.props.pushState('', `/contacts/${contact.get('id')}`);
  }

  _handleDirections(){
    let { company } = this.props;
    let location  = company.get('location');
    if (location) {
      let locationObj = location.toJSON();
      if(locationObj && locationObj.geoField && locationObj.geoField.lat && locationObj.geoField.lng){
        let lat = locationObj.geoField.lat;
        let lng = locationObj.geoField.lng;
        let link = `https://maps.google.com?saddr=Current+Location&daddr=${lat},${lng}`;
        window.open(link, '_blank');
      }
    }
  }

  _onTouchTapSave() {
    console.log('_onTouchTapSave');
  }

  _onTouchTapCall() {
    window.location.href = `tel:${this.props.company.get('phone')}`;
  }

  _onTouchTapEmail() {
    let email = this.props.company.get('email');
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  }

  _onTouchTapShare() {
    let subject = `Check out ${this.props.company.get('name')} on HERO`;
    let body = `${encodeURIComponent(this.props.company.get('name'))}%0A${encodeURIComponent(window.location.href)}`;
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
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

  renderContent(company) {

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

    let topTags = [{
      text: 'HOT!',
    }, {
      text: 'Lead',
      color: 'green',
    }];

    let inline = true;
    if (company) {

      let twitter = company.get('twitterHandle');
      let facebook = company.get('facebookHandle');
      let angelList = company.get('angelList');
      let crunchbase = company.get('crunchbase');
      let jobboard = company.get('jobboard');
      let ziprecruiter = company.get('ziprecruiter');
      let indeed = company.get('indeed');
      let website = company.get('website');
      let phone = company.get('phone');
      let addressLine = null;
      //let colors = Styles.Colors;

      // build extra line
      let recruiterDataArray = [];

      if (company.get('feeAgreement')) {
        recruiterDataArray.push(`${company.get('feeAgreement')}%`);
      }

      if (company.get('payableTerms')) {
        recruiterDataArray.push(`net ${company.get('payableTerms')}`);
      }

      if (company.get('guarantee')) {
        recruiterDataArray.push(`${company.get('guarantee')} days`);
      }

      let recruiterData = null;
      if (recruiterDataArray.length) {
        recruiterData = recruiterDataArray.join(' | ');
      }

      // location stuff
      let location = company.get('location');



      if (location) {

        console.log(location.toJS());

        addressLine = location.get('addressLine') || null;
        let city = location.get('city') || null;
        let postalCode = location.get('postalCode') || null;
        let countrySubDivisionCode = location.get('countrySubDivisionCode') || null;

        if (city && countrySubDivisionCode) {
          city += `, ${countrySubDivisionCode}`;
        }

        if (city && postalCode) {
          city += ` ${postalCode}`;
        }

        addressLine += ` ${city}`;
      }


      return (
        <div className="viewContent" style={style.viewContent}>
          <DetailsCard
              title={company.get('name')}
              subtitle={company.get('businessType') || 'Software Company'}
              cover={'/img/default-company.jpg'}
              mainColor={Styles.Colors.deepPurple500}
              actions={actions}
              avatar={<CompanyAvatar style={{width: '50px'}} url={company.get('website')}/>}
              floatActionOnTap={this._handleDirections.bind(this)}
              floatActionContent={<MapsDirections color={Styles.Colors.deepPurple500}/>}
              extraLeftLine={recruiterData}
              topTags={topTags}
          />

          <CustomTabsSwipe isLight isInline={inline} ref='customTabsSwipe' tabs={['Details', 'Jobs', 'Contacts', 'Notes']}>
            <div>

              <List>

                {(addressLine) ? (
                  <div>
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">place</FontIcon>}
                      primaryText={addressLine}
                      secondaryText={<p>address</p>}
                      secondaryTextLines={1}
                    />
                    <Divider />
                  </div>
                ) : (null)}

                {(website) ? (
                  <div>
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                      primaryText={website}
                      secondaryText={<p>website</p>}
                      secondaryTextLines={1}
                    />
                    <Divider />
                  </div>
                ) : (null)}

                {(phone) ? (
                  <div>
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">phone</FontIcon>}
                      primaryText={phone}
                      secondaryText={<p>phone</p>}
                      secondaryTextLines={1}
                    />
                  </div>
                ) : (null)}
              </List>

              <Card>
                <CardText>
                  {this.renderBigListItem('Company Mission',company.get('productSolution'),<Avatar
                  icon={<FontIcon className="material-icons">store</FontIcon>}
                  color={Styles.Colors.grey600}
                  backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Culture',company.get('culture'),<Avatar
                  icon={<FontIcon className="material-icons">face</FontIcon>}
                  color={Styles.Colors.grey600}
                  backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Benefits',company.get('benefits'),<Avatar
                  icon={<FontIcon className="material-icons">redeem</FontIcon>}
                  color={Styles.Colors.grey600}
                  backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Tech Stack',company.get('techstack'),<Avatar
                    icon={<FontIcon className="material-icons">storage</FontIcon>}
                    color={Styles.Colors.grey600}
                    backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Leadership',company.get('leadership'),<Avatar
                  icon={<FontIcon className="material-icons">stars</FontIcon>}
                  color={Styles.Colors.grey600}
                  backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <Divider></Divider>
                <div style={{padding:'8px'}}>
                  <List subheader={'Social'}>
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
            </div>

            <List subheader={`${company.get('jobs').count()} Job${((company.get('jobs').count() !== 1) ? ('s') : (''))}`}>
              <CompanyJobsList company={company} onJobClick={this._handleJobClick.bind(this)} jobs={company.get('jobs')}/>
            </List>
            <ContactsList contacts={company.get('contacts')} onOpenContactDetails={this.contactDetailsModalOpen.bind(this)}/>
            <List subheader={`${company.get('notes').count()} Note${((company.get('notes').count() !== 1) ? ('s') : (''))}`}>
              <CompanyNotesList company={company} editNote={this.editNote.bind(this)} deleteNote={this.deleteNote.bind(this)} notes={company.get('notes')}/>
            </List>
          </CustomTabsSwipe>

        </div>
      );
    } else {
      return (<div></div>);
    }
  }

  handleResize() {
    this.setState({windowHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight});
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  render(){
    let { company } = this.props;
    if(this.props.inline){
      return (
        <div>
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


        {this.renderContent(company)}
        </div>
      );
    } else {
      let clientHeight = this.state.windowHeight;
      let contentHeight =this.state.windowHeight;
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
  editClientModalOpen: React.PropTypes.func,
  onClientDetailsClose: React.PropTypes.func,
};
