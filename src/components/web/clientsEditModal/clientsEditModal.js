import React from 'react';
import Immutable from 'immutable';
import { Dialog, IconButton, ToolbarGroup, Toolbar, FlatButton, TextField, ToolbarTitle,SelectField,MenuItem } from 'material-ui';
import { editCompany } from '../../../modules/companies/index';
import { connect } from 'react-redux';
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

@connect(() => (
{}), { editCompany }, null, {withRef: true})
export default class ClientsEditModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      clientAdvocateId:0,
      company: {
        id: props.company.get('id'),
        name: props.company.get('name'),
        website: props.company.get('website'),
        facebookHandle: props.company.get('facebookHandle'),
        twitterHandle: props.company.get('twitterHandle'),
      },
      errors: {},
      open: false,
    };
  }
  componentWillReceiveProps(newProps) {
    if (this.props.heroContacts && !this.props.heroContacts.size && newProps.heroContacts.size > 0) {
      this.setState({
        clientAdvocateId: newProps.heroContacts.first().get('id'),
      });
    }
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

  _handleSelectValueChange(event, index, value) {
    this.setState({
      clientAdvocateId: value,
    });
  }
  _handleSubmit(){

    let errors = validateCompany(this.state.company);

    this.setState({
      errors,
    });

    if (errors.validationErrors === 0) {
      let company = this.state.company;
      company.clientAdvocateId = this.state.clientAdvocateId;
      this.props.editCompany(company);
      this.closeModal();
    }
  }

  render(){

    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let { company, heroContacts } = this.props;
    if(!heroContacts){
      heroContacts = new Immutable.Map();
    }
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
      >
        <div style={{height: `${clientHeight}px`}}>
          <Toolbar style={style.toolbar}>
            <ToolbarGroup key={0} float="left">
              <IconButton onTouchTap={this.closeModal.bind(this)} style={style.toolbarIcon} iconClassName='material-icons'>close</IconButton>
              <ToolbarTitle style={style.toolbarTitle} text="Edit Client" />
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
                            floatingLabelText="Company Name"
                            defaultValue={this.state.company.name} />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['website'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'website')}
                            floatingLabelText="Company Website"
                            defaultValue={this.state.company.website} />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['facebookHandle'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'facebookHandle')}
                            floatingLabelText="Facebook Handle (optional)"
                            defaultValue={this.state.company.facebookHandle} />
                      </div>
                      <div>
                        <TextField
                            style={style.textField}
                            errorText={this.state.errors['twitterHandle'] || ''}
                            errorStyle={style.error}
                            onChange={(e) => this._handleChange.bind(this)(e, 'twitterHandle')}
                            floatingLabelText="Twitter Handle (optional)"
                            defaultValue={this.state.company.twitterHandle} />
                      </div>
                      <div>
                        <SelectField
                            floatingLabelText="Client Advocate"
                            floatingLabelStyle={style.floatLabel}
                            fullWidth
                            style={style.select}
                            onChange={this._handleSelectValueChange.bind(this)}
                            hintText={''}
                            value={this.state.clientAdvocateId}
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
                    </form>
                  </div>
              </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

ClientsEditModal.propTypes = {
  company: React.PropTypes.object.isRequired,
};
