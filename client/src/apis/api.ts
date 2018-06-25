const SERVICE_URL = 'http://localhost:3000';
import Auth from '../modules/Auth';
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