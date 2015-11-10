import React, {PropTypes} from 'react';
class HomePage extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  }
  constructor() {
    super();

  }
  onSubmit(e){
    e.preventDefault();
    if(this.props.onSubmit){
      this.props.onSubmit(this.state);
    }
  }
  handleChange(item, e){
    let newState = {};
    newState[item] = e.target.value;
    this.setState(newState);
  }
  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
          <fieldset>
            <div>
              <label htmlFor='email'>email</label>
              <input name='email' onChange={this.handleChange.bind(this,'email')} type='text' placeholder='user@email.com'></input>
            </div>
            <div>
              <label htmlFor='password'>password</label>
              <input name='password' onChange={this.handleChange.bind(this,'password')} type='password' placeholder='password1'></input>
            </div>
            <div>
              <input type='submit'></input>
            </div>
          </fieldset>
        </form>
      </div>);
  }
}

export default HomePage;
