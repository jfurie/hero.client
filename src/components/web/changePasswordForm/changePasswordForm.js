import React from 'react';

class ChangePasswordForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null
    };
  }

  onSubmit (e) {
    e.preventDefault();
    this.setState({error: null});

    let password = this.state.password;
    let password2 = this.state.password2;
    if (password.length < 6) {this.setState({error: 'Password not valid!'});} else if (password != password2) {this.setState({error: 'Password do not match!'});} else {
      this.props.onPassword(password);
    }
  }

  handleChange (item, e) {
    let newState = {};
    newState[item] = e.target.value;
    this.setState(newState);
  }

  render () {

    let {
      submitText
    } = this.props;

    submitText = submitText || 'submit';

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        {(this.state && this.state.error)
          ? (
            <p>Error:
              {this.state.error}</p>
          )
          : (null)}
        <div>
          <label htmlFor='email'>password:
          </label>

          <input name="password2" onChange={this.handleChange.bind(this, 'password')} placeholder="at least 6 characters" type="password"></input>
        </div>
        <div>
          <label htmlFor='email'>confirm:
          </label>

          <input name="password2" onChange={this.handleChange.bind(this, 'password2')} placeholder="at least 6 characters" type="password"></input>
        </div>
        <div>
          <input type="submit" value={submitText}></input>
        </div>
      </form>
    );
  }
}

ChangePasswordForm.propTypes = {
  onPassword: React.PropTypes.func.isRequired,
  submitText: React.PropTypes.string
};

export default ChangePasswordForm;
