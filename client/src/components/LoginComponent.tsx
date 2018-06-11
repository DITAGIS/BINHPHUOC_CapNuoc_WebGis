import * as React from 'react';
import User from '../models/User';
import { Card, TextField, RaisedButton } from 'material-ui';

type Props = {
  onSubmit: (event: object) => void
  onChange: (event: object) => void
  successMessage: string
  user: User,
  errors: {
    summary?: string,
    username?: string,
    password?: string
  }
};
type States = {

};

class LoginComponent extends React.Component<Props, States> {
  render() {
    const { user, successMessage, onChange, onSubmit, errors } = this.props;
    return (
      <Card className="container">
        <form action="/" onSubmit={onSubmit}>
          <h2 className="card-heading">Đăng nhập</h2>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errors.summary && <p className="error-message">{errors.summary}</p>}

          <div className="field-line">
            <TextField
              floatingLabelText="Tài khoản"
              name="username"
              errorText={errors.username}
              onChange={onChange}
              value={user.username}
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Mật khẩu"
              type="password"
              name="password"
              onChange={onChange}
              errorText={errors.password}
              value={user.password}
            />
          </div>

          <div className="button-line">
            <RaisedButton type="submit" label="Đăng nhập" primary />
          </div>
        </form>
      </Card>
    );
  }
}

export default LoginComponent;