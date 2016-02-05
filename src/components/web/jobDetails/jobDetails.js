import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import md5 from 'md5';

import CommunicationChat from 'material-ui/lib/svg-icons/communication/chat';

import { Header, DetailsCard } from '../../../components/web';
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
    if (this.props.onContactDetailsClose) {
      this.props.onContactDetailsClose();
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

      // build cover
      let cover = 'https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11410518_112057692469780_1792210714_n.jpg';

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
              subtitle={job.get('title')}
              cover={cover}
              mainColor={Styles.Colors.indigo500}
              actions={actions}
              floatActionOnTap={this._onTouchTapShare.bind(this)}
              floatActionContent={<CommunicationChat color={Styles.Colors.indigo500}/>}
          />
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
