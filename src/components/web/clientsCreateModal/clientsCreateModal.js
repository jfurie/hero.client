import React from 'react';
import {Dialog, IconButton, ToolbarGroup, Toolbar, FlatButton, TextField, ToolbarTitle} from 'material-ui';

import validateCompany from '../../../validators/company';

const style = {
  error: {
    float: 'left',
  },
  textField: {
    'width': '100%',
  },
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
  toolbar: {
    backgroundColor: '#ffffff',
    height: '64px',
  },
  toolbarIcon: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  toolbarFlat: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  toolbarTitle: {
    lineHeight:'64px',
    float:'left',
  },
};

export default class ClientsCreateModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      company: {},
      errors: {},
    };
  }

  closeModal(){
    this.props.closeModal();
  }

  _handleChange(e, field) {
    let newCompany = this.state.company;
    let value = (e.target.value === '') ? (null) : (e.target.value);

    if (value) {
      newCompany[field] = value;
    } else {
      delete newCompany[field];
    }

    this.setState({
      company: newCompany,
    });
  }

  _handleSubmit(){

    let errors = validateCompany(this.state.company);

    this.setState({
      errors,
    });

    if (errors.validationErrors === 0) {
      this.props.onSubmit(this.state.company);
    }
  }

  render(){
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return (
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
        <div style={{height: `${clientHeight}px`}}>

          <Toolbar style={style.toolbar}>
            <ToolbarGroup key={0} float="left">
              <IconButton onTouchTap={this.closeModal.bind(this)} style={style.toolbarIcon} iconClassName='material-icons'>close</IconButton>
              <ToolbarTitle style={style.toolbarTitle} text="Create Client" />
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right">
              <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={style.toolbarFlat}>Save</FlatButton>
            </ToolbarGroup>
          </Toolbar>
          <div className="row center-xs">
              <div className="col-xs-10 col-md-6">
                  <div className="box">
                    <form onSubmit={this._handleSubmit.bind(this)}>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['name'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'name')}
                            floatingLabelText="Company Name" />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['website'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'website')}
                            floatingLabelText="Company Website" />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['facebookHandle'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'facebookHandle')}
                            floatingLabelText="Facebook Handle (optional)" />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['twitterHandle'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'twitterHandle')}
                            floatingLabelText="Twitter Handle (optional)" />
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

ClientsCreateModal.propTypes = {
};
