import React from 'react';
import { connect } from 'react-redux';
import { Dialog, IconButton, FlatButton, TextField } from 'material-ui';

import { createCandidate } from '../../../modules/candidates';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import validateCandidate from '../../../validators/candidate';

const style = {
  error: {
    float: 'left',
  },
  textField: {
    'width': '100%',
  },
};

@connect(() => (
{}), {createCandidate}, null, {withRef: true})
export default class CandidateCreateModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      candidate: {},
      errors: {},
      open: false,
    };
  }

  show() {
    this.setState({
      open: true,
    });
  }

  closeModal(){
    this.setState({
      open: false,
    });
  }

  _handleChange(e, field) {
    let newCandidate = this.state.candidate;
    let value = (e.target.value === '') ? (null) : (e.target.value);

    if (value) {
      newCandidate[field] = value;
    } else {
      delete newCandidate[field];
    }

    this.setState({
      candidate: newCandidate,
    });
  }

  _handleSubmit(){

    let errors = validateCandidate(this.state.candidate);

    this.setState({
      errors,
    });

    if (errors.validationErrors === 0) {

      let candidate = this.state.candidate;

      // temp for now (will be replaced by location component)
      candidate._address = {
        addressLine: candidate.addressLine,
        postalCode: candidate.postalCode,
        city: candidate.city,
        countryCode: 'US',
        countrySubDivisionCode: 'CA',
      };

      delete candidate.addressLine;
      delete candidate.postalCode;
      delete candidate.city;
      // end temp

      //console.log(candidate, this.props.jobId);

      this.props.createCandidate(candidate, this.props.jobId);
      this.closeModal();
    }
  }

  render(){
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return (
      <Dialog open={this.state.open} autoDetectWindowHeight={false} autoScrollBodyContent={false} repositionOnUpdate={false} defaultOpen={false} style={{
        height: '100%', maxHeight: '100%', paddingTop: '0px'
      }} bodyStyle={{
        paddingTop: '0px', height: '100%', padding: '0'
      }} contentStyle={{
        width: '100%', maxWidth: 'none', height: '100%', maxHeight: '100%', paddingTop: '0px', top: '-64px'
      }} ref="addNewDialog">
        <div style={{height: (clientHeight) + 'px'}}>
          <Toolbar style={{backgroundColor:'#ffffff', height:'64px'}}>
            <ToolbarGroup key={0} float="left">
              <IconButton onTouchTap={this.closeModal.bind(this)} style={{marginTop:'8px',float:'left', marginRight:'8px', marginLeft:'-16px'}} iconClassName='material-icons'>close</IconButton>
              <ToolbarTitle style={{lineHeight:'64px', float:'left'}} text="Add Candidate" />
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right">
              <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={{marginTop:'14px', marginRight:'-16px', marginLeft:'auto'}}>Save</FlatButton>
            </ToolbarGroup>
          </Toolbar>
          <div className="row center-xs">
              <div className="col-xs-10 col-md-6">
                  <div className="box">
                    <form onSubmit={this._handleSubmit.bind(this)}>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['firstName'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'firstName')}
                            floatingLabelText="First Name" />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['lastName'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'lastName')}
                            floatingLabelText="Last Name" />
                      </div>
                      <div>
                        <TextField
                            type="email"
                            style={style.textField}
                            errorText={this.state.errors['email'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'email')}
                            floatingLabelText="Email" />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['phone'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'phone')}
                            floatingLabelText="Phone (optional)" />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['addressLine'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'addressLine')}
                            floatingLabelText="Address (optional)" />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['postalCode'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'postalCode')}
                            floatingLabelText="Postal Code (optional)" />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['city'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'city')}
                            floatingLabelText="City (optional)" />
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

CandidateCreateModal.propTypes = {
  jobId: React.PropTypes.string,
};
