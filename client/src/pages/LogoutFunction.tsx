import * as React from 'react';
import Auth from '../modules/Auth';
import { withRouter, RouteComponentProps } from 'react-router-dom';

class LogoutFunction extends React.Component<RouteComponentProps<null>, {}> {

  componentDidMount() {
    // deauthenticate user
    Auth.deauthenticateUser();
    // change the current URL to / after logout
    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <p>Đang đăng xuất...</p>
      </div>
    );
  }
}

export default withRouter(LogoutFunction);
