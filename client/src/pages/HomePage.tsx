import * as React from 'react';
import Auth from '../modules/Auth';
import { Link } from 'react-router-dom';
import { CardText, CardTitle, Card } from 'material-ui';

const classes = {
  container: 'container'
};

class HomePage extends React.Component {
  render() {
    return (
      <Card className={classes.container}>
        <CardTitle title="CÔNG TY CP CẤP THOÁT NƯỚC BÌNH PHƯỚC" subtitle="Hệ thống quản lý mạng lưới cấp nước" />
        <CardText style={{ fontSize: '16px', color: 'green' }}>
          Bình phước là một tỉnh thuộc miền Đông Nam bộ,
          nằm trong Vùng kinh tế trọng điểm phía Nam,
          có độ cao trung bình trên 50m so với mặt nước biển,
          cách thành phố Hồ Chí Minh 110km, với các tuyến đường...
        </CardText>
        {!Auth.isUserAuthenticated() ? (
          < CardText >
            Vui lòng  <Link to={'/login'}>đăng nhập</Link> để truy cập ứng dụng
          </CardText>
        ) : (
            < CardText >
              Truy cập <Link to={'/map'}>bản đồ</Link>
            </CardText>
          )
        }
      </Card >
    );
  }
}

export default HomePage;