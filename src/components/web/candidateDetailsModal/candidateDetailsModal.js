import React from 'react';
import Immutable from 'immutable';

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
};

class CandidateDetailsModal extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.props.getAllJobs();
  }

  _handleJobClick(){
    this.props.pushState(null,'/jobs/1a');
  }

  _openResume(resumeLink) {
    window.open(resumeLink);
  }

  createCandidate() {
    if (this.props.createCandidate) this.props.createCandidate();
  }

  render() {

    let jobs = {};
    jobs.list = new Immutable.Map();

    let job = {};
    job['1a'] = {
      title: 'Android Mobile Engineer',
      location: 'Santa Monica, CA',
      id: '1a',
    };

    jobs.list = jobs.list.mergeDeep(job);

    let email = null;
    let phone = null;
    let address = null;
    let city = null;
    let source = null;
    let displayName = null;
    let candidateStatus = 'notset';
    let resumeLink = null;
    let candidateId = null;

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
        address = '1316 3rd St #103';
        city = 'Santa Monica, CA 90401';
        source = 'facebook.com';
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
                tabs={['Details', 'Infos', 'Applications']}
                isLight
            >
              <List>
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
              {/* <div className="innerView"> sample.pdf
                <RaisedButton linkButton={true} href="https://github.com/callemall/material-ui" secondary={true} label="Label after" labelPosition="after">
                  <FontIcon style={styles.exampleButtonIcon} className="muidocs-icon-custom-github" />
                </RaisedButton>
                <p>lol</p>
              </div> */}
              <div>
                <CardText>
                  <div className="description">
                    <p>Quick Pitch:</p>
                    <p>Experienced software engineer passionate about creating technology to empower people. Effective communicator able to lead cross-functional teams to achieve innovative results. All challenges considered.</p>
                  </div>
                </CardText>
                <List>
                  <div>

                    <ListItem
                        leftAvatar={<FontIcon className="material-icons">attach_money</FontIcon>}
                        primaryText="$130,000"
                        secondaryText={<p>curent salary</p>}
                        secondaryTextLines={1}
                    />

                    <Divider inset />

                    <ListItem
                        leftIcon={<FontIcon className="material-icons">star_rate</FontIcon>}
                        primaryText="401k match, free lunch"
                        secondaryText={<p>bonus</p>}
                        secondaryTextLines={1}
                    />

                    <Divider inset />

                    <ListItem
                        leftIcon={<FontIcon className="material-icons">attach_money</FontIcon>}
                        primaryText="$140,000"
                        secondaryText={<p>desired salary</p>}
                        secondaryTextLines={1}
                    />

                    <Divider inset />

                    <ListItem
                        leftIcon={<FontIcon className="material-icons">alarm</FontIcon>}
                        primaryText="$67"
                        secondaryText={<p>current hourly</p>}
                        secondaryTextLines={1}
                    />

                    <Divider inset />

                    <ListItem
                        leftIcon={<FontIcon className="material-icons">alarm_on</FontIcon>}
                        primaryText="$72"
                        secondaryText={<p>desired hourly</p>}
                        secondaryTextLines={1}
                    />
                  </div>
                </List>
              </div>
              <div>

              </div>
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
