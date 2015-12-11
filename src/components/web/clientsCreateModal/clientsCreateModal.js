import React from 'react';
import {Dialog, IconButton, ToolbarGroup, Toolbar, FlatButton, TextField, ToolbarTitle} from 'material-ui';
//const ToolBar = require('material-ui/lib/toolbar/toolbar');
const websiteRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
//Blahs
export default class ClientsCreateModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      ... props.company,
      nameError: '',
      websiteError: '',
    };
  }

  closeModal(){
    this.props.closeModal();
  }

  _handleWebsiteChange(e){
    var website = new RegExp(websiteRegex);

    if (e.target.value.match(website)) {
      this.setState({
        website: e.target.value,
        websiteError: '',
      });
    } else {
      this.setState({
        websiteError: 'This is not a valid url',
      });
    }

  }

  _handleNameChange(e){
    if (e.target.value != '' && e.target.value !=null) {
      this.setState({
        name: e.target.value,
        nameError: '',
      });
    } else {
      this.setState({
        name: e.target.value,
        nameError: 'Name is required',
      });
    }
  }

  _handleSubmit(){
    if (this.state.nameError == '' && this.state.websiteError == '') {
      this.props.onSubmit(this.state);
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

        <Toolbar style={{backgroundColor:'#ffffff', height:'64px'}}>
          <ToolbarGroup key={0} float="left">
            <IconButton onTouchTap={this.closeModal.bind(this)} style={{marginTop:'8px',float:'left', marginRight:'8px', marginLeft:'-16px'}} iconClassName='material-icons'>close</IconButton>
            <ToolbarTitle style={{lineHeight:'64px', float:'left'}} text="Create Client" />
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
                        fullWidth
                        errorText={this.state.nameError}
                        onChange={this._handleNameChange.bind(this)}
                        floatingLabelText="Company Name" />
                    </div>
                    <div>
                      <TextField
                        fullWidth
                        errorText={this.state.websiteError}
                        onChange={this._handleWebsiteChange.bind(this)}
                        floatingLabelText="Company Website" />
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
