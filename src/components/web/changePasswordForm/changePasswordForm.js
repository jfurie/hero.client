import React from 'react';
import { TextField, RaisedButton, Styles } from 'material-ui';

const style = {
  error: {
    color: Styles.Colors.red400,
    textAlign: 'left',
  },
  submitButton: {
    width: '100%',
    marginBottom: '14px',
    marginTop: '30px',
    height: '50px',
  },
};

class ChangePasswordForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      password: null,
      password2: null,
    };
  }

  onSubmit (e) {
    e.preventDefault();

    let password = this.state.password;
    let password2 = this.state.password2;
    if (!password || !password2 || password.length < 6) {
      this.props.onError('Password not valid!');
    } else if (password && password2 && password !== password2) {
      this.props.onError('Passwords do not match!');
    } else {
      this.props.onPassword(password);
    }
  }

  handleChange (item, e) {
    let newState = {};
    newState[item] = e.target.value;
    this.setState(newState);
  }

  render () {

    let { submitText } = this.props;

    submitText = submitText || 'submit';

    return (
      <form onSubmit={this.onSubmit.bind(this)}>

        <TextField
            fullWidth
            hintText="Password (at least 6 characters)"
            onChange={this.handleChange.bind(this, 'password')}
            underlineFocusStyle={{borderColor: Styles.Colors.blue800}}
            type="password"
            name="password"
        />

        <TextField
            fullWidth
            hintText="Password (confirm)"
            onChange={this.handleChange.bind(this, 'password2')}
            underlineFocusStyle={{borderColor: Styles.Colors.blue800}}
            type="password"
            name="password2"
        />

        <RaisedButton
            label="Change Password"
            style={style.submitButton}
            type="submit"
        />

      </form>
    );
  }
}

ChangePasswordForm.propTypes = {
  onError: React.PropTypes.func.isRequired,
  onPassword: React.PropTypes.func.isRequired,
  submitText: React.PropTypes.string,
};

export default ChangePasswordForm;
