import * as React from 'react';
import LoginComponent from '../components/LoginComponent';
import User from '../models/User';
import Auth from '../modules/Auth';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { login } from '../apis/api';
type State = {
  user: User
  errors: string
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
      errors: '',
      successMessage,
    };
  }

  processForm(event: any) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const username = encodeURIComponent(this.state.user.username);
    const password = encodeURIComponent(this.state.user.password);

    login(username, password)
      .then((token: string) => {
        Auth.authenticateUser(token);

        // update authenticated state
        this.props.toggleAuthenticateStatus();

        // redirect signed in user to dashboard
        this.props.history.push('/map');
      })
      .catch((e: any) => {
        if (e.responseJSON.Message) {
          this.setState({
            errors: e.responseJSON.Message
          });
        }
      });
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
