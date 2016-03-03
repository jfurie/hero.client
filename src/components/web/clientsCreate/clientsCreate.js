import React from 'react';
import Immutable from 'immutable';

import {
  Dialog, IconButton, ToolbarGroup, Toolbar,
  FlatButton, TextField, ToolbarTitle, SelectField,
  MenuItem, RaisedButton, Divider, Styles, LinearProgress, Card, CardMedia, CardText,
} from 'material-ui';

import { Location, TagsInput, FileInput } from '../';

import validateCompany from '../../../validators/company';
import Snackbar from 'material-ui/lib/snackbar';

const style = {
  error: {
    float: 'left',
  },
  divider:{
    marginTop:'16px',
  },
  subheader:{
    color: Styles.Colors.grey600,
    fontSize:'14px',
    marginTop:'16px',
    marginBottom:'16px',
    marginLeft:'16px',
    textAlign:'left',
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
  toolbarInline:{
    backgroundColor: '#ffffff',
    height: '64px',
    position:'fixed',
    zIndex:'1000',
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
    this.state = {windowHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight};
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillReceiveProps(newProps) {
    if (this.props.heroContacts && !this.props.heroContacts.size && newProps.heroContacts.size > 0) {
      let newCompany = this.props.newCompany.set('clientAdvocateId', newProps.heroContacts.first().get('id'));
      this.props.onCompanyChange(newCompany);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    this.setState({windowHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight});
  }

  _handleTagsChange(tags){
    let newCompany = this.props.company;

    if (tags) {
      newCompany = newCompany.set('tags',tags);
    } else {
      newCompany = newCompany.delete('tags');
    }

    this.props.onCompanyChange(newCompany);
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

  _handleLocationChange(field, value) {
    let newCompany = this.props.company;

    if (value) {
      newCompany = newCompany.set(field,value);
    } else {
      newCompany = newCompany.delete(field);
    }

    this.props.onCompanyChange(newCompany);
  }

  _handleSubmit(){

    if (this.props.company.get('saving') == true) {
      return;
    }

    let errors = validateCompany(this.props.company.toJSON());

    let newCompany = this.props.company.set('errors',errors);
    if (errors.validationErrors === 0) {
      // remove extra fields
      let finalCompany = newCompany.merge({'jobs': {}, 'notes': {}, 'errors': {}, 'contacts': {}});
      this.props.onSubmit(finalCompany);
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

  onImageChange(value){
    this.props.onImageChange(value);
  }

  renderContents(){
    let { heroContacts, company } = this.props;


    if (!heroContacts) {
      heroContacts = new Immutable.Map();
    }

    company = company || new Immutable.Map({errors:new Immutable.Map()});

    let tags = company.get('tags');
    if (tags) {
      if (tags.toArray) {
        tags = tags.toArray();
      }
    } else {
      tags = [];
    }

    return (
      <div style={{backgroundColor:'#ffffff'}} className="row center-xs">
          <div className="col-xs-12 col-md-8">
              <div className="box">
                <form onSubmit={this._handleSubmit.bind(this)}>
                  <div className="row center-xs" >

                  <div className="col-xs-10 ">
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
                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Primary</div>
                  </div>

                  <div className="col-xs-10 ">
                      <Card>
                        <CardMedia>
                          {(() => {
                            if(this.props.companyImage){
                              return (<div><img style={{maxWidth:'100%', maxHeight:'300px'}} src={this.props.companyImage.get('item')}></img></div>);
                            } else {
                              return (<div></div>);
                            }
                          })()}
                        </CardMedia>
                        <CardText>
                          <LinearProgress mode="determinate" value={company.get('percentUploaded')} />
                          <FileInput label={this.props.companyImage?'Change Photo':'Add Photo'} onFileChanged={this.onImageChange.bind(this)} />
                        </CardText>
                      </Card>
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(company.get('errors') && company.get('errors').name) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'name')}
                        value={company.get('name')}
                        floatingLabelText="Company Name"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors').website || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'website')}
                        value={company.get('website')}
                        floatingLabelText="Company Website"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(company.get('errors') && company.get('errors').phone) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'phone')}
                        value={company.get('phone')}
                        floatingLabelText="Phone Number"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(company.get('errors') && company.get('errors').email) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'email')}
                        value={company.get('email')}
                        floatingLabelText="Email"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TagsInput value={tags} onChange={this._handleTagsChange.bind(this)} title="Tags" />
                  </div>
                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Location</div>
                  </div>
                  <div className="col-xs-10" >
                    <Location location={company.get('location')} onChange={this._handleLocationChange.bind(this,'location')} />
                  </div>
                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Social</div>
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['angelList'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'angelList')}
                        value={company.get('angelList')}
                        floatingLabelText="AngelList Url (optional)"
                    />
                  </div>
                  <div className="col-xs-10">
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['crunchbase'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'crunchbase')}
                        value={company.get('crunchbase')}
                        floatingLabelText="Crunchbase Url (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors').facebookHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'facebookHandle')}
                        value={company.get('facebookHandle')}
                        floatingLabelText="Facebook Handle (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors').twitterHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'twitterHandle')}
                        value={company.get('twitterHandle')}
                        floatingLabelText="Twitter Handle (optional)"
                    />
                  </div>
                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Jobs</div>
                  </div>
                  <div className="col-xs-10">
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['jobboard'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'jobboard')}
                        value={company.get('jobboard')}
                        floatingLabelText="JobBoard Url (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['ziprecruiter'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'ziprecruiter')}
                        value={company.get('ziprecruiter')}
                        floatingLabelText="ZipRecruiter Url (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['indeed'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'indeed')}
                        value={company.get('indeed')}
                        floatingLabelText="Indeed Url (optional)"
                    />
                  </div>

                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>About</div>
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        fullWidth
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['businessType'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'businessType')}
                        value={company.get('businessType')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="Business Type (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        multiLine
                        rows={3}
                        fullWidth
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['productSolution'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'productSolution')}
                        value={company.get('productSolution')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="What problem are you addressing and how are you addressing it?"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        multiLine
                        rows={3}
                        fullWidth
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['benefits'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'benefits')}
                        value={company.get('benefits')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="Benefits (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        multiLine
                        rows={3}
                        fullWidth
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['culture'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'culture')}
                        value={company.get('culture')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="Company Culture (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        multiLine
                        rows={3}
                        fullWidth
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['techstack'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'techstack')}
                        value={company.get('techstack')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="Tech Stack (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        multiLine
                        rows={3}
                        fullWidth
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['leadership'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'leadership')}
                        value={company.get('leadership')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="What is the leadership team? (optional)"
                    />
                  </div>
                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Recruiter Data</div>
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        pattern="\d*"
                        type="number"
                        fullWidth
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['feeAgreement'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'feeAgreement')}
                        value={company.get('feeAgreement')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="Fee Agreement %"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        fullWidth
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['payableTerms'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'payableTerms')}
                        value={company.get('payableTerms')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="Payable Terms"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        fullWidth
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['guarantee'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'guarantee')}
                        value={company.get('guarantee')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="Guarentee Length"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        multiLine
                        rows={3}
                        fullWidth
                        style={style.textField}
                        errorText={company.get('errors') && company.get('errors')['generalNotes'] || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'generalNotes')}
                        value={company.get('generalNotes')}
                        floatingLabelStyle={{left:'0px'}}
                        floatingLabelText="General Notes"
                    />
                  </div>

                  <div className="col-xs-10 " style={{marginTop:'20px', marginBottom:'20px'}}>
                    <RaisedButton primary label="Save" onTouchTap={this._handleSubmit.bind(this)} />
                  </div>
                  </div>
                </form>
                <Snackbar
                    open={(this.props.company && this.props.company.get('savingError'))?true:false}
                    message={this.props.company && this.props.company.get('savingError')}
                    autoHideDuration={4000}
                />
              </div>
          </div>
      </div>
    );
  }
  render(){
    let clientHeight = this.state.windowHeight;
    let contentHeight = clientHeight - 64;
    if(this.props.inline){
      return (
      <div>
        <Toolbar style={style.toolbarInline}>
          <ToolbarGroup key={0} float="left">
            <IconButton onTouchTap={this.closeModal.bind(this)} style={style.toolbarIcon} iconClassName="material-icons">close</IconButton>
            <ToolbarTitle style={style.toolbarTitle} text="Create Client" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={style.toolbarFlat}>Save</FlatButton>
          </ToolbarGroup>
        </Toolbar>
        <div style={{height:'64px'}}></div>
        <div>
          {this.renderContents()}
        </div>
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
                  <IconButton onTouchTap={this.closeModal.bind(this)} style={style.toolbarIcon} iconClassName="material-icons">close</IconButton>
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
