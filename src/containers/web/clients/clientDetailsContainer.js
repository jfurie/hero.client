import React from 'react';
import { connect } from 'react-redux';
import { Header, LocationCard } from '../../../components/web';
import { getOneCompany } from '../../../modules/companies';
import { getOneLocation } from '../../../modules/locations';
import { disableSwipeToOpen, enableSwipeToOpen } from '../../../modules/leftNav';

import { Styles, Tabs, Tab, List, ListItem, ListDivider, FontIcon } from 'material-ui';
import SwipeableViews from 'react-swipeable-views';

function getData(state, id) {
  let company = ((state.companies.list.size > 0) ? (state.companies.list.get(id)) : (null));
  let location = null;

  if (company && company.get('location')) {
    location = ((state.locations.list.size > 0) ? (state.locations.list.get(company.get('location'))) : (null));
  }

  //console.log('getData', company, location);

  return {
    company,
    location,
  };
}

const style = {
  tabs: {
    backgroundColor: Styles.Colors.grey900,
  },
};

@connect((state, props) => (
  getData(state, props.params.id)),
  {getOneCompany, getOneLocation, disableSwipeToOpen, enableSwipeToOpen})
class ClientDetailsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      slideIndex: 0,
    };
  }

  componentDidMount() {
    this.props.getOneCompany(this.props.params.id);
  }

  componentWillUnmount() {
    this.props.enableSwipeToOpen();
  }

  componentWillUpdate(nextProps) {
    if (!this.props.location && !nextProps.location && nextProps.company && nextProps.company.get('location')) {
      this.props.getOneLocation(nextProps.company.get('location'));
    }
  }

  _handleChangeIndex(index) {

    this.setState({
      slideIndex: index,
    });

    if (index > 0) {
      this.props.disableSwipeToOpen();
    } else {
      this.props.enableSwipeToOpen();
    }
  }

  _handleChangeTabs(value) {

    var index = parseInt(value, 10);

    if (index > 0) {
      this.props.disableSwipeToOpen();
    } else {
      this.props.enableSwipeToOpen();
    }

    this.setState({
      slideIndex: index,
    });
  }

  render() {

    let {company, location} = this.props;

    //console.log(company, location);

    if (company) {
      return (
        <div>
          <Header title={company.get('name')}/>
          <Tabs tabItemContainerStyle={style.tabs} onChange={this._handleChangeTabs.bind(this)} value={this.state.slideIndex + ''}>
            <Tab label="Details" value="0"></Tab>
            <Tab label="Location" value="1"></Tab>
          </Tabs>
          <SwipeableViews resitance index={this.state.slideIndex} onChangeIndex={this._handleChangeIndex.bind(this)}>
            <List>
              <div>
                <ListItem
                  leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                  primaryText={company.get('website')}
                  secondaryText={<p>website</p>}
                  secondaryTextLines={1}
                />
                <ListDivider inset />
                <ListItem
                  leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                  primaryText={`@${company.get('twitterHandle')}`}
                  secondaryText={<p>twitter</p>}
                  secondaryTextLines={1}
                />
                <ListDivider inset />
                <ListItem
                  leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                  primaryText={company.get('indeedId')}
                  secondaryText={<p>indeed Id</p>}
                  secondaryTextLines={1}
                />
              </div>
            </List>
            <div id="innerView">
              {(company.get('location')) ? (
                  <LocationCard location={location} />
              ) : (<p>No location provided.</p>)}
            </div>
          </SwipeableViews>
        </div>
      );
    } else {
      return (null);
    }
  }
}

export default ClientDetailsPage;
