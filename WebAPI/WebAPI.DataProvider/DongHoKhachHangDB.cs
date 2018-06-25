using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAPI.DataProvider.EF;
using WebAPI.DataProvider.Models;

namespace WebAPI.DataProvider
{
    public class DongHoKhachHangDB
    {
        public List<ThongKeTheoTuyenDuong> ThongKeTheoTuyenDuong()
        {
            try
            {
                using (var context = new EOSBPEntities())
                {
                    var query = @"SELECT DP.MaDP,DP.TenDP,CAST(COUNT(KH.MADB) AS BIGINT) AS SoLuong
        FROM DUONGPHO DP
        INNER JOIN KHACHHANG KH ON DP.MADP = KH.MADP
        GROUP BY DP.MADP,DP.TENDP
        ORDER BY SoLuong DESC";
                    query = Helper.Query(query);
                    return context.Database.SqlQuery<ThongKeTheoTuyenDuong>(query).ToList();
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<ThongKeTheoTuyenDuong> ThongKeTieuThuTheoTuyenDuong()
        {
            try
            {
                using (var context = new EOSBPEntities())
                {
                    var query = @"SELECT DP.MaDP,DP.TenDP,CAST(SUM(TT.KLTIEUTHU) AS BIGINT) AS SoLuong
                                    FROM DUONGPHO DP
                                  INNER JOIN TieuThu TT ON DP.MADP = TT.MADP
                                    GROUP BY DP.MADP,DP.TENDP
                                  ORDER BY SoLuong DESC";
                    query = Helper.Query(query);
                    return context.Database.SqlQuery<ThongKeTheoTuyenDuong>(query).ToList();
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public List<ThongKeTheoTuyenDuong> ThongKeDuongOngTheoTuyenDuong()
        {
            try
            {
                using (var context = new EOSBPEntities())
                {
                    var query = @"SELECT DP.MaDP,DP.TenDP,CAST(SUM(TT.KLTIEUTHU) AS BIGINT) AS SoLuong
                                    FROM DUONGPHO DP
                                  INNER JOIN TieuThu TT ON DP.MADP = TT.MADP
                                    GROUP BY DP.MADP,DP.TENDP
                                  ORDER BY SoLuong DESC";
                    query = Helper.Query(query);
                    return context.Database.SqlQuery<ThongKeTheoTuyenDuong>(query).ToList();
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public object LayTieuThuTheoKhachHangTrong12Thang(string maDanhBo)
        {
            try
            {
                using (var context = new EOSBPEntities())
                {
                    var query = String.Format(@"SELECT TOP 12 KLTIEUTHU AS SoLuong, Nam, Thang
                                              FROM TieuThu
                                              WHERE SODB = '{0}'", maDanhBo);
                    query = Helper.Query(query);
                    return context.Database.SqlQuery<object>(query);
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
