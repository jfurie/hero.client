import React from 'react';

class EmailForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }
  
  onSubmit (e) {
    e.preventDefault();
    this.setState({error: null});

    let email = this.state.email;
    if (email.match(/.+\@.+\..+/)) { // basic check
      this.props.onEmail(email);
    } else {
      this.setState({error: 'Email not valid!'});
    }
  }

  handleChange (item, e) {
    let newState = {};
    newState[item] = e.target.value;
    this.setState(newState);
  }

  render() {

    let {submitText} = this.props;

    submitText = submitText || 'submit';

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div style={{display: 'inline', marginRight: '7px'}}>

        {(this.state && this.state.error) ? (
          <p>Error: {this.state.error}</p>
        ) : (null)}

          <label htmlFor='email'>email: </label>

          <input
              name="email"
              onChange={this.handleChange.bind(this, 'email')}
              placeholder="user@email.com"
              type="text">
          </input>
        </div>
        <div style={{display: 'inline'}}>
          <input type="submit" value={submitText}></input>
        </div>
      </form>
    );
  }
}

EmailForm.propTypes = {
  onEmail: React.PropTypes.func.isRequired,
  submitText: React.PropTypes.string,
};

export default EmailForm;
