import React from 'react';
import { CustomTabsSwipe, CandidatesList, LocationCard, ContactDetailsModal } from '../../../components/web';
import { List , ListItem, FontIcon, Card, Avatar, CardText, CardMedia, FlatButton, CardHeader, CardActions } from 'material-ui';

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

    let heroContact = '/img/rameet.jpg';
    return (
      <div>

        <ContactDetailsModal open={this.state.contactDetailsModalOpen} closeModal={this.contactDetailsModalClose.bind(this)} contact={this.state.detailsContact}/>
        <CustomTabsSwipe isLight={isLight} tabs={['Details', 'Description', 'Candidates', 'Notes']}>
          <div style={style.slide}>
            <Card>
            {/*  <div className="mediawrap">
                <CardMedia overlay={
                    <div className='row'>
                      <div className='col-xs-9'>
                        <CardTitle titleStyle={{color:'rgba(255, 255, 255, 0.87)'}} subtitleStyle={{color:'rgba(255, 255, 255, 0.54)'}} title="Andriod Mobile Engineer" subtitle="FreedomPop"/>

                        </div>
                      <div className='col-xs-3'>
                        <div className="button-right-bottom">
                        <RaisedButton label="Apply" primary={true} />
                        </div>
                      </div>
                    </div>
                  }>
                  <img src='https://scontent.cdninstagram.com/hphotos-xft1/t51.2885-15/e15/11378685_847466158664846_945103283_n.jpg'></img>
                </CardMedia>
              </div>*/}
                <div className="mediawrap">
                <CardMedia>
                  <img src='https://scontent.cdninstagram.com/hphotos-xft1/t51.2885-15/e15/11378685_847466158664846_945103283_n.jpg'></img>
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
                      <div style={{fontSize:'16px','color':'green'}} className='col-xs-4'>140k <div style={{fontSize:'11px','color':'rgba(0,0,0,0.54)'}}>salary</div></div>
                      <div style={{fontSize:'16px','color':'green'}} className='col-xs-4'>Permanent <div style={{fontSize:'11px','color':'rgba(0,0,0,0.54)'}}>position</div></div>
                      <div style={{fontSize:'16px','color':'green'}} className='col-xs-4'>25 <div style={{fontSize:'11px','color':'rgba(0,0,0,0.54)'}}>applicants</div></div>
                    </div>
                  </CardText>
                </Card>
              </CardText>
              <CardText >
                <div className="description">
                  <p>
                    Telecom startup disrupting a $100B industry with free mobile and home internet service. Funded by the founder of Skype. Java/Spring/JPA/Hibernate/Redis; *Now requires experience with a client-side JavaScript MVC framework (Angular, React, Backbone, Ember)
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
                        disabled={true}
                      />
                      <ListItem
                        leftIcon={<FontIcon className='material-icons'>attach_money</FontIcon>}
                        primaryText={'20%'}
                        secondaryText={<p>fee</p>}
                        secondaryTextLines={1}
                        disabled={true}
                      />
                      <ListItem
                        leftIcon={<FontIcon className='material-icons'>attach_money</FontIcon>}
                        primaryText={'$30,000'}
                        secondaryText={<p>estimated fee</p>}
                        secondaryTextLines={1}
                        disabled={true}
                      />
                      <ListItem
                        leftIcon={<FontIcon className='material-icons'>person</FontIcon>}
                        primaryText={'Permanent'}
                        secondaryText={<p>position type</p>}
                        secondaryTextLines={1}
                        disabled={true}
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
                  <h3 className='c2'><a name='h.2qn7ea1nr273' /><span>Job Description</span></h3><p className='c4'><span className='c0'>Our client is a first-of-its-kind technology startup that is disrupting a multi-billion dollar industry. They have a significant amount of funding, and their backers include founders of companies that have become household names. They are currently hiring for a Senior Software Engineer who has a background building high-traffic, multi-threaded software systems using MVC frameworks like and and has strong relational and ideally database experience.</span></p><h4 className='c2'><a name='h.usesbgd80cl3' /><span>The non-negotiables:</span></h4><ul className='c7 lst-kix_p70ulp80wgsv-0 start'><li className='c4 c5'><span className='c0'>&nbsp;5+ years of Java Development experience</span></li><li className='c4 c5'><span className='c0'>Experience with a client-side JavaScript MVC framework (Angular, React, Backbone, Ember)</span></li><li className='c4 c5'><span className='c0'>Expertise with Spring and Hibernate / JPA</span></li><li className='c4 c5'><span className='c0'>&nbsp;Experience with relational databases like SQL Server, MySQL</span></li><li className='c4 c5'><span className='c0'>Exposure to technologies, i.e. preferred</span></li><li className='c4 c5'><span className='c0'>A Bachelor's degree in Computer Science or greater</span></li></ul><h4 className='c2'><a name='h.1klbg0xnecvg' /><span>The reasons to work there:</span></h4><ul className='c7 lst-kix_ue7i54lkmb8h-0 start'><li className='c4 c5'><span className='c0'>Competitive compensation package with excellent benefits</span></li><li className='c4 c5'><span className='c0'>The chance to put your stamp on a platform that's already used by millions of people and gaining thousands of users every day</span></li><li className='c4 c5'><span className='c0'>The stability of a well-funded company with traction, with the excitement of a startup</span></li><li className='c4 c5'><span className='c0'>Huge growth opportunity</span></li></ul><p className='c1'><span className='c0' /></p><p className='c4'><span className='c0'>If this fits your background and you're ready to make a huge impact at a small company, apply now. We look forward to speaking with you soon.</span></p><p className='c4'><span className='c0'>Local candidates are strongly preferred. Sponsorship is not an option at this time.</span></p><p className='c6'><span /></p>
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
