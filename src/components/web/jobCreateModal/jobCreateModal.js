import React from 'react';
import { Dialog, Toolbar, ToolbarTitle, IconButton, ToolbarGroup, FlatButton, TextField, DatePicker, Card, CardMedia, CardText, LinearProgress,SelectField } from 'material-ui';
import {FileInput} from '../';

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
    height: `${(clientHeight - 64)} px`,
    overflowY: 'scroll',
  },
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
    this.props.saveJob();
  }

  show() {
    this.setState({
      open: true,
    });
  }

  _handleSubmit(){
    console.log('submit!');
  }

  _handleChange(type, e) {
    let change = {};
    change[type] = e.target.value;
    this.props.onJobChange(change);
  }

  _handleStartDateChange(e,value){
    let change = {};
    change['startDate'] = value;
    this.props.onJobChange(change);
  }

  _datePickerClose() {
    console.log('close!');
  }

  _datePickerOpen() {
    console.log('show!');
  }

  onImageChange(value){
    this.props.onImageChange(value);
  }

  _handleSelectValueChange(e, key, payload){
    let change = {};
    change['contactId'] = payload.id;
    this.props.onJobChange(change);
  }

  render() {
    let menuItems = this.props.contacts.list.map((contact) => {
      return {
        id: contact.get('id'),
        name: contact.get('displayName'),
        payload: contact.get('id'),
        text: contact.get('displayName'),
      };
    });
    menuItems = menuItems.toArray();

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
                          <Card>
                            <CardMedia>
                              {(() => {
                                if(this.props.jobImage){
                                  return (<div><img style={{maxWidth:'100%', maxHeight:'300px'}} src={this.props.jobImage.get('item')}></img></div>);
                                } else {
                                  return (<div></div>);
                                }
                              })()}
                            </CardMedia>
                            <CardText>
                              <LinearProgress mode="determinate" value={this.props.job.get('percentUploaded')} />
                              <FileInput label={this.props.jobImage?'Change Photo':'Add Photo'} onFileChanged={this.onImageChange.bind(this)}></FileInput>
                            </CardText>
                          </Card>


                      </div>
                      <div>
                        <TextField
                            fullWidth
                            errorText={''}
                            onChange={this._handleChange.bind(this, 'title')}
                            floatingLabelText="Job Title"
                            value={this.props.job.get('title')}
                        />
                      </div>
                      <div>
                        <TextField
                            floatingLabelText="Quick Pitch"
                            multiLine
                            fullWidth
                            floatingLabelStyle={style.floatLabel}
                            onChange={this._handleChange.bind(this, 'quickPitch')}
                            value={this.props.job.get('quickPitch')}
                        />
                      </div>
                      <div>
                        <TextField
                            fullWidth
                            errorText={''}
                            onChange={this._handleChange.bind(this, 'minSalary')}
                            floatingLabelText="Min Salary"
                            type="number"
                            value={this.props.job.get('minSalary')}
                        />
                      </div>
                      <div>
                        <TextField
                            fullWidth
                            errorText={''}
                            onChange={this._handleChange.bind(this, 'maxSalary')}
                            floatingLabelText="Max Salary"
                            type="number"
                            value={this.props.job.get('maxSalary')}
                        />
                      </div>
                      <div>
                        <TextField
                            floatingLabelText="Bonus + Perks"
                            multiLine
                            fullWidth
                            floatingLabelStyle={style.floatLabel}
                            onChange={this._handleChange.bind(this, 'bonusPerks')}
                            value={this.props.job.get('bonusPerks')}
                        />
                      </div>
                      <div>
                        <TextField
                            floatingLabelText="Job Description"
                            multiLine
                            fullWidth
                            floatingLabelStyle={style.floatLabel}
                            onChange={this._handleChange.bind(this, 'description')}
                            value={this.props.job.get('description')}
                        />
                      </div>
                      <div>
                        <DatePicker
                            hintText="Estimated Start Date"
                            textFieldStyle={style.datePicker}
                            onShow={this._datePickerOpen}
                            onRequestClose={this._datePickerClose}
                            onChange={this._handleStartDateChange.bind(this)}
                            value={this.props.job.get('startDate')}
                            ref="startDate"
                        />
                      </div>
                      <div>
                        <TextField
                            fullWidth
                            errorText={''}
                            floatingLabelText="Fee %"
                            onChange={this._handleChange.bind(this, 'feePercent')}
                            type="number"
                            value={this.props.job.get('feePercent')}
                        />
                      </div>
                      <div>
                        <SelectField
                            ref="selectValue"
                            fullWidth
                            floatingLabelText="Select Primary Contact"
                            value={this.props.job.get('contactId')}
                            valueMember="id"
                            displayMember="name"
                            onChange={this._handleSelectValueChange.bind(this)}
                            menuItems={menuItems}
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
