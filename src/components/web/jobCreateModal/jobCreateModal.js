import React from 'react';
import { Dialog, Toolbar, ToolbarTitle, IconButton, ToolbarGroup, FlatButton, TextField, DatePicker } from 'material-ui';

let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const style = {
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    zIndex: '10',
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
    minHeight: `${clientHeight}px`,
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
  title: {
    lineHeight:'64px',
    float:'left',
  },
  save: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  floatLabel: {
    left: '0',
  },
  datePicker: {
    width: '100%',
    marginTop: '30px',
  },
  formContent: {
    height: (clientHeight - 64) +'px',
    overflowY: 'scroll',
  }
};

class JobCreateModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  closeModal() {
    this.setState({
      open: false,
    });
  }

  saveJob() {
    console.log('save note!');
    this.setState({
      open: false,
    });
  }

  show() {
    this.setState({
      open: true,
    });
  }

  _handleSubmit(){
    console.log('submit!');
  }

  _handleChange() {

  }

  _datePickerClose() {
    console.log('close!');
  }

  _datePickerOpen() {
    console.log('show!');
  }

  render() {

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
              <IconButton onTouchTap={this.closeModal.bind(this)} style={style.close} iconClassName='material-icons'>close</IconButton>
              <ToolbarTitle style={style.title} text={'Create Job'} />
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right">
              <FlatButton onTouchTap={this.saveJob.bind(this)} style={style.save}>Save</FlatButton>
            </ToolbarGroup>
          </Toolbar>
          <div className="row center-xs" style={style.formContent}>
              <div className="col-xs-10 col-md-6">
                  <div className="box">
                    <form onSubmit={this._handleSubmit.bind(this)}>
                      <div>
                        <TextField
                            fullWidth
                            errorText={''}
                            onChange={this._handleChange.bind(this)}
                            floatingLabelText="Job Title"
                        />
                      </div>
                      <div>
                        <TextField
                            floatingLabelText="Quick Pitch"
                            multiLine
                            fullWidth
                            floatingLabelStyle={style.floatLabel}
                        />
                      </div>
                      <div>
                        <TextField
                            fullWidth
                            errorText={''}
                            onChange={this._handleChange.bind(this)}
                            floatingLabelText="Min Salary"
                        />
                      </div>
                      <div>
                        <TextField
                            fullWidth
                            errorText={''}
                            onChange={this._handleChange.bind(this)}
                            floatingLabelText="Max Salary"
                        />
                      </div>
                      <div>
                        <TextField
                            floatingLabelText="Bonus + Perks"
                            multiLine
                            fullWidth
                            floatingLabelStyle={style.floatLabel}
                        />
                      </div>
                      <div>
                        <TextField
                            floatingLabelText="Job Description"
                            multiLine
                            fullWidth
                            floatingLabelStyle={style.floatLabel}
                        />
                      </div>
                      <div>
                        <DatePicker
                            hintText="Estimated Start Date"
                            textFieldStyle={style.datePicker}
                            onShow={this._datePickerOpen}
                            onRequestClose={this._datePickerClose}
                        />
                      </div>
                      <div>
                        <TextField
                            fullWidth
                            errorText={''}
                            onChange={this._handleChange.bind(this)}
                            floatingLabelText="Fee %"
                        />
                      </div>
                    </form>
                  </div>
              </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

JobCreateModal.propTypes = {
  //open: React.PropTypes.bool.isRequired,
};

export default JobCreateModal;
