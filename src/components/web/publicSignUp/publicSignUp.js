import React from 'react';
import IN from 'linkedin';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import { RaisedButton, Dialog, TextField, FontIcon } from 'material-ui';
import { DialogNew } from '../../../components/web';
import Config from '../../../utils/config';
import validateContact from '../../../validators/contact';
import superagent from 'superagent';

@connect((state) =>
{
  return {
    linkedinToken: state.router.location.query.linkedinToken,
    location: state.router.location,
  };
}, {pushState, replaceState})
class PublicSignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        url: document.location.href,
      },
    };
    let self = this;
    if(props.linkedinToken){
      self.props.triggerModal();
      let promise = new Promise((resolve,reject)=>{
        let request = superagent.get(Config.get('apiBaseUrl') + '/auth/linkedinProfile?linkedinToken='+props.linkedinToken);
        request.end((err, {
          body,
        } = {}) => {
          if (err) {
            return reject(body || err);
          } else {
            return resolve(body);
          }
        });
      });
      promise.then((data) =>{
        let dataForm ={...self.state.data};
        dataForm.linkedIn =data;
        dataForm.firstName = data.firstName;
        dataForm.email = data.emailAddress;
        dataForm.lastName = data.lastName;
        dataForm.displayName = `${dataForm.firstName} ${dataForm.lastName}`;
        self.setState({data:dataForm});
        if(!self.state.saving){
          var queryArr = [];
          for (var querykey in this.props.location.query) {
            if(querykey != 'linkedinToken'){
              queryArr.push(querykey+ '=' +this.props.location.query[querykey]);
            }
          };
          self.props.replaceState(null,this.props.location.pathname +'?'+queryArr.join('&'));
          self.setState({saving:true});
          self.submitData();


        }
      })

    }
  }

  handleLinkedIn() {
    let self = this;
    document.location = Config.get('apiBaseUrl') + '/auth/linkedinToken?redirect='+ encodeURIComponent(document.location.href);

    // IN.User.authorize(function(){
    //   let url = '/people/~:(id,first-name,headline,last-name,email-address,public-profile-url,picture-url,positions,picture-urls::(original))?format=json';
    //   IN.API.Raw(url).method('GET').result(function(data){
  //       let dataForm ={...self.state.data};
  //       dataForm.linkedIn =data;
  //       dataForm.firstName = data.firstName;
  //       dataForm.email = data.emailAddress;
  //       dataForm.lastName = data.lastName;
  //       dataForm.displayName = `${dataForm.firstName} ${dataForm.lastName}`;
  //       self.setState({data:dataForm});
  //       if(!self.state.saving){
  //         self.setState({saving:true});
  //         self.submitData();
  //         var queryArr = [];
  //         for (var querykey in this.props.location.query) {
  //           queryArr.push(querykey+ '=' +this.props.location.query[querykey]);
  //         };
  //         replaceState(null,this.props.location.pathname +'?'+queryArr.join('&'));
  //       }
  //     });
   }

  handleChange(e, name) {
    let data ={...this.state.data};
    data[name] = e.target.value;
    data['displayName'] = `${data.firstName} ${data.lastName}`;
    this.setState({data});
  }

  submitData() {
    let data = {...this.state.data};
    let errors = validateContact(data);

    if (errors.validationErrors === 0) {
      this.props.submit(data);
      this.setState({
        saving: false,
        saved: true,
      });
    } else {
      data.errors = errors;

      this.setState({
        data,
        saving: false,
        saved: false,
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if(!this.state.saving){
      this.setState({saving:true});
      this.submitData();
    }
  }

  renderSuccess() {
    return (
      <div className="">
          <p>Thanks for calling on us to help you find work you love!  We will be in touch shortly. In the meantime follow us on <a target="_blank" href="https://twitter.com/herojobs">twitter</a> or <a target="_blank" href="https://www.facebook.com/HeroJobs-779716228788825">facebook</a> for tips on finding work you love!</p>
      </div>
    );
  }

  renderForm() {
    let data = this.state.data;
    return (
      <div className="">
          <div style={{marginBottom: '24px'}}>It’s Time to Love Your Work</div>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <RaisedButton
                label="Apply with LinkedIn"
                fullWidth
                onTouchTap={this.handleLinkedIn.bind(this)}
                backgroundColor="#1582bb"
                labelColor="#fff"
                icon={<FontIcon className="fa fa-linkedin-square" />}
            />
          <div style={{marginTop: '16px', textAlign: 'center', color: '#212121', fontSize: '18px'}}>or</div>
            <TextField
                fullWidth
                errorText={(data.errors && data.errors.firstName) || ''}
                onChange={(e) => this.handleChange.bind(this)(e, 'firstName')}
                floatingLabelText="First Name"
                value={data.firstName}
            />
            <TextField
                fullWidth
                errorText={(data.errors && data.errors.lastName) || ''}
                onChange={(e) => this.handleChange.bind(this)(e, 'lastName')}
                floatingLabelText="Last Name"
                value={data.lastName}
            />
            <TextField
                fullWidth
                errorText={(data.errors && data.errors.email) || ''}
                onChange={(e) => this.handleChange.bind(this)(e, 'email')}
                floatingLabelText="Email"
                type="email"
                value={data.email}
            />
            <TextField
                fullWidth
                errorText={''}
                onChange={(e) => this.handleChange.bind(this)(e, 'phone')}
                floatingLabelText="Phone"
                value={data.phone}
            />
            <div style={{marginTop: '24px'}}>
            <RaisedButton
                label="Apply"
                primary
                fullWidth
                onTouchTap={this.handleSubmit.bind(this)}
            />
            </div>
          </form>
      </div>
    );
  }

  render(){
    var dialogStyles = {
      zIndex:'3000',
      paddingTop:'50px'
    };
    return (
      <div>
        <DialogNew
            style={dialogStyles}
            title={this.state.saved ? 'Thank you!' : 'Apply'}
            modal={false}
            open={this.props.open}
            onRequestClose={this.props.close.bind(this)}
        >
        {this.state.saved? this.renderSuccess() : this.renderForm()}
        </DialogNew>
      </div>
    );
  }
}

export default PublicSignUp;
