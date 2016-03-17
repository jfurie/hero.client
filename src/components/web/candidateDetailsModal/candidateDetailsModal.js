import React from 'react';
//import Immutable from 'immutable';

import {
  Dialog, Toolbar, ToolbarTitle, IconButton, ToolbarGroup,
  List, ListItem, FontIcon, Divider, FlatButton, CardText, Styles,
} from 'material-ui';

import { CustomTabsSwipe, Gravatar } from '../../../components/web';

let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

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
  content: {
    height: `${clientHeight}px`,
    overflowY:'scroll',
    WebkitOverflowScrolling: 'touch',
  },
  toolBar: {
    backgroundColor:'#ffffff',
    height:'64px',
  },
  close: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  detailsTitle: {
    lineHeight:'64px',
    float:'left',
  },
  statusNotInterestedButton: {
    backgroundColor: Styles.Colors.red600,
    color: '#FFF',
    margin: '14px 0px',
  },
  statusInterestedButton: {
    backgroundColor: Styles.Colors.lightGreen600,
    color: '#FFF',
    margin: '14px 0px',
  },
  createCandidate: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  slide: {
    // marginTop: '48px',
  },
};

class CandidateDetailsModal extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.props.getAllJobs();
  }

  // _handleJobClick(){
  //   this.props.pushState(null,'/jobs/1a');
  // }

  _openResume(resumeLink) {
    window.open(resumeLink);
  }

  createCandidate() {
    if (this.props.createCandidate) this.props.createCandidate();
  }

  render() {

    let email = null;
    let phone = null;
    let address = null;
    let city = null;
    let source = null;
    let displayName = null;
    let candidateStatus = 'notset';
    let resumeLink = null;
    let candidateId = null;
    let currentSalary = null;
    let currentHourly = null;
    let desiredHourly = null;
    let desiredSalary = null;
    let bonusNotes = null;
    let pitch = null;

    if (this.props.candidate) {
      candidateId = this.props.candidate.get('id') || null;

      candidateStatus = this.props.candidate.get('status') || 'notset';
      let contact = this.props.candidate.get('contact');


      // TMP
      resumeLink = null;
      let resume = contact.get('resume');
      if(resume){
        resumeLink = resume.get('item');
      }
      if (contact) {
        displayName = contact.get('displayName') || null;
        email = contact.get('email') || null;
        phone = contact.get('phone') || null;

        // define address and city
        address = contact.get('_address').get('addressLine') || null;
        city = contact.get('_address').get('city') || null;

        let postalCode = contact.get('_address').get('postalCode') || null;
        let countrySubDivisionCode = contact.get('_address').get('countrySubDivisionCode') || null;
        if (city && countrySubDivisionCode) {
          city += `, ${countrySubDivisionCode}`;
        }

        if (city && postalCode) {
          city += ` ${postalCode}`;
        }

        // get source

        if (contact.get('sourceInfo') && contact.get('sourceInfo').get('referrer')) {
          source = contact.get('sourceInfo').get('referrer');
        }

        currentSalary = contact.get('currentSalary') || null;
        currentHourly = contact.get('currentHourly') || null;
        desiredHourly = contact.get('desiredHourly') || null;
        desiredSalary = contact.get('desiredSalary') || null;
        bonusNotes = contact.get('bonusNotes') || null;
        pitch = contact.get('pitch') || null;
      }
    }

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
            ref="contactDetailsDialog"
        >
          <div style={style.content}>
            <Toolbar style={style.toolBar}>
              <ToolbarGroup key={0} float="left">
                <IconButton onTouchTap={this.props.close.bind(this)} style={style.close} iconClassName='material-icons'>close</IconButton>
                <ToolbarTitle style={style.detailsTitle} text={'Details'} />
              </ToolbarGroup>

              {
                candidateId ?

                <ToolbarGroup key={1} float="right">
                  {(candidateStatus === 'notinterested') ? (
                    <FlatButton style={style.statusNotInterestedButton} label="Not Interested" />
                  ) : (null)}
                  {(candidateStatus === 'interested') ? (
                    <FlatButton style={style.statusInterestedButton} label="Interested" />
                  ) : (null)}
                </ToolbarGroup>

                :

                <ToolbarGroup key={1} float="right">
                  <FlatButton onTouchTap={this.createCandidate.bind(this)} style={style.createCandidate}>Add</FlatButton>
                </ToolbarGroup>
              }

            </Toolbar>
            <CustomTabsSwipe
                tabs={['Details', 'Info' /*, 'Applications'*/]}
                isLight
            >
              <List style={style.slide}>
                <div>

                  {(displayName) ? (
                    <ListItem
                        leftAvatar={<Gravatar email={email} status={candidateStatus} />}
                        primaryText={displayName}
                        secondaryText={<p>candidate</p>}
                        secondaryTextLines={1}
                    />
                  ) : (null)}

                  {(email) ? (
                    <ListItem
                        leftIcon={<FontIcon className="material-icons">mail</FontIcon>}
                        primaryText={email}
                        secondaryText={<p>email</p>}
                        secondaryTextLines={1}
                    />
                  ) : (null)}

                  {(phone) ? (
                    <div>
                      <Divider inset />
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">phone</FontIcon>}
                          primaryText={phone}
                          secondaryText={<p>phone</p>}
                          secondaryTextLines={1}
                      />
                    </div>
                  ) : (null)}

                  {(resumeLink) ? (
                    <div>
                      <Divider inset />
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">insert_drive_file</FontIcon>}
                          primaryText={'Open resume'}
                          secondaryText={<p>resume</p>}
                          secondaryTextLines={1}
                          onTouchTap={this._openResume.bind(this, resumeLink)}
                      />
                    </div>
                  ) : (null)}

                  {(address) ? (
                    <div>
                      <Divider inset />
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">place</FontIcon>}
                          primaryText={address}
                          secondaryText={<p>address</p>}
                          secondaryTextLines={1}
                      />
                    </div>
                  ) : (null)}

                  {(city) ? (
                    <div>
                      <Divider inset />
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">business</FontIcon>}
                          primaryText={city}
                          secondaryText={<p>city</p>}
                          secondaryTextLines={1}
                      />
                    </div>
                  ) : (null)}

                  {(source) ? (
                    <div>
                      <Divider inset />
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">redo</FontIcon>}
                          primaryText={source}
                          secondaryText={<p>source</p>}
                          secondaryTextLines={1}
                      />
                    </div>
                  ) : (null)}

                </div>
              </List>
              <div style={style.slide}>
                {(pitch) ? (
                  <CardText>
                    <div className="description">
                      <p>Quick Pitch:</p>
                      <p>{pitch}</p>
                    </div>
                  </CardText>
                ) : (null)}

                <List>
                  <div>

                    {(!currentSalary && !bonusNotes && !desiredSalary && !currentHourly && !desiredHourly) ? (
                      <p style={{textAlign: 'center', marginTop: '20px', color: Styles.Colors.grey600}}>
                        No additional informations
                      </p>
                    ) : (null)}

                    {(currentSalary) ? (
                      <ListItem
                          leftAvatar={<FontIcon className="material-icons">attach_money</FontIcon>}
                          primaryText={`$${currentSalary}`}
                          secondaryText={<p>curent salary</p>}
                          secondaryTextLines={1}
                      />
                    ) : (null)}

                    {(bonusNotes) ? (
                      <div>
                        <Divider inset />
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">star_rate</FontIcon>}
                            primaryText={bonusNotes}
                            secondaryText={<p>bonus</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}

                    {(desiredSalary) ? (
                      <div>
                        <Divider inset />
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">attach_money</FontIcon>}
                            primaryText={`$${desiredSalary}`}
                            secondaryText={<p>desired salary</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}

                    {(currentHourly) ? (
                      <div>
                        <Divider inset />
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">alarm</FontIcon>}
                            primaryText={`$${currentHourly}`}
                            secondaryText={<p>current hourly</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}

                    {(desiredHourly) ? (
                      <div>
                        <Divider inset />
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">alarm_on</FontIcon>}
                            primaryText={`$${desiredHourly}`}
                            secondaryText={<p>desired hourly</p>}
                            secondaryTextLines={1}
                        />
                      </div>
                    ) : (null)}

                  </div>
                </List>
              </div>
              {/*<div style={style.slide}>

              </div>*/}
            </CustomTabsSwipe>
          </div>
        </Dialog>
      </div>
    );
  }
}

CandidateDetailsModal.propTypes = {

};

export default CandidateDetailsModal;
