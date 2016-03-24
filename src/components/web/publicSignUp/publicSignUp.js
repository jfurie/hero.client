import React from 'react';
import IN from 'linkedin';
import { RaisedButton, Dialog, TextField, FontIcon } from 'material-ui';

import validateContact from '../../../validators/contact';

class PublicSignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        url: document.location.href,
      },
    };
  }

  handleLinkedIn() {
    let self = this;
    IN.User.authorize(function(){
      let url = '/people/~:(id,first-name,headline,last-name,email-address,public-profile-url,picture-url,positions,picture-urls::(original))?format=json';
      IN.API.Raw(url).method('GET').result(function(data){
        let dataForm ={...self.state.data};
        dataForm.linkedIn =data;
        dataForm.firstName = data.firstName;
        dataForm.email = data.emailAddress;
        dataForm.lastName = data.lastName;
        dataForm.displayName = `${dataForm.firstName} ${dataForm.lastName}`;
        self.setState({data:dataForm});
        if(!self.state.saving){
          self.setState({saving:true});
          self.submitData();
        }
      });
    }, this);
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
          <div style={{marginTop: '16px', textAlign: 'center', color: '#333', fontSize: '18px'}}>or</div>
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
    return (
      <div>
        <Dialog
            title={this.state.saved ? 'Thank you!' : 'Apply'}
            modal={false}
            autoScrollBodyContent
            open={this.props.open}
            onRequestClose={this.props.close.bind(this)}
        >
        {this.state.saved? this.renderSuccess() : this.renderForm()}
        </Dialog>
      </div>
    );
  }
}

export default PublicSignUp;
