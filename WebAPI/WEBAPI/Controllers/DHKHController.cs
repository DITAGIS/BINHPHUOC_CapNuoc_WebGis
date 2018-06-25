using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.DataProvider;
using WebAPI.DataProvider.Models;

namespace WebAPI.Controllers
{

    [Authorize]
    public class DHKHController : ApiController
    {
        private DongHoKhachHangDB context = new DongHoKhachHangDB();

        [Route("api/DHKH/thongketieuthutheotuyenduong")]
        public HttpResponseMessage ThongKeTieuThuTheoTuyenDuong()
        {
            try
            {
                var result = context.ThongKeTieuThuTheoTuyenDuong();
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
        }
        [Route("api/DHKH/thongketheotuyenduong")]
        public HttpResponseMessage ThongKeTheoTuyenDuong()
        {
            try
            {
                var result = context.ThongKeTheoTuyenDuong();
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
        }
        [Route("api/DHKH/thongkeduongongtheotuyenduong")]
        public HttpResponseMessage ThongKeDuongOngTheoTuyenDuong()
        {
            try
            {
                var result = context.ThongKeDuongOngTheoTuyenDuong();
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
        }
    }
}
