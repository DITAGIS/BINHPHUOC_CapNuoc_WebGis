const API_URL = 'http://localhost:50191/api';
import Auth from '../modules/Auth';
import { ajax } from 'jquery';

function post(url: string, body?: Object) {
  return ajax(url, {
    contentType: 'application/json',
    dataType: 'json',
    type: 'POST',
    data: body && JSON.stringify(body),
    headers: {
      'Authorization': Auth.getToken()
    }
  });
}

export function login(username: string, password: string) {
  return ajax(API_URL + '/Login', {
    contentType: 'application/json',
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify({
      Username: username, Password: password
    })
  });
}

export function thongKeTheoTuyenDuong() {
  var url = API_URL + '/DHKH/thongketheotuyenduong';
  return post(url);
}
export function thongKeTieuThuTheoTuyenDuong() {
  var url = API_URL + '/DHKH/thongketieuthutheotuyenduong';
  return post(url);
}
export function thongKeDuongOngTheoTuyenDuong() {
  var url = API_URL + '/DHKH/thongkeduongongtheotuyenduong';
  return post(url);
}
export function layTieuThuTheoKhachHangTrong12Thang(maDanhBo: string) {
  var url = API_URL + '/DHKH/laytieuthutheokhachhangtrong12thang';
  return post(url, JSON.stringify(maDanhBo));
}