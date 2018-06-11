import * as React from 'react';
import LoginComponent from '../components/LoginComponent';
import User from '../models/User';
import Auth from '../modules/Auth';
import { withRouter, RouteComponentProps } from 'react-router-dom';
type State = {
  user: User
  errors: {
    summary?: string,
    username?: string,
    password?: string
  }
  successMessage: string
};

type Props = {
  toggleAuthenticateStatus: () => void
} & RouteComponentProps<null>;

class LoginPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    this.state = {
      user: {
        username: '',
        password: ''
      },
      errors: {},
      successMessage,
    };
  }

  processForm(event: any) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const username = encodeURIComponent(this.state.user.username);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `username=${username}&password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'http://localhost:3000/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // save the token
        Auth.authenticateUser(xhr.response.token);

        // update authenticated state
        this.props.toggleAuthenticateStatus();

        // redirect signed in user to dashboard
        this.props.history.push('/map');
        // this.context.router.replace('/');
      } else {
        // failure

        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event: any) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({
      user
    });
  }
  render() {
    return (
      <LoginComponent
        onSubmit={this.processForm.bind(this)}
        onChange={this.changeUser.bind(this)}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
      />
    );
  }
}

export default withRouter(LoginPage);
