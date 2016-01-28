import React from 'react';
import Immutable from 'immutable';
import {
  Dialog, IconButton, ToolbarGroup, Toolbar,
  FlatButton, TextField, ToolbarTitle, SelectField,
  MenuItem,RaisedButton,
} from 'material-ui';
import {
  Header
} from '../';
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
};

export default class ClientsCreateModal extends React.Component {
  constructor(props){
    super(props);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.heroContacts && !this.props.heroContacts.size && newProps.heroContacts.size > 0) {
      let newCompany = this.props.newCompany.set('clientAdvocateId', newProps.heroContacts.first().get('id'));
      this.props.onCompanyChange(newCompany);
    }
  }

  closeModal(){
    this.props.closeModal();
  }

  _handleChange(e, field) {
    let newCompany = this.props.company;
    let value = (e.target.value === '') ? (null) : (e.target.value);

    if (value) {
      newCompany = newCompany.set(field,value);
    } else {
      newCompany = newCompany.delete(field);
    }

    this.props.onCompanyChange(newCompany);
  }

  _handleSubmit(){

    let errors = validateCompany(this.props.company.toJSON());

    let newCompany = this.props.company.set('errors',errors);
    if (errors.validationErrors === 0) {

      // and post ...
      this.props.onSubmit(newCompany);
    } else {
      this.props.onCompanyChange(newCompany);
    }
  }

  _handleSelectValueChange(event, index, value) {
    let newCompany = this.props.company;

    if (value) {
      newCompany = newCompany.set('clientAdvocateId',value);
    } else {
      newCompany = newCompany.delete('clientAdvocateId');
    }
    this.props.onCompanyChange(newCompany);
  }
  renderContents(){
    let {heroContacts, company } = this.props;
    if(!heroContacts){
      heroContacts = new Immutable.Map();
    }
    company = company || new Immutable.Map({errors:new Immutable.Map()});
    return (
      <div className="row center-xs">
          <div className="col-xs-10 col-md-6">
              <div className="box">
                <form onSubmit={this._handleSubmit.bind(this)}>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={(company.get('errors') && company.get('errors').name) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'name')}
                        value={company.get('name')}
                        floatingLabelText="Company Name" />
                  </div>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors').website || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'website')}
                        value={company.get('website')}
                        floatingLabelText="Company Website" />
                  </div>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors').facebookHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'facebookHandle')}
                        value={company.get('facebookHandle')}
                        floatingLabelText="Facebook Handle (optional)" />
                  </div>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors').twitterHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'twitterHandle')}
                        value={company.get('twitterHandle')}
                        floatingLabelText="Twitter Handle (optional)" />
                  </div>
                  <div>
                    <SelectField
                        floatingLabelText="Client Advocate"
                        floatingLabelStyle={style.floatLabel}
                        fullWidth
                        style={style.select}
                        onChange={this._handleSelectValueChange.bind(this)}
                        hintText={''}
                        value={company.get('clientAdvocateId')}
                    >
                      {heroContacts.map((heroContact, index) => {
                        return (
                          <MenuItem
                              value={index}
                              primaryText={heroContact.get('displayName')}
                          />
                        );
                      })}
                    </SelectField>
                  </div>
                  <RaisedButton primary={true} label='Save' onTouchTap={this._handleSubmit.bind(this)}></RaisedButton>
                </form>
              </div>
          </div>
      </div>
    );
  }
  render(){
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if(this.props.inline){
      return (
      <div>
        {this.renderContents()}
      </div>);
    } else {
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
            <div style={{minHeight: `${clientHeight}px`}}>
              <Toolbar style={style.toolbar}>
                <ToolbarGroup key={0} float="left">
                  <IconButton onTouchTap={this.closeModal.bind(this)} style={style.toolbarIcon} iconClassName='material-icons'>close</IconButton>
                  <ToolbarTitle style={style.toolbarTitle} text="Create Client" />
                </ToolbarGroup>
                <ToolbarGroup key={1} float="right">
                  <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={style.toolbarFlat}>Save</FlatButton>
                </ToolbarGroup>
              </Toolbar>
              {this.renderContents()}
            </div>
          </Dialog>
      </div>);
    }

  }
}
