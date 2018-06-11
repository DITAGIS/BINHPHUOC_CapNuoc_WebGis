import * as React from 'react';
import {
  AppBar, Drawer, MenuItem, Card, CardHeader, CardText, Divider
} from 'material-ui';
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
        <AppBar
          title="Cấp nước Bình Phước"
          // onLeftIconButtonClick={e => this.setState({ isOpenDrawer: true })}
          // iconElementRight={<FlatButton label="Chọn thời gian" onClick={this.chonThoiGian.bind(this)} />}
          showMenuIconButton={false}
        />
        <Drawer
          open={this.state.isOpenDrawer}
          docked={false}
          onRequestChange={(open: boolean) => this.setState({ isOpenDrawer: open })}
        >
          <Card>
            <CardHeader
              avatar="./images/icon/android-icon-72x72.png"
              title="DITAGIS"
              subtitle={new Date().toLocaleTimeString()}
            />
          </Card>
          <MenuItem primaryText="Tên phần mềm" />
          <Divider />
          <CardText>Giới thiệu phần mềm</CardText>
          <CardText>Phiên bản:</CardText>
        </Drawer>
      </div>
    );
  }
}

export default (Header);
