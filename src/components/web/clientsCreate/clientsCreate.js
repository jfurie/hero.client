import React from 'react';
import Immutable from 'immutable';
import {
  Dialog, IconButton, ToolbarGroup, Toolbar,
  FlatButton, TextField, ToolbarTitle, SelectField,
  MenuItem,RaisedButton,Divider
} from 'material-ui';
import {

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
                  //primary
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
                        errorText={company.get('errors') && company.get('errors').website || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'website')}
                        value={company.get('website')}
                        floatingLabelText="Company Website" />
                  </div>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={(company.get('errors') && company.get('errors').phone) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'phone')}
                        value={company.get('phone')}
                        floatingLabelText="Phone Number" />
                  </div>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={(company.get('errors') && company.get('errors').email) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'email')}
                        value={company.get('email')}
                        floatingLabelText="Email" />
                  </div>
                  //social
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['angelList'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'angelList')}
                        value={company.get('angelList')}
                        floatingLabelText="AngelList Url (optional)" />
                  </div>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['crunchbase'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'crunchbase')}
                        value={company.get('crunchbase')}
                        floatingLabelText="Crunchbase Url (optional)" />
                  </div>
                  //jobs
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['jobboard'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'jobboard')}
                        value={company.get('jobboard')}
                        floatingLabelText="JobBoard Url (optional)" />
                  </div>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['ziprecruiter'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'ziprecruiter')}
                        value={company.get('ziprecruiter')}
                        floatingLabelText="ZipRecruiter Url (optional)" />
                  </div>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['indeed'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'indeed')}
                        value={company.get('indeed')}
                        floatingLabelText="Indeed Url (optional)" />
                  </div>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors').facebookHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'facebookHandle')}
                        value={company.get('facebookHandle')}
                        floatingLabelText="Facebook Handle (optional)" />
                  </div>
                  <div>
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors').twitterHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'twitterHandle')}
                        value={company.get('twitterHandle')}
                        floatingLabelText="Twitter Handle (optional)" />
                  </div>
                  //about us
                  <Divider />
                  <div>
                    <TextField
                        multiLine={true}
                        rows={3}
                        fullWidth={true}
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['productSolution'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'productSolution')}
                        value={company.get('productSolution')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="What problem are you addressing and how are you addressing it?" />
                  </div>
                  <div>
                    <TextField
                        multiLine={true}
                        rows={3}
                        fullWidth={true}
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['culture'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'culture')}
                        value={company.get('culture')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="Company Culture (optional)" />
                  </div>
                  <div>
                    <TextField
                        multiLine={true}
                        rows={3}
                        fullWidth={true}
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['techstack'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'techstack')}
                        value={company.get('techstack')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="Tech Stack (optional)" />
                  </div>
                  <div>
                    <TextField
                        multiLine={true}
                        rows={3}
                        fullWidth={true}
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['leadership'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'leadership')}
                        value={company.get('leadership')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="What is the leadership team? (optional)" />
                  </div>
                  <div style={{marginTop:'20px', marginBottom:'20px'}}>
                    <RaisedButton primary={true} label='Save' onTouchTap={this._handleSubmit.bind(this)}></RaisedButton>
                  </div>

                </form>
              </div>
          </div>
      </div>
    );
  }
  render(){
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let contentHeight = clientHeight - 64;
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
            <div style={{minHeight: `${clientHeight}px`, overflowY:'scroll'}}>
              <Toolbar style={style.toolbar}>
                <ToolbarGroup key={0} float="left">
                  <IconButton onTouchTap={this.closeModal.bind(this)} style={style.toolbarIcon} iconClassName='material-icons'>close</IconButton>
                  <ToolbarTitle style={style.toolbarTitle} text="Create Client" />
                </ToolbarGroup>
                <ToolbarGroup key={1} float="right">
                  <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={style.toolbarFlat}>Save</FlatButton>
                </ToolbarGroup>
              </Toolbar>
              <div style={{height: `${contentHeight}px`, overflowY:'scroll', WebkitOverflowScrolling:'touch'}}>
                {this.renderContents()}
              </div>
            </div>
          </Dialog>
      </div>);
    }

  }
}