import React from 'react';
import { CustomTabsSwipe, CandidatesList, LocationCard, ContactDetailsModal } from '../../../components/web';
import { List , ListItem, FontIcon, Card, Avatar, CardText, CardMedia, FlatButton, CardHeader, CardActions } from 'material-ui';
import marked from 'marked';

import './jobDetails.scss';

const style = {
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
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

  render(){
    let { contacts, location, isLight, job, jobImage } = this.props;

    console.log(this.props, 'jobDetails');

    let fakeDescription = 'I am using __markdown__.\n\nRendered bold **marked**. ![https://media.giphy.com/media/wranrCRq3f90A/giphy.gif](https://media.giphy.com/media/wranrCRq3f90A/giphy.gif)';

    // mardown to html
    let description = marked(fakeDescription);

    let heroContact = '/img/rameet.jpg';
    return (
      <div>
        <ContactDetailsModal open={this.state.contactDetailsModalOpen} closeModal={this.contactDetailsModalClose.bind(this)} contact={this.state.detailsContact}/>
        <CustomTabsSwipe isLight={isLight} tabs={['Details', 'Description', 'Candidates', 'Notes']}>
          <div style={style.slide}>
            <Card>
                <div className="mediawrap">
                <CardMedia>
                  <img src={jobImage?jobImage.get('item'):'https://scontent.cdninstagram.com/hphotos-xft1/t51.2885-15/e15/11378685_847466158664846_945103283_n.jpg'}></img>
                </CardMedia>
                <div className="button-right-bottom">
                  <FlatButton className='ghost' style={{backgroundColor:'rgba(0,0,0,0.70)',border:'1px solid rgba(255,255,255,0.70)', color:'rgba(255,255,255,0.97)', borderRadius:'5px'}} label="Apply" />
                </div>
                <div className="button-left-bottom">
                  <FlatButton className='ghost' style={{backgroundColor:'rgba(0,0,0,0.70)',border:'1px solid rgba(255,255,255,0.70)', color:'rgba(255,255,255,0.97)', borderRadius:'5px'}}  label="Share">
                  </FlatButton>
                </div>
              </div>
              <CardText>
                <Card>
                  <CardText>
                    <div className='row center-xs'>
                      <div style={{fontSize:'16px','color':'green'}} className='col-xs-4'><div>${job?job.get('minSalary'):''}</div> <div style={{fontSize:'11px', color:'rgba(0,0,0,0.54)'}}>to</div> <div>${job?job.get('maxSalary'):''}</div> <div style={{fontSize:'11px','color':'rgba(0,0,0,0.54)'}}>salary</div></div>
                      <div style={{fontSize:'16px','color':'green'}} className='col-xs-4'>{job?job.get('employmentType'):''} <div style={{fontSize:'11px','color':'rgba(0,0,0,0.54)'}}>position</div></div>
                      <div style={{fontSize:'16px','color':'green'}} className='col-xs-4'>25 <div style={{fontSize:'11px','color':'rgba(0,0,0,0.54)'}}>candidates</div></div>
                    </div>
                  </CardText>
                </Card>
              </CardText>
              <CardText >
                <div className="description">
                  <p>
                    {job?job.get('quickPitch'):''}
                  </p>
                </div>
              </CardText>

              <CardText>
                <LocationCard style={{height: '200px'}} location={location} />
              </CardText>

              <CardText>
                <Card>
                  <List subheader='Compensation Details'>
                    <ListItem
                        leftIcon={<FontIcon className='material-icons'>attach_money</FontIcon>}
                        primaryText={'$150,000'}
                        secondaryText={<p>salary</p>}
                        secondaryTextLines={1}
                        disabled
                    />
                    <ListItem
                        leftIcon={<FontIcon className='material-icons'>attach_money</FontIcon>}
                        primaryText={'20%'}
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
              <List subheader='Job Contact'>
                {(heroContact) ? (
                  <ListItem
                    leftAvatar={<Avatar>S</Avatar>}
                    primaryText={'Scott Bendar'}
                    secondaryText={<p>CTO, FreedomPop</p>}
                    secondaryTextLines={1}
                  />
                ) : (null)}
              </List>
              <List subheader='Your HERO talent advocate'>
                {(heroContact) ? (
                  <ListItem
                    leftAvatar={<Avatar src={heroContact} />}
                    primaryText={'Rameet Singh'}
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
            <CandidatesList candidates={contacts.list} />
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
