import * as React from 'react';
import {
  AppBar, Drawer, MenuItem, Card, CardHeader, CardText, Divider, FlatButton
} from 'material-ui';
import Auth from '../../modules/Auth';
import { Link } from 'react-router-dom';
type Props = {

};

type States = {
  isOpenDrawer: boolean
};

class Header extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpenDrawer: false
    };
  }
  render() {
    return (
      <div>
        {
          Auth.isUserAuthenticated() ?
            <AppBar
              title="Cấp nước Bình Phước"
              onLeftIconButtonClick={e => this.setState({ isOpenDrawer: true })}
              // iconElementRight={<FlatButton label="Chọn thời gian" onClick={this.chonThoiGian.bind(this)} />}
              iconElementRight={
                <Link to="/logout">
                  <FlatButton label="Đăng xuất" style={{ color: '#fff' }} />
                </Link>
              }
            /> :
            <AppBar
              title="Cấp nước Bình Phước"
              // onLeftIconButtonClick={e => this.setState({ isOpenDrawer: true })}
              // iconElementRight={<FlatButton label="Chọn thời gian" onClick={this.chonThoiGian.bind(this)} />}
              showMenuIconButton={false}
            />
        }

        <Drawer
          open={this.state.isOpenDrawer}
          docked={false}
          onRequestChange={(open: boolean) => this.setState({ isOpenDrawer: open })}
        >
          <Card>
            <CardHeader
              title="DITAGIS"
              subtitle={new Date().toLocaleTimeString()}
            />
          </Card>
          <Link to="/map"><MenuItem primaryText="Quản lý mạng lưới" /></Link>
          <Link to="/thong-ke-dhkh"><MenuItem primaryText="Thống kê đồng hồ khách hàng" /></Link>
          <Divider />
          <CardText>Giới thiệu phần mềm</CardText>
          <CardText>Phiên bản:</CardText>
        </Drawer>
      </div>
    );
  }
}

export default (Header);
