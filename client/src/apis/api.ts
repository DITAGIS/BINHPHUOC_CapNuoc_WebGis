const SERVICE_URL = 'http://tanhoa.ditagis.com/api';
import Auth from '../modules/Auth';
export function thongKeTheoTuyenDuong() {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/thongketheotuyenduong', { method: 'POST' })
      .then(r => r.json())
      .catch(e => reject(e))
      .then(r => resolve(r));
  });
}
export function thongKeTieuThuTheoTuyenDuong() {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/thongketieuthutheotuyenduong', { method: 'POST' })
      .then(r => r.json())
      .catch(e => reject(e))
      .then(r => resolve(r));
  });
}
export function thongKeDuongOngTheoTuyenDuong() {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/thongkeduongongtheotuyenduong', { method: 'POST' })
      .then(r => r.json())
      .catch(e => reject(e))
      .then(r => resolve(r));
  });
}