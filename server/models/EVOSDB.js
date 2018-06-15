const sql = require('mssql')
class Database {
  static async layDanhSachTuyenDuong() {
    try {
      const result = await sql.query`SELECT maDP,tenDP FROM DUONGPHO ORDER BY TENDP`
      sql.close();
      if (result)
        return result.recordset;
      else return null;
    } catch (err) {
      throw err;
    }
  }

  static async layKhachHang(maDP) {
    try {
      const result = await sql.query`SELECT TOP 1000 KH.maDP,KH.maDB,KH.tenKH
      FROM [EOSBP].[dbo].[KHACHHANG] AS KH
      LEFT JOIN 
      [BinhPhuocGIS].[sde].[DONGHOKHACHHANG] AS DHKH
      ON (KH.MADP+KH.MADB) = DHKH.DBDONGHONUOC
      WHERE KH.MADP = ${maDP} AND DHKH.DBDONGHONUOC IS NULL
      ORDER BY KH.STT`
      sql.close();
      if (result)
        return result.recordset;
      else return null;
    } catch (err) {
      throw err;
    }
  }

  static async thongKeTheoTuyenDuong() {
    try {
      const result = await sql.query`
        USE EOSBP
        SELECT DP.MaDP,DP.TenDP,COUNT(KH.MADB) AS SoLuong
        FROM DUONGPHO DP
        INNER JOIN KHACHHANG KH ON DP.MADP = KH.MADP
        GROUP BY DP.MADP,DP.TENDP
        ORDER BY SoLuong DESC`
      if (result)
        return result.recordset;
      else return null;
    } catch (err) {
      throw err;
    }
  }
  static async thongKeTieuThuTheoTuyenDuong() {
    try {
      const result = await sql.query`
      USE EOSBP
      SELECT DP.MaDP,DP.TenDP,SUM(TT.KLTIEUTHU) AS SoLuong
      FROM DUONGPHO DP
      INNER JOIN TieuThu TT ON DP.MADP = TT.MADP
      GROUP BY DP.MADP,DP.TENDP
      ORDER BY SoLuong DESC`
      if (result)
        return result.recordset;
      else return null;
    } catch (err) {
      throw err;
    }
  }
  static async thongKeDuongOngTheoTuyenDuong() {
    try {
      const result = await sql.query`
      USE EOSBP
      SELECT DP.MaDP,DP.TenDP,SUM(TT.KLTIEUTHU) AS SoLuong
      FROM DUONGPHO DP
      INNER JOIN TieuThu TT ON DP.MADP = TT.MADP
      GROUP BY DP.MADP,DP.TENDP
      ORDER BY SoLuong DESC`
      if (result)
        return result.recordset;
      else return null;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Database;