import * as React from 'react';
import HomePage from './HomePage';
import { connect } from 'react-redux';
import LoginPage from './LoginPage';
import MapPage from './MapPage';
import TKDHKHPage from './ThongKeDongHoKhachHangPage';
import Header from '../components/Header/Header';
import LogoutFunction from './LogoutFunction';
import Auth from '../modules/Auth';
import {
  BrowserRouter,
  Route,
  Redirect,
  // Redirect,
} from 'react-router-dom';

type Props = {

};

type State = {
  authenticated: boolean
};

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      authenticated: false
    };
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() });
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Header />
            <Route
              exact
              match
              path="/"
              component={HomePage}
            />
            <Route path="/map" render={props => (
              Auth.isUserAuthenticated() ? (
                <MapPage />
              ) : (
                  <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                  }} />
                )
            )}
            />
            <Route path="/thong-ke-dhkh" render={props => (
              Auth.isUserAuthenticated() ? (
                <TKDHKHPage />
              ) : (
                  <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                  }} />
                )
            )}
            />
            <Route
              path="/login"
              // component={LoginPage}
              render={props => (
                Auth.isUserAuthenticated() ? (
                  <Redirect
                    path="/login"
                    to={{
                      pathname: '/',
                      state: { from: props.location }
                    }}
                  />
                ) : (
                    <LoginPage toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                  )
              )}
            />
            <Route path="/logout" component={LogoutFunction} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Function) => ({

});

export default connect(null, mapDispatchToProps)(Index);
