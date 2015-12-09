import React from 'react';
import {Dialog, IconButton, ToolbarGroup, FlatButton, TextField, ToolbarTitle} from 'material-ui';
const ToolBar = require('material-ui/lib/toolbar/toolbar');
export default class ClientContactsCreateModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ... props.company,
      lastNameError:'',
      emailError:''
    };
  }

  closeModal(){
    this.props.closeModal();
  }
  _handleFirstNameChange(e){
    if(e.target.value != '' && e.target.value !=null){
      this.setState({
        contact:{
          ... this.state.contact,
          firstName:e.target.value,
        },
        firstNameError:''
      });
    } else {
      this.setState({
        contact:{
          ... this.state.contact,
          firstName:e.target.value,
        },
        firstNameError:'First Name is required'
      });
    }

  }
  _handleLastNameChange(e){
    if(e.target.value != '' && e.target.value !=null){
      this.setState({
        contact:{
          ... this.state.contact,
          lastName:e.target.value,
        },
        lastNameError:''
      });
    } else {
      this.setState({
        contact:{
          ... this.state.contact,
          lastName:e.target.value,
        },
        lastNameError:'Last Name is required'
      });
    }

  }
  _handleSubmit(){
    if(this.state.lastNameError == '' &&
    this.state.emailError == '' &&
    this.state.firstNameError == ''){
      this.props.onSubmit(this.state);
    }
  }
  _handleEmailChange(e){
    if(e.target.value != '' && e.target.value !=null){
      this.setState({
        contact:{
          ... this.state.contact,
          email:e.target.value,
        },
        emailError:''
      });
    } else {
      this.setState({
        contact:{
          ... this.state.contact,
          email:e.target.value,
        },
        emailError:'Email is required'
      });
    }
  }
  render(){
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return (
      <Dialog open={this.props.open} autoDetectWindowHeight={false} autoScrollBodyContent={false} repositionOnUpdate={false} defaultOpen={false} style={{
        height: '100%', maxHeight: '100%', paddingTop: '0px'
      }} bodyStyle={{
        paddingTop: '0px', height: '100%', padding: '0'
      }} contentStyle={{
        width: '100%', maxWidth: 'none', height: '100%', maxHeight: '100%', paddingTop: '0px', top: '-64px'
      }} ref="addNewDialog">
        <div style={{
          height: ( clientHeight) + 'px'
        }}>

        <ToolBar style={{backgroundColor:'#ffffff', height:'64px'}}>
          <ToolbarGroup key={0} float="left">
            <IconButton onTouchTap={this.closeModal.bind(this)} style={{marginTop:'8px',float:'left', marginRight:'8px', marginLeft:'-16px'}} iconClassName='material-icons'>close</IconButton>
            <ToolbarTitle style={{lineHeight:'64px', float:'left'}} text="Create Contact" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={{marginTop:'14px', marginRight:'-16px', marginLeft:'auto'}}>Save</FlatButton>
          </ToolbarGroup>
        </ToolBar>
        <div className="row center-xs">
            <div className="col-xs-10 col-md-6">
                <div className="box">
                  <form onSubmit={this._handleSubmit.bind(this)}>
                    <div>
                      <TextField
                        style={{'width':'100%'}}
                        errorText={this.state.firstNameError}
                        onChange={this._handleFirstNameChange.bind(this)}
                        floatingLabelText="First Name" />
                    </div>
                    <div>
                      <TextField
                        style={{'width':'100%'}}
                        errorText={this.state.lastNameError}
                        onChange={this._handleLastNameChange.bind(this)}
                        floatingLabelText="Last Name" />
                    </div>
                    <div>
                      <TextField
                        type='email'
                        style={{'width':'100%'}}
                        errorText={this.state.emailError}
                        onChange={this._handleEmailChange.bind(this)}
                        floatingLabelText="Email" />
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
