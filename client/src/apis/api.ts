const SERVICE_URL = 'http://localhost:3000';
import Auth from '../modules/Auth';
import { ajax } from 'jquery';

// function post(url: string, body?: Object) {
//   // return new Promise((resolve, reject) => {
//     return $.post(url, JSON.stringify(body || ''))
//   //   fetch(url, {
//   //     method: 'POST',
//   //     headers: {
//   //       'Accept': 'application/json',
//   //       'Content-Type': 'application/json'
//   //     },
//   //     body: JSON.stringify(body || '')
//   //   })
//   //     .then(r => r.json())
//   //     .catch(e => reject(e))
//   //     .then(r => resolve(r));
//   // });
// }

export function login(username: string, password: string) {
  // return post('http://localhost:50191/api/Login', {
  //   Username: username, Password: password
  // });
  return ajax('http://localhost:50191/api/Login', {
    contentType: 'application/json',
    dataType: 'json',
    type: 'POST',
    data:  JSON.stringify({
      Username: username, Password: password
    })
  });
}

export function thongKeTheoTuyenDuong() {
  return new Promise((resolve, reject) => {
    fetch(SERVICE_URL + '/api/thongketheotuyenduong', { method: 'POST' })
      .then(r => r.json())
      .catch(e => reject(e))
      .then(r => resolve(r));
  });
}
export function thongKeTieuThuTheoTuyenDuong() {
  return new Promise((resolve, reject) => {
    fetch(SERVICE_URL + '/api/thongketieuthutheotuyenduong', { method: 'POST' })
      .then(r => r.json())
      .catch(e => reject(e))
      .then(r => resolve(r));
  });
}
export function thongKeDuongOngTheoTuyenDuong() {
  return new Promise((resolve, reject) => {
    fetch(SERVICE_URL + '/api/thongkeduongongtheotuyenduong', { method: 'POST' })
      .then(r => r.json())
      .catch(e => reject(e))
      .then(r => resolve(r));
  });
}
export function layTieuThuTheoKhachHangTrong12Thang(body: {
  maDanhBo: string
}) {
  return new Promise((resolve, reject) => {
    fetch(SERVICE_URL + '/api/layTieuThuTheoKhachHangTrong12Thang', {
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then(r => r.json())
      .catch(e => reject(e))
      .then(r => resolve(r));
  });
}