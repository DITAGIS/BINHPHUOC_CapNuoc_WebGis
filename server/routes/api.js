const express = require('express');
const EVOSDB = require('../models/EVOSDB');
const HTTP_STATUS = require('http-status');

const router = new express.Router();

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message.",
    // user values passed through from auth middleware
    user: req.user
  });
});

router.post('/thongketheotuyenduong', (req, res) => {
  EVOSDB.thongKeTheoTuyenDuong()
    .then((values) => {
      res.status(HTTP_STATUS.OK).json(values);
    })
    .catch((err) => {
      res.status(HTTP_STATUS.BAD_REQUEST).json(err);
    });
});
router.post('/thongketieuthutheotuyenduong', (req, res) => {
  EVOSDB.thongKeTieuThuTheoTuyenDuong()
    .then((values) => {
      res.status(HTTP_STATUS.OK).json(values);
    })
    .catch((err) => {
      res.status(HTTP_STATUS.BAD_REQUEST).json(err);
    });
});

module.exports = router;
