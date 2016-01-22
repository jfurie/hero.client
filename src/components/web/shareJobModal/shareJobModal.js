import React from 'react';
import { connect } from 'react-redux';
import {
  Dialog, Toolbar, ToolbarTitle, IconButton,
  ToolbarGroup, FlatButton, SelectField, TextField,
  MenuItem, Snackbar,
} from 'material-ui';
import { shareJob } from '../../../modules/jobs/index';

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
  share: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  select: {
    textAlign: 'left',
    color: '#000',
  },
  floatLabel: {
    top: '12px',
    color: 'rgba(0, 0, 0, 0.298039)',
    fontSize: '12px',
    transform: 'none',
  },
  error: {
    float: 'left',
  },
  textField: {
    'width': '100%',
  },
};

@connect(() => ({}), {shareJob}, null, {withRef: true})
class ShareJobModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      shareJob: {
        selectedContact: null,
        note: null,
      },
      error: false,
      open: false,
    };
  }

  closeModal() {
    this.setState({
      open: false,
    });
  }

  _handleChange(e, field) {
    let newShareJob = this.state.shareJob;
    let value = (e.target.value === '') ? (null) : (e.target.value);

    if (value) {
      newShareJob[field] = value;
    } else {
      delete newShareJob[field];
    }

    this.setState({
      shareJob: newShareJob,
    });
  }

  _handleErrorClose() {
    this.setState({
      error: false,
    });
  }

  _share() {

    this.setState({
      error: false,
    });

    if (this.state.shareJob.selectedContact) {

      let data = {
        contactId: this.state.shareJob.selectedContact.get('id'),
        note: this.state.shareJob.note || null,
        domain: location.origin,
      };

      this.props.shareJob(this.props.jobId, data);
      this.closeModal();
    } else {
      this.setState({
        error: true,
      });
    }
  }

  show() {
    this.setState({
      open: true,
    });
  }

  _handleRecipientChange(event, index, value) {
    let state = this.state;
    state.shareJob.selectedContact = value;
    this.setState(state);
  }

  render() {

    let { companyContacts } = this.props;
    return (
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
              <IconButton onTouchTap={this.closeModal.bind(this)} style={style.close} iconClassName="material-icons">close</IconButton>
              <ToolbarTitle style={style.detailsTitle} text={'Share Job'} />
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right">
              <FlatButton onTouchTap={this._share.bind(this)} style={style.share}>Share</FlatButton>
            </ToolbarGroup>
          </Toolbar>
          <div className="row center-xs">
            <div className="col-xs-10 col-md-6">
              <div className="box">
                <SelectField
                    floatingLabelText="Recipient:"
                    floatingLabelStyle={style.floatLabel}
                    fullWidth
                    style={style.select}
                    onChange={this._handleRecipientChange.bind(this)}
                    hintText={''}
                    value={this.state.shareJob.selectedContact}
                >
                  {companyContacts.map((contact) => {
                    return (
                      <MenuItem disabled={!contact.get('isInvited')} value={contact} primaryText={contact.get('displayName')} />
                    );
                  })}

                </SelectField>
                <div>
                  <TextField
                      style={style.textField}
                      errorText={''}
                      errorStyle={style.error}
                      onChange={(e) => this._handleChange.bind(this)(e, 'note')}
                      floatingLabelText="Email note (optional)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Snackbar
            action="ok"
            open={this.state.error}
            onRequestClose={this._handleErrorClose.bind(this)}
            autoHideDuration={2500}
            message="Please select a recipient!"
            ref="snackbar"
        />

      </Dialog>
    );
  }
}

ShareJobModal.propTypes = {
  //open: React.PropTypes.bool.isRequired,
  companyContacts: React.PropTypes.object,
  jobId: React.PropTypes.string,
};

export default ShareJobModal;
