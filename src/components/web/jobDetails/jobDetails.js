import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
//import md5 from 'md5';

//import CommunicationChat from 'material-ui/lib/svg-icons/communication/chat';

import { Header, DetailsCard, CustomTabsSwipe } from '../../../components/web';
import {
  Dialog, IconButton, List, ListItem, FontIcon,
  Divider, Styles, IconMenu, MenuItem,
} from 'material-ui';

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
};

@connect(() => (
{}), {pushState})
export default class JobDetails extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      justInvited: false,
      confirmOpen: false,
    };
  }

  // editContactModalOpen(){
  //   console.log('yo!');
  // }

  goBack() {
    if (this.props.onJobDetailsClose) {
      this.props.onJobDetailsClose();
    }
  }

  _onTouchTapSave() {
    console.log('_onTouchTapSave');
  }

  _onTouchTapShare() {
    console.log('_onTouchTapShare');
  }

  _onTouchTapSearch() {
    console.log('_onTouchTapSearch');
  }

  // _handleTapOnApplications() {
  //   console.log('_handleTapOnApplications');
  // }

  renderContent(job) {

    // //let picture = null;
    // let email = null;
    // let phone = null;
    // let addressLine = null;
    // let city = null;
    // let postalCode = null;
    // //let countryCode = null;
    // let countrySubDivisionCode = null;
    // let source = null;
    // let displayName = null;
    // //let invited = false;
    //
    if (job) {
    //   displayName = contact.get('displayName') || null;
    //   email = contact.get('email') || null;
    //   phone = contact.get('phone') || null;
    //   //invited = contact.get('isInvited');
    //
    //   if (contact.get('sourceInfo') && contact.get('sourceInfo').get('referrer')) {
    //     source = contact.get('sourceInfo').get('referrer');
    //   }
    //
    //   // location stuff
    //   let address = contact.get('_address');
    //
    //   if (address) {
    //     addressLine = address.get('addressLine') || null;
    //     city = address.get('city') || null;
    //     postalCode = address.get('postalCode') || null;
    //     countrySubDivisionCode = address.get('countrySubDivisionCode') || null;
    //
    //     if (city && countrySubDivisionCode) {
    //       city += `, ${countrySubDivisionCode}`;
    //     }
    //
    //     if (city && postalCode) {
    //       city += ` ${postalCode}`;
    //     }
    //   }

      // get cover
      let cover = ((job.get('image')) ? (job.get('image').get('item')) : ('/img/default-job.jpg'));

      let actions = [{
        materialIcon: 'search',
        text: 'Find',
        onTouchTap: this._onTouchTapSearch.bind(this),
      }, {
        materialIcon: 'star_rate',
        text: 'Save',
        onTouchTap: this._onTouchTapSave.bind(this),
      }, {
        materialIcon: 'share',
        text: 'Share',
        onTouchTap: this._onTouchTapShare.bind(this),
      }];

      return (

        <div>
          <DetailsCard
              title={job.get('title')}
              subtitle={job.get('company').get('name')}
              cover={cover}
              mainColor={Styles.Colors.amber700}
              actions={actions}
              floatActionOnTap={this._onTouchTapShare.bind(this)}
              floatActionContent={<div><p style={{color: `${Styles.Colors.amber700}`, fontSize: '20px', fontWeight: '500'}}>{job.get('candidates').length}</p></div>}
          />
          <CustomTabsSwipe isLight isInline ref='customTabsSwipe' tabs={['Details', 'Desc', 'Applicants']}>
            <div><p>toto</p></div>
            <div><p>toto2</p></div>
            <div><p>toto3</p></div>
          </CustomTabsSwipe>
          {/* <List style={{position: 'relative', top: '3px'}}>
            <div>

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

              {(addressLine) ? (
                <div>
                  <Divider inset />
                  <ListItem
                    leftIcon={<FontIcon className="material-icons">place</FontIcon>}
                    primaryText={addressLine}
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
          </List> */}
        </div>
      );

    }
    else {
      return (<div></div>);
    }
  }

  render() {

    let { job } = this.props;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let contentHeight = clientHeight;

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
            <Header transparent goBack={this.goBack.bind(this)} iconRight={
              <IconMenu iconButtonElement={
                <IconButton iconClassName="material-icons">more_vert</IconButton>
              }>
                <MenuItem index={0} primaryText="Edit Job" />
              </IconMenu>
            }
            />
            <div style={{height: `${contentHeight}px`, overflowY:'scroll', WebkitOverflowScrolling:'touch'}}>
              {this.renderContent(job)}
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

JobDetails.propTypes = {
  job: React.PropTypes.object,
  onJobDetailsClose: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
};
