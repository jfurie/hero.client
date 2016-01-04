import React from 'react';
import { Dialog, Toolbar, ToolbarTitle, IconButton, ToolbarGroup,
  List, ListItem, FontIcon, Divider, FlatButton, CardText } from 'material-ui';
import { CustomTabsSwipe, ResumePDFViewer, JobsList, Gravatar } from '../../../components/web';
import Immutable from 'immutable';

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
  statusButton: {
    backgroundColor: '#40bb3f',
    color: '#FFF',
    margin: '14px 0px',
  },
};

class CandidateDetailsModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      candidate: null,
    };
  }

  componentDidMount() {
    //this.props.getAllJobs();
  }

  show(candidate) {
    this.setState({
      open: true,
      candidate,
    });
  }

  closeModal() {
    this.setState({
      open: false,
      candidate: null,
    });
  }

  _handleJobClick(){
    this.props.pushState(null,'/jobs/1a');
  }

  render() {

    //let { jobs } = this.props;

    let jobs = {};
    jobs.list = new Immutable.Map();

    let job = {};
    job['1a'] = {
      title: 'Android Mobile Engineer',
      location: 'Santa Monica, CA',
      id: '1a',
    };

    jobs.list = jobs.list.mergeDeep(job);

    //let picture = null;
    let email = null;
    let phone = null;
    let address = null;
    let city = null;
    let source = null;
    let displayName = null;

    if (this.state.candidate) {
      displayName = this.state.candidate.get('displayName') || null;
      //picture = 'http://www.material-ui.com/images/kerem-128.jpg';
      email = this.state.candidate.get('email') || null;
      phone = this.state.candidate.get('phone') || null;
      address = '1316 3rd St #103';
      city = 'Santa Monica, CA 90401';
      source = 'facebook.com';
    }

    //console.log(this.props.open);

    return (
      <div>
        <Dialog
            open={this.state.open}
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
                <IconButton onTouchTap={this.closeModal.bind(this)} style={style.close} iconClassName='material-icons'>close</IconButton>
                <ToolbarTitle style={style.detailsTitle} text={'Candidate Details'} />
              </ToolbarGroup>
              <ToolbarGroup key={1} float="right">
                <FlatButton style={style.statusButton} label="Vetted" />
              </ToolbarGroup>
            </Toolbar>
            <CustomTabsSwipe
                tabs={['Details', 'Resume', 'Infos', 'Applications']}
                isLight
            >
              <List>
                <div>

                  {(displayName) ? (
                    <ListItem
                        leftAvatar={<Gravatar email={this.state.candidate.get('email')} status={'vetted'} />}
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
              <div className="innerView">
                <ResumePDFViewer file="/sample.pdf" />
              </div>
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
                <JobsList
                    ressourceName="Application"
                    onJobClick={this._handleJobClick.bind(this)}
                    jobs={jobs.list}
                />
              </div>
            </CustomTabsSwipe>
          </div>
        </Dialog>
      </div>
    );
  }
}

CandidateDetailsModal.propTypes = {
  // jobs: React.PropTypes.object.isRequired,
};

export default CandidateDetailsModal;
