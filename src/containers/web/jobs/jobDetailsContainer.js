import React from 'react';
import { connect } from 'react-redux';
import { getOneJob } from '../../../modules/jobs';
import { getAllContacts } from '../../../modules/contacts';
import { getOneLocation } from '../../../modules/locations';
import { Header, ContactsList, LocationCard} from '../../../components/web';
import {Styles,  IconMenu, IconButton, Tabs, Tab,List , ListItem, FontIcon, Card, CardHeader, Avatar, CardText, CardTitle, CardMedia, FlatButton, RaisedButton} from 'material-ui';
import { disableSwipeToOpen, enableSwipeToOpen } from '../../../modules/leftNav';
import SwipeableViews from 'react-swipeable-views';
import './jobDetailsContainer.scss';
let MenuItem = require('material-ui/lib/menus/menu-item');

const style = {
  tabs: {
    backgroundColor: Styles.Colors.grey900,
  },
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

function getData(state, id) {
  let location = ((state.locations.list.size > 0) ? (state.locations.list.get('566791aa15d3e38a0cbdecb6')) : (null));
  return {
    job: state.jobs.list.get(id),
    contacts: state.contacts,
    location
  }
}

@connect((state, props) => (
  getData(state, props.params.id)),
  {getOneJob, disableSwipeToOpen, enableSwipeToOpen, getAllContacts, getOneLocation})
class JobDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={slideIndex: 0};
  }

  componentDidMount() {
    this.props.getOneJob(this.props.params.id);
    this.props.getAllContacts();
    this.props.getOneLocation('566791aa15d3e38a0cbdecb6');
  }

  _handleChangeTabs(value) {

    let index = ~~(value);
    //
    if (index > 0) {
      this.props.disableSwipeToOpen();
    } else {
      this.props.enableSwipeToOpen();
    }


    this.setState({
      slideIndex: index,
    });
  }
  _handleChangeIndex(index) {
    this.setState({
      slideIndex: index,
    });

    if (index === 1) {
      this.props.disableSwipeToOpen();
    }

    if (index === 0) {
      this.props.enableSwipeToOpen();
    }

    // if (index > 0) {
    //   this.props.disableSwipeToOpen();
    // } else {
    //   this.props.enableSwipeToOpen();
    // }
  }

  render(){
    let {job, contacts, location} = this.props;
    let heroContact = '/img/rameet.jpg';
    return (
      <div>
        <Header iconRight={
          <IconMenu iconButtonElement={
            <IconButton  iconClassName='material-icons'>more_vert</IconButton>
          }>
            <MenuItem index={0} primaryText='Find Candidates' />
          </IconMenu>
        } title={job?job.get('title'):''} />
        <Tabs tabItemContainerStyle={style.tabs} onChange={this._handleChangeTabs.bind(this)} value={this.state.slideIndex + ''}>
          <Tab label='Details' value='0'></Tab>
          <Tab label='Description' value='1'></Tab>
          <Tab label='Candidates' value='2'></Tab>
          <Tab label='Notes' value='3'></Tab>
        </Tabs>
        <SwipeableViews resitance index={this.state.slideIndex} onChangeIndex={this._handleChangeIndex.bind(this)}>
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
                <div className='description'>
                  <p >
                    Telecom startup disrupting a $100B industry with free mobile and home internet service. Funded by the founder of Skype. Java/Spring/JPA/Hibernate/Redis; *Now requires experience with a client-side JavaScript MVC framework (Angular, React, Backbone, Ember)
                  </p>
                </div>

              </CardText>
              <CardText >
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
            <ContactsList contacts={contacts.list} />
          </div>
          <div style={style.slide}>
            3
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default JobDetailsPage;
