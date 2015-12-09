import React from 'react';
import { connect } from 'react-redux';
import { getOneJob } from '../../../modules/jobs';
import { getAllContacts } from '../../../modules/contacts';
import { getOneLocation } from '../../../modules/locations';
import { Header, ContactsList, LocationCard} from '../../../components/web';
import {Styles,  IconMenu, IconButton, Tabs, Tab,List , ListItem, FontIcon, Card, CardHeader, Avatar, CardText, CardTitle} from 'material-ui';
import { disableSwipeToOpen, enableSwipeToOpen } from '../../../modules/leftNav';
import SwipeableViews from 'react-swipeable-views';
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
            <IconButton  iconClassName="material-icons">more_vert</IconButton>
          }>
            <MenuItem index={0} primaryText="Find Candidates" />
          </IconMenu>
        } title={job?job.get('title'):''} />
        <Tabs tabItemContainerStyle={style.tabs} onChange={this._handleChangeTabs.bind(this)} value={this.state.slideIndex + ''}>
          <Tab label="Details" value="0"></Tab>
          <Tab label="Description" value="1"></Tab>
          <Tab label="Candidates" value="2"></Tab>
          <Tab label="Notes" value="3"></Tab>
        </Tabs>
        <SwipeableViews resitance index={this.state.slideIndex} onChangeIndex={this._handleChangeIndex.bind(this)}>
          <div style={style.slide}>
            <Card>
              <List>
                  <ListItem
                    leftIcon={<FontIcon className="material-icons">timeline</FontIcon>}
                    primaryText={<p style={{'color':'green'}}>Active</p>}
                    secondaryText={<p>status</p>}
                    secondaryTextLines={1}
                    disabled={true}
                  />
                  <ListItem
                    leftIcon={<FontIcon className="material-icons">people</FontIcon>}
                    primaryText={<p style={{'color':'green'}}>25</p>}
                    secondaryText={<p>applicants</p>}
                    secondaryTextLines={1}
                    disabled={true}
                  />
                  <ListItem
                    leftIcon={<FontIcon className="material-icons">date_range</FontIcon>}
                    primaryText={<p style={{'color':'green'}}>25</p>}
                    secondaryText={<p>days open</p>}
                    secondaryTextLines={1}
                    disabled={true}
                  />
              </List>
              <CardText >
                <p>
                  Telecom startup disrupting a $100B industry with free mobile and home internet service. Funded by the founder of Skype. Java/Spring/JPA/Hibernate/Redis; *Now requires experience with a client-side JavaScript MVC framework (Angular, React, Backbone, Ember)
                </p>
              </CardText>

              <CardText>
                <Card>
                  <List subheader="Compensation Details">
                      <ListItem
                        leftIcon={<FontIcon className="material-icons">attach_money</FontIcon>}
                        primaryText={'$150,000'}
                        secondaryText={<p>salary</p>}
                        secondaryTextLines={1}
                        disabled={true}
                      />
                      <ListItem
                        leftIcon={<FontIcon className="material-icons">attach_money</FontIcon>}
                        primaryText={'20%'}
                        secondaryText={<p>fee</p>}
                        secondaryTextLines={1}
                        disabled={true}
                      />
                      <ListItem
                        leftIcon={<FontIcon className="material-icons">attach_money</FontIcon>}
                        primaryText={'$30,000'}
                        secondaryText={<p>estimated fee</p>}
                        secondaryTextLines={1}
                        disabled={true}
                      />
                      <ListItem
                        leftIcon={<FontIcon className="material-icons">person</FontIcon>}
                        primaryText={'Permanent'}
                        secondaryText={<p>position type</p>}
                        secondaryTextLines={1}
                        disabled={true}
                      />
                  </List>
                </Card>
              </CardText>

              <LocationCard style={{height: '200px'}} location={location} />
            <List subheader="Job Contact">
              {(heroContact) ? (
                <ListItem
                  leftAvatar={<Avatar>S</Avatar>}
                  primaryText={'Scott Bendar'}
                  secondaryText={<p>CTO, FreedomPop</p>}
                  secondaryTextLines={1}
                />
              ) : (null)}
              </List>
              <List subheader="Your HERO talent advocate">
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
            1
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
