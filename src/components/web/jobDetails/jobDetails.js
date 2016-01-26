import React from 'react';
import Immutable from 'immutable';
import { CustomTabsSwipe, CandidatesList, LocationCard, ContactDetailsModal, Gravatar } from '../../../components/web';
import { List , ListItem, Card, Avatar, CardText, CardMedia, FlatButton, CardHeader, CardActions, RaisedButton } from 'material-ui';
import marked from 'marked';

import './jobDetails.scss';

const style = {
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
    // marginTop: '48px',
  },
};

class JobDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      contactDetailsModalOpen: false,
    };
  }
  contactDetailsModalOpen(contact) {
    this.setState({
      contactDetailsModalOpen: true,
      detailsContact: contact,
    });
  }

  contactDetailsModalClose() {
    this.setState({
      contactDetailsModalOpen: false,
      detailsContact: null,
    });
  }
  candidateSearchModalClose(){

  }

  saveContact(){
    console.log('save contact');
  }

  render() {
    let { location, isLight, job } = this.props;
    job =  job || new Immutable.Map();
    let jobImage = ((job) ? (job.get('image')) : (null));
    let jobCandidates = ((job) ? (job.get('candidates')) : ([]));
    jobCandidates = jobCandidates || [];

    // mardown to html
    //let fakeDescription = 'I am using __markdown__.\n\nRendered bold **marked**. ![https://media.giphy.com/media/wranrCRq3f90A/giphy.gif](https://media.giphy.com/media/wranrCRq3f90A/giphy.gif)';
    let description = job.get('description')?marked(job.get('description')):'';
    let pitch = job.get('quickPitch')?marked(job.get('quickPitch')) : '';
    let heroContact = '/img/rameet.jpg';
  //  let range = '$'+job?job.get('minSalary'):'' + 'to $'+ job?job.get('maxSalary'):'';
    return (
      <div>
        <ContactDetailsModal open={this.state.contactDetailsModalOpen} closeModal={this.contactDetailsModalClose.bind(this)} contact={this.state.detailsContact}/>
        <CustomTabsSwipe isLight={isLight} tabs={['Details', 'Description', 'Candidates', 'Notes']} >
          <div style={style.slide}>
            <Card>
              {(jobImage) ? (
                <div className="mediawrap">
                  <CardMedia>
                    <img src={jobImage.get('item')} />
                  </CardMedia>
                  {/*<div className="button-right-bottom">
                    <FlatButton className='ghost' style={{backgroundColor:'rgba(0,0,0,0.70)',border:'1px solid rgba(255,255,255,0.70)', color:'rgba(255,255,255,0.97)', borderRadius:'5px'}} label="Apply" />
                  </div>
                  <div className="button-left-bottom">
                    <FlatButton className='ghost' style={{backgroundColor:'rgba(0,0,0,0.70)',border:'1px solid rgba(255,255,255,0.70)', color:'rgba(255,255,255,0.97)', borderRadius:'5px'}}  label="Share" />
                  </div>*/}
                </div>
              ) : (null)}
              <CardText>
                <Card>
                  <CardText>
                    <div className='row center-xs'>
                      <div style={{fontSize:'16px','color':'green'}} className='col-xs-4'><div>${job?job.get('minSalary'):''}</div> <div style={{fontSize:'11px', color:'rgba(0,0,0,0.54)'}}>to</div> <div>${job?job.get('maxSalary'):''}</div> <div style={{fontSize:'11px','color':'rgba(0,0,0,0.54)'}}>salary</div></div>
                      <div style={{fontSize:'16px','color':'green'}} className='col-xs-4'>{job?job.get('employmentType'):''} <div style={{fontSize:'11px','color':'rgba(0,0,0,0.54)'}}>position</div></div>
                      <div style={{fontSize:'16px','color':'green'}} onTouchTap={this._slideToCandidateTab.bind(this)} className='col-xs-4'>{jobCandidates.length} <div style={{fontSize:'11px','color':'rgba(0,0,0,0.54)'}}>candidates</div></div>
                    </div>
                  </CardText>
                </Card>
              </CardText>
              <CardText>
                <div>Skills</div>
                {job.get('skills')? job.get('skills').map(function(skill){
                  return (<span><RaisedButton style={{marginBottom:'5px'}} secondary={true} label={skill}>
                  </RaisedButton> &nbsp;</span>
                );
                }): null}
              </CardText>
              <CardText >
                Quick Pitch
                <div className="description">
                  <p dangerouslySetInnerHTML={{__html: pitch}}>
                  </p>
                </div>
              </CardText>

              <CardText>
                <LocationCard style={{height: '200px'}} location={location} />
              </CardText>

              {
                /*
                <CardText>
                  <Card>
                    <List subheader='Compensation Details'>
                      <ListItem
                          leftIcon={<FontIcon className='material-icons'>attach_money</FontIcon>}
                          primaryText={range}
                          secondaryText={<p>salary</p>}
                          secondaryTextLines={1}
                          disabled
                      />
                      <ListItem
                          leftIcon={<FontIcon className='material-icons'>attach_money</FontIcon>}
                          primaryText={job?job.get('fee'):''}
                          secondaryText={<p>fee</p>}
                          secondaryTextLines={1}
                          disabled
                      />
                      <ListItem
                          leftIcon={<FontIcon className='material-icons'>attach_money</FontIcon>}
                          primaryText={'$30,000'}
                          secondaryText={<p>estimated fee</p>}
                          secondaryTextLines={1}
                          disabled
                      />
                      <ListItem
                          leftIcon={<FontIcon className='material-icons'>person</FontIcon>}
                          primaryText={'Permanent'}
                          secondaryText={<p>position type</p>}
                          secondaryTextLines={1}
                          disabled
                      />
                    </List>
                  </Card>
                </CardText>
                */
              }
              <List subheader='Job Contact'>
                {(job.get('contact')) ? (
                  <ListItem
                    leftAvatar={<Gravatar email={job.get('contact').get('email')} status={'vetted'} />}
                    primaryText={job.get('contact').get('displayName')}
                    secondaryText={<p>Job Contact</p>}
                    secondaryTextLines={1}
                  />
                ) : (null)}
              </List>
              <List subheader='Your HERO talent advocate'>
                {(job.get('talentAdvocate')) ? (
                  <ListItem
                    leftAvatar={<Gravatar email={job.get('talentAdvocate').get('email')} status={'vetted'} />}
                    primaryText={job.get('talentAdvocate').get('displayName')}
                    secondaryText={<p>Hero Talent Advocate</p>}
                    secondaryTextLines={1}
                  />
                ) : (null)}
              </List>
            </Card>
          </div>
          <div style={style.slide}>
            <Card>
              <CardText >
                <div className='description'>
                  <h3>Job Description</h3>
                  <div dangerouslySetInnerHTML={{__html: description}} />
                </div>
              </CardText>
            </Card>
          </div>
          <div style={style.slide}>
            <CandidatesList candidates={jobCandidates} />
          </div>
          <div style={style.slide}>
            <div>
              <Card initiallyExpanded>
                <CardHeader
                  title="Rameet Singh"
                  subtitle="Private | 59 mins ago"
                  avatar={<Avatar src={heroContact} />}>
                </CardHeader>
                <CardText expandable>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                  Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                </CardText>
                <CardActions expandable>
                  <FlatButton label="Edit"/>
                  <FlatButton label="Delete"/>
                </CardActions>
              </Card>
              <Card initiallyExpanded>
                <CardHeader
                  title="Rameet Singh"
                  subtitle="Private | 60 mins ago"
                  avatar={<Avatar src={heroContact} />}>
                </CardHeader>
                <CardText expandable>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                  Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                  Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                </CardText>
                <CardActions expandable>
                  <FlatButton label="Edit"/>
                  <FlatButton label="Delete"/>
                </CardActions>
              </Card>
            </div>
          </div>
        </CustomTabsSwipe>
      </div>
    );
  }
}

export default JobDetails;
