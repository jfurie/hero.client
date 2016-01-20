import React from 'react';
import { connect } from 'react-redux';

import { Dialog, Toolbar, ToolbarTitle, IconButton, ToolbarGroup,
  List, ListItem, FontIcon, Divider, FlatButton } from 'material-ui';
import { Gravatar } from '../../../components/web';

import { createCandidate } from '../../../modules/candidates';

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
  addCandidate: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
};

@connect(() => (
{}), {createCandidate}, null, {withRef: true})
class CandidateCreateFromContactModal extends React.Component {

  constructor(props) {
    super(props);
  }

  closeModal() {
    this.props.close();
  }

  closeAllModals() {
    this.props.closeAll();
  }

  addCandidate() {
    this.props.createCandidate(this.props.contact, this.props.jobId);
    this.closeAllModals();
  }

  render() {

    let { contact } = this.props;

    //let picture = null;
    let email = null;
    let phone = null;
    let address = null;
    let city = null;
    let postalCode = null;
    //let countryCode = null;
    let countrySubDivisionCode = null;
    let source = null;
    let displayName = null;

    if (contact) {
      displayName = contact.get('displayName') || null;
      //picture = 'http://www.material-ui.com/images/kerem-128.jpg';
      email = contact.get('email') || null;
      phone = contact.get('phone') || null;
      address = contact.get('_address').get('addressLine') || null;
      city = contact.get('_address').get('city') || null;
      postalCode = contact.get('_address').get('postalCode') || null;
      //countryCode = contact.get('_address').countryCode || null;
      countrySubDivisionCode = contact.get('_address').get('countrySubDivisionCode') || null;

      if (contact.get('sourceInfo') && contact.get('sourceInfo').get('referrer')) {
        source = contact.get('sourceInfo').get('referrer');
      }
    }

    if (city && countrySubDivisionCode) {
      city += `, ${countrySubDivisionCode}`;
    }

    if (city && postalCode) {
      city += ` ${postalCode}`;
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
                <IconButton onTouchTap={this.closeModal.bind(this)} style={style.close} iconClassName='material-icons'>close</IconButton>
                <ToolbarTitle style={style.detailsTitle} text={'Candidate Details'} />
              </ToolbarGroup>
              <ToolbarGroup key={1} float="right">
              {
                !this.props.isCandidate ?
                <FlatButton onTouchTap={this.addCandidate.bind(this)} style={style.addCandidate}>Add</FlatButton>
                :
                ''
              }
              </ToolbarGroup>
            </Toolbar>
            <List>
              <div>

                {(displayName) ? (
                  <ListItem
                    leftAvatar={<Gravatar email={email} />}
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
          </div>
        </Dialog>
      </div>
    );
  }
}

CandidateCreateFromContactModal.propTypes = {
  contact: React.PropTypes.object,
  open: React.PropTypes.bool.isRequired,
};

export default CandidateCreateFromContactModal;
