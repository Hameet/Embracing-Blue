import React from 'react'
import { connect } from 'react-redux'
import { registerUserRequest } from '../../actions/register'
import { loginError } from '../../actions/login'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_name: '',
      contact_number: '',
      email_address: '',
      password: '',
      confirm_password: '',
      password_strength: 0
    }
    this.updateDetails = this.updateDetails.bind(this)
    this.submit = this.submit.bind(this)
    this.validateEmail = this.validateEmail.bind(this)
    //this.validatePassword = this.validatePassword.bind(this)
    this.checkPassword = this.checkPassword.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
  }
  componentDidMount() {
    this.props.dispatch(loginError(''))
  }
  updateDetails(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  //if the email addresss is not valid we need to STOP IT.
  submit(e) {
    e.preventDefault()
    e.target.reset()
    let { user_name, password, confirm_password, email_address, contact_number } = this.state
    function confirmation() {
      if (confirm_password != password)
        return false
      else
        return true
    }

    const isEmail = this.validateEmail(email_address)
    const passwordsNotSame = (confirm_password != password)

    const isPass = this.checkPassword(password) >= 3 //This is strength of the password not the length


    if (!isEmail || passwordsNotSame) return this.props.dispatch(loginError("Incorrect email/Passwords don't match"))
    //if (confirm_password != password) return this.props.dispatch(loginError("Passwords don't match"))
    else if (!isPass) return this.props.dispatch(loginError("Password length must be above 10 and must include atleast one number, one uppercase letter and one out of these two sets of symbols '~<>@$%' ,'!@£$%^&()'"))
    else return this.props.dispatch(registerUserRequest(this.state))
  }

  //this just checks if the email is valid or not.
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var isValid = re.test(String(email).toLowerCase());
    return isValid
  }

  checkPassword(password) {
    let strength = 0;
    // var strength = this.state.password_strength;

    if (password.match(/[a-zA-Z0-9][a-zA-Z0-9]+/)) { //has lower or capital alphanumerals
      strength += 1
    }
    if (password.match(/[~<>]+/)) { //has special characters
      strength += 1
    }
    if (password.match(/[!@£$%^&()]+/)) { //has these special characters
      strength += 1
    }
    if (password.length > 0) { //is longer than 0 chars
      strength += 1
    }
    if (password.length > 10) {
      strength += 1
    }
    return strength
  }

  handlePasswordChange(e) {
    const password = e.target.value;
    var strength = this.checkPassword(password)
    this.setState({ password_strength: strength });
  }

  renderProgressBar() {
    const { password_strength } = this.state
    let progressClass = 'danger'
    switch (password_strength) {
      case 3: progressClass = 'warning'; break;
      case 4: progressClass = 'success'; break;
      case 5: progressClass = 'primary'; break;
      default: progressClass = 'danger'

    }
    return <progress className={`progress is-${progressClass}`} max="100" value={(this.state.password_strength * 20)} id="strength"></progress>

  }

  render() {
    const { auth } = this.props
    return (
      <form className="section column is-6 is-offset-3 is-0" onSubmit={this.submit}>
        <h1 className="title is-2 has-text-centered">Register</h1>
        <hr />
        <b>{auth.errorMessage && <span>{auth.errorMessage}</span>}</b>

        <label className="label">Username
          <input className="input is-medium" required placeholder="User Name" type="text" name="user_name" onChange={this.updateDetails} />
        </label>

        <label className="label">Contact Number
          <input className="input is-medium" required placeholder="Contact Number" type="text" name="contact_number" onChange={this.updateDetails} />

        </label>

        <label className="label">Email Address
          <input className="input is-medium" required placeholder="Email Address" type="text" name="email_address" onChange={this.updateDetails} />
        </label>

        <div className="columns">
          <label className="column is-6 label">
            Password
              <input className="input is-medium" required placeholder="Password" type="password" name="password" onChange={this.updateDetails} onKeyUp={this.handlePasswordChange} />
          </label>
          <label className="column is-6 label">
            Confirm Password
                <input className={`${this.state.password != this.state.confirm_password ? 'is-danger' : ''} input is-medium`} required placeholder="Confirm Password" type="password" name="confirm_password" onChange={this.updateDetails} />
          </label>
        </div>

        {this.renderProgressBar()}
        {/* </div> */}
        <input className="button is-primary" value="Register" type="submit" />

      </form>
    )
  }
}

const mapStateToProps = ({ auth }) => ({ auth }) //auth is being passed in by props and then it executes it, auth is being destructured from state by this fn


export default connect(mapStateToProps)(Register)
