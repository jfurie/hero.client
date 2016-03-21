import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import {
  List, FontIcon, IconMenu, IconButton, Styles, MenuItem, Dialog, Card, CardTitle, CardText,
} from 'material-ui';

import Avatar from 'material-ui/lib/avatar';

import {
  LocationCard, Header, CustomTabsSwipe, ContactsList, CompanyJobsList,
  CompanyNotesList, DetailsCard, CompanyAvatar,
} from '../../../components/web';
import defaultImage from './default-company.jpg';
const style = {
  title:{
    color:'rgba(0, 0, 0, 0.87)',
    fontSize:'15px',
    fontWeight:'500',
  },
  content:{
    display: 'block',
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
  smallListItem: {
    padding: 0,
    margin: '16px',
  },
};

@connect(() => (
{}), {pushState, replaceState})
export default class ClientDetails extends React.Component {

  constructor(props){
    super(props);
    this.handleResize.bind(this);
    this.state = {windowHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight};
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
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
    let {company} = this.props;

    if (company.get('isFavorited')) {
      this.props.unfavoriteCompany();
    }
    else {
      this.props.favoriteCompany();
    }
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
        {
          content ?
          <div style={{display: 'inline-block'}}>
            <div style={style.title}>{title}</div>
            <div style={style.content}>{content}</div>
          </div>
          :
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={style.title}>{title}</div>
          </div>
        }

      </div>
    );
  }

  renderSmallListItem(content,avatar){
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{color:'rgba(0, 0, 0, 0.87)', fontSize:'15px'}}>{content}</div>
        </div>
      </div>
    );
  }

  goBack(){
    if(this.props.onClientDetailsClose)
      this.props.onClientDetailsClose();
  }

  tabChange(number){
    if(number){
      this.props.replaceState(null,`/clients/${this.props.company.get('id')}?tab=${number}`);
    }
  }

  renderContent(company) {
    let actions = [{
      materialIcon: 'phone',
      text: 'Call',
      onTouchTap: this._onTouchTapCall.bind(this),
      disabled: (company && company.get('phone') ? (false) : (true)),
    }, {
      materialIcon: 'star_rate',
      text: company && company.get('isFavorited') ? 'Saved' : 'Save',
      active: company && company.get('isFavorited'),
      onTouchTap: this._onTouchTapSave.bind(this),
    }, {
      materialIcon: 'email',
      text: 'Email',
      onTouchTap: this._onTouchTapEmail.bind(this),
      disabled: (company && company.get('email') ? (false) : (true)),
    }, {
      materialIcon: 'share',
      text: 'Share',
      onTouchTap: this._onTouchTapShare.bind(this),
    }];

    let stats = [{
      title: 'Applied',
      value: 0,
    }, {
      title: 'Submitted',
      value: 0,
    }, {
      title: 'Accepted',
      value: 0,
    }, {
      title: 'Interviews',
      value: 0,
    }, {
      title: 'Offers',
      value: 0,
    }, {
      title: 'Jobs',
      value: 0,
    }];

    let inline = true;
    if (company) {
      // get cover
      let cover = ((company.get('image')) ? (company.get('image').get('item')) : (defaultImage));

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
      // let recruiterDataArray = [];
      //
      // if (company.get('feeAgreement')) {
      //   recruiterDataArray.push(`${company.get('feeAgreement')}%`);
      // }
      //
      // if (company.get('payableTerms')) {
      //   recruiterDataArray.push(`net ${company.get('payableTerms')}`);
      // }
      //
      // if (company.get('guarantee')) {
      //   recruiterDataArray.push(`${company.get('guarantee')} days`);
      // }
      //
      // let recruiterData = null;
      // if (recruiterDataArray.length) {
      //   recruiterData = recruiterDataArray.join(' | ');
      // }

      return (
        <div className="viewContent" style={style.viewContent}>
          <DetailsCard
              topTitle={company.get('name')}
              topSubtitle={company.get('businessType') || 'Software Company'}
              location={company.get('location')}
              cover={cover}
              actions={actions}
              avatar={<CompanyAvatar style={{width: '95px'}} url={company.get('website')}/>}
              floatActionOnTap={this._handleDirections.bind(this)}
              floatActionContent={<FontIcon className="material-icons">directions</FontIcon>}
              floatActionLabel={'Directions'}
              stats={stats}
          />

        <CustomTabsSwipe isLight isInline={inline} startingTab={this.props.tab} onChange={this.tabChange.bind(this)} tabs={['Details', 'Jobs', 'Contacts', 'Notes']}>
            <div>
              <Card>
                <CardTitle title="Details" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
                {(addressLine) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderSmallListItem(addressLine,
                    <Avatar
                        icon={<FontIcon className="material-icons">place</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}

                {(website) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderSmallListItem(website,
                    <Avatar
                        icon={<FontIcon className="material-icons">public</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}

                {(phone) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderSmallListItem(phone,
                    <Avatar
                        icon={<FontIcon className="material-icons">phone</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}
              </Card>

              <LocationCard location={company.get('location')} />

              <Card>
                <CardTitle title="Details" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
                <CardText>
                  {this.renderBigListItem('Company Mission',company.get('productSolution'),
                  <Avatar
                      icon={<FontIcon className="material-icons">store</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Culture',company.get('culture'),
                  <Avatar
                      icon={<FontIcon className="material-icons">face</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Benefits',company.get('benefits'),
                  <Avatar
                      icon={<FontIcon className="material-icons">redeem</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Tech Stack',company.get('techstack'),
                  <Avatar
                      icon={<FontIcon className="material-icons">storage</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Leadership',company.get('leadership'),
                  <Avatar
                      icon={<FontIcon className="material-icons">stars</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
              </Card>
              <Card>
                <CardTitle title="Social" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
                {(twitter) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderBigListItem('twitter', `@${twitter}`,
                    <Avatar
                        icon={<FontIcon className="material-icons">public</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}
                {(facebook) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderBigListItem('facebook', `facebook.com/${facebook}`,
                    <Avatar
                        icon={<FontIcon className="material-icons">public</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}
                {(angelList) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderBigListItem('Angel List', `@${angelList}`,
                    <Avatar
                        icon={<FontIcon className="material-icons">public</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}
                {(crunchbase) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderBigListItem('Crunchbase', `@${crunchbase}`,
                    <Avatar
                        icon={<FontIcon className="material-icons">public</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}
              </Card>
              <Card>
                <CardTitle title="Job Boards" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
                {(jobboard) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderBigListItem('Job Board', `@${jobboard}`,
                    <Avatar
                        icon={<FontIcon className="material-icons">public</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}

                {(ziprecruiter) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderBigListItem('Zip Recruiter', `@${ziprecruiter}`,
                    <Avatar
                        icon={<FontIcon className="material-icons">public</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}
                {(indeed) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderBigListItem('indeed', `@${indeed}`,
                    <Avatar
                        icon={<FontIcon className="material-icons">public</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}
              </Card>
            </div>
            <CompanyJobsList
                company={company}
                onJobClick={this._handleJobClick.bind(this)}
                jobs={company.get('jobs')}
                favoriteJob={this.props.favoriteJob.bind(this)}
                unfavoriteJob={this.props.unfavoriteJob.bind(this)}
            />
            <ContactsList
                contacts={company.get('contacts')}
                company={company}
                type="mini"
                favoriteContact={this.props.favoriteContact.bind(this)}
                unfavoriteContact={this.props.unfavoriteContact.bind(this)}
            />
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

  render(){
    let { company } = this.props;
    if(this.props.inline){
      return (
        <div>
          <Header showHome goBack={this.goBack.bind(this)} iconRight={
            <IconMenu iconButtonElement={<IconButton iconStyle={{color: Styles.Colors.white}} iconClassName="material-icons">more_vert</IconButton>}>
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
                <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}>
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
