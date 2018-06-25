import * as React from 'react';
import EsriMap = require('esri/Map');
import MapView = require('esri/views/MapView');
import MapImageLayer = require('esri/layers/MapImageLayer');
import FeatureLayer = require('esri/layers/FeatureLayer');
import StatisticDefinition = require('esri/tasks/support/StatisticDefinition');
import * as Popup from '../map-lib/widgets/Popup';
import SearchWidget = require('esri/widgets/Search');
import watchUtils = require('esri/core/watchUtils');
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, YAxis, CartesianGrid, XAxis } from 'recharts';
import {
  Card, Tab, Tabs, Table,
  TableBody, TableRow, TableRowColumn, TableHeaderColumn, TableHeader, LinearProgress, Paper
} from 'material-ui';
import { thongKeTieuThuTheoTuyenDuong, thongKeTheoTuyenDuong, layTieuThuTheoKhachHangTrong12Thang } from '../apis/api';
import SwipeableViews from 'react-swipeable-views';

const COLORS = ['#1abc9c', '#2ecc71', '#3498db',
  '#9b59b6', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ChartData {
  name: string;
  key: number;
  value: number;
}

type Props = {
};
type States = {
  chartDatas: ChartData[],
  slideIndex: number;
  bieuDoTieuThu: {
    datas?: any[]
  }
  tuyenDuongDongHoState: {
    datas?: ThongKeTheoTuyenDuong[];
    isLoading: boolean,
    error?: string,
  }
  tieuThuState: {
    datas?: ThongKeTheoTuyenDuong[];
    isLoading: boolean,
    error?: string
  }
};

const classes = {
  container: 'mapDiv'
};

enum TAB_ID {
  TINH_TRANG,
  TUYEN_DUONG,
  TIEU_THU
}

class ThongKeDongHoKhachHang extends React.Component<Props, States> {
  private mapDiv: HTMLDivElement;
  private map: EsriMap;
  private view: MapView;
  private layer: FeatureLayer;

  constructor(props: Props) {
    super(props);
    this.state = {
      chartDatas: [],
      slideIndex: 0,
      bieuDoTieuThu: {
      },
      tuyenDuongDongHoState: {
        isLoading: true
      },
      tieuThuState: {
        isLoading: true
      }
    };
  }

  componentDidMount() {
    this.map = new EsriMap({ basemap: 'osm' });
    this.view = new MapView({
      map: this.map,
      container: this.mapDiv,
      center: [106.895454, 11.527332],
      zoom: 11
    });

    this.initFL();
    this.initWidget();
  }

  private initWidget() {
    this.view.ui.empty('top-left');
    var popup = new Popup.default({
      view: this.view,
      layerInfos: this.map.allLayers.filter(f => f.type === 'feature')
        .map(m => {
          return {
            layer: m,
            showDeleteButton: false,
            showAttachments: true,
            isEditable: false
          } as Popup.LayerInfo;
        }).toArray()
    });

    // tìm kiếm
    var search = new SearchWidget({
      view: this.view,
      searchAllEnabled: false,
      sources: [
        {
          featureLayer: this.layer,
          displayField: 'DBDONGHONUOC',
          searchFields: ['DBDONGHONUOC', 'SODIENTHOAI', 'SOHOKHAU',
            'NGUOICAPNHAT', 'LOAIDONGHO', 'HIEUDONGHO', 'SOCHUNGMINH'],
          placeholder: 'Tìm đồng hồ khách hàng'
        } as __esri.FeatureLayerSource,
      ]
    });

    this.view.ui.add(search, 'top-left');

    this.view.popup.watch('selectedFeature', (newValue: __esri.Graphic) => {
      if (newValue.layer.id === 'DHKH') {
        const maDanhBo = newValue.attributes.DBDONGHONUOC;
        if (maDanhBo) {
          layTieuThuTheoKhachHangTrong12Thang({
            maDanhBo
          })
            .then(function (result) {
              console.log(result);
            })
        }
      }
    });
  }

  private initFL() {
    var basemap = new MapImageLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/Basemap/MapServer',
      title: 'Bản đồ nền',
      id: 'basemap',
      opacity: 0.8
    });

    this.layer = new FeatureLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/ChuyenDe/FeatureServer/0',
      title: 'Đồng hồ khách hàng',
      outFields: ['*'],
      minScale: 0,
      id: 'DHKH'
    });
    this.map.addMany([basemap, this.layer]);
    this.view.whenLayerView(this.layer)
      .then((layerView: __esri.LayerView) => {
        let domain = this.layer.getFieldDomain('TinhTrangKhaoSat') as __esri.CodedValueDomain,
          codedValues = domain.codedValues;
        this.setState({
          chartDatas: codedValues.map(m => {
            return {
              name: m.name,
              key: m.code,
              value: 0
            } as ChartData;
          })
        });

        let falseHandle = watchUtils.watch(layerView, 'updating', (val: boolean) => {
          if (!val && this.state.slideIndex === TAB_ID.TINH_TRANG) {
            this.layer.queryFeatureCount({
              where: '1=1'
            })
              .then((count: number) => {
                if (count > 0) {
                  falseHandle.remove();
                  this.queryLayerViewStats(layerView);
                }
              });
          }
          watchUtils.whenTrue(this.view, 'stationary', (value) => {
            if (this.state.slideIndex === TAB_ID.TINH_TRANG) {
              this.queryLayerViewStats(layerView);
            }
          });
        });
      });
  }

  private queryLayerViewStats(layerView: __esri.LayerView) {

    // query statistics for features only in view extent
    const query = this.layer.createQuery();
    query.outStatistics = [new StatisticDefinition({
      onStatisticField: 'TinhTrangKhaoSat',
      outStatisticFieldName: 'Value',
      statisticType: 'count'
    })];
    query.groupByFieldsForStatistics = ['TinhTrangKhaoSat'];
    query.geometry = this.view.extent;

    // query features within the view's extent on the client
    return this.layer.queryFeatures(query)
      .then((data) => {
        let chartDatas = this.state.chartDatas.slice();
        chartDatas.forEach(f => {
          f.value = 0;
        });
        data.features.forEach(feature => {
          const attributes = feature.attributes;
          const { TinhTrangKhaoSat, Value } = attributes;
          let chartData = chartDatas.find(f => f.key === TinhTrangKhaoSat);
          if (chartData) {
            chartData.value = Value;
          }
        });

        this.setState({ chartDatas });

      });
  }

  // helper function for formatting number labels with commas
  // private numberWithCommas(value) {
  //   value = value || 0;
  //   return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // }
  private async  handleChange(value: number) {
    this.setState({ slideIndex: value });

    if (value === TAB_ID.TUYEN_DUONG) {
      let states = {
        ...this.state.tuyenDuongDongHoState
      };
      // nếu chưa tải dữ liệu thống kê tuyến đường
      if (!states.datas) {
        try {
          let results = await thongKeTheoTuyenDuong() as ThongKeTheoTuyenDuong[];
          states.datas = results;
        } catch (error) {
          states.error = 'Có lỗi xảy ra trong quá trình thực hiện';
        }
        finally {
          states.isLoading = false;
        }
      }
      this.setState({ tuyenDuongDongHoState: states });
    } else if (value === TAB_ID.TIEU_THU) {
      let states = {
        ...this.state.tieuThuState
      };
      // nếu chưa tải dữ liệu thống kê tuyến đường
      if (!states.datas) {
        try {
          let results = await thongKeTieuThuTheoTuyenDuong() as ThongKeTheoTuyenDuong[];
          states.datas = results;
        } catch (error) {
          states.error = 'Có lỗi xảy ra trong quá trình thực hiện';
        }
        finally {
          states.isLoading = false;
        }
      }
      this.setState({ tieuThuState: states });
    }

  }
  render() {
    return (
      <div className={classes.container}>
        <div
          style={{ width: '100%', height: '100%' }}
          ref={
            (element: HTMLDivElement) => this.mapDiv = element
          }>
        </div>
        {this.state.bieuDoTieuThu.datas &&
          <Paper style={{ position: 'absolute', bottom: 0, left: 10, height: 250, width: 500 }}>
            <BarChart width={480} height={230} data={this.state.bieuDoTieuThu.datas}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pv" fill="#8884d8" />
            </BarChart>
          </Paper>
        }
        <Paper style={{ position: 'absolute', top: 80, right: 10, height: 615, width: 320 }}>
          <Tabs
            onChange={this.handleChange.bind(this)}
            value={this.state.slideIndex}
          >
            <Tab label="Tình trạng" value={TAB_ID.TINH_TRANG} />
            <Tab label="Tuyến đường" value={TAB_ID.TUYEN_DUONG} />
            <Tab label="Tiêu thụ" value={TAB_ID.TIEU_THU} />
          </Tabs>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
          >
            <div>
              <h1 style={{ width: '100%', fontSize: 24, textAlign: 'center' }}>Biểu đồ tình trạng khảo sát</h1>
              <h2 style={{ width: '100%', fontSize: 20, textAlign: 'center' }}>Đồng hồ khách hàng</h2>
              <p style={{ textAlign: 'center' }}>
                Tổng đồng hồ:
            <strong>
                  {(
                    this.state.chartDatas && this.state.chartDatas.length > 1) ?
                    this.state.chartDatas.reduce((a, b) =>
                      ({ value: a.value + b.value, name: '', key: 0 })).value + '' : '0'
                  }
                </strong>
              </p>
              <PieChart width={320} height={350}>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} align="center" />
                {
                  this.state.chartDatas && this.state.chartDatas.length > 0 &&
                  < Pie data={this.state.chartDatas}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={20}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {
                      this.state.chartDatas.map((entry, index) =>
                        <Cell key={'cell' + entry.key} fill={COLORS[index % COLORS.length]} />)
                    }
                  </Pie>
                }
              </PieChart>
            </div>
            <div>
              <h1 style={{ width: '100%', fontSize: 24, textAlign: 'center' }}>Số đồng hồ theo tuyến đường</h1>
              {this.state.tuyenDuongDongHoState.error &&
                <h4 style={{ color: 'red' }}>{this.state.tuyenDuongDongHoState.error}</h4>
              }
              {this.state.tuyenDuongDongHoState.isLoading && <LinearProgress />}
              <div style={{ height: '100%', width: 400, overflowX: 'auto' }}>
                <Table
                  height="400px"
                  selectable={true}
                  multiSelectable={false}
                  allRowsSelected={false}
                >
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                      <TableHeaderColumn style={{ width: 40 }}>Mã ĐP</TableHeaderColumn>
                      <TableHeaderColumn>Tên ĐP</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: 40 }}>Số lượng</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {
                      this.state.tuyenDuongDongHoState.datas
                      && this.state.tuyenDuongDongHoState.datas.map(
                        m =>
                          <TableRow>
                            <TableRowColumn style={{ width: 40 }}>{m.MaDP}</TableRowColumn>
                            <TableRowColumn>{m.TenDP}</TableRowColumn>
                            <TableRowColumn style={{ width: 40 }}>{m.SoLuong}</TableRowColumn>
                          </TableRow>
                      )
                    }

                  </TableBody>
                </Table>
              </div>
            </div>
            <div>
              <h1 style={{ width: '100%', fontSize: 24, textAlign: 'center' }}>Chỉ số tiêu thụ theo tuyến đường</h1>
              {this.state.tieuThuState.error &&
                <h4 style={{ color: 'red' }}>{this.state.tieuThuState.error}</h4>
              }
              {this.state.tieuThuState.isLoading && <LinearProgress />}
              <div style={{ height: '100%', width: 430, overflowX: 'auto' }}>
                <Table
                  height="400px"
                  selectable={true}
                  multiSelectable={false}
                  allRowsSelected={false}
                >
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                      <TableHeaderColumn style={{ width: 40 }}>Mã ĐP</TableHeaderColumn>
                      <TableHeaderColumn>Tên ĐP</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: 70 }}>Tổng tiêu thụ</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {
                      this.state.tieuThuState.datas
                      && this.state.tieuThuState.datas.map(
                        m =>
                          <TableRow>
                            <TableRowColumn style={{ width: 40 }}>{m.MaDP}</TableRowColumn>
                            <TableRowColumn>{m.TenDP}</TableRowColumn>
                            <TableRowColumn style={{ width: 70 }}>{m.SoLuong}</TableRowColumn>
                          </TableRow>
                      )
                    }

                  </TableBody>
                </Table>
              </div>
            </div>
          </SwipeableViews>
        </Paper>
      </div>
    );
  }
}

interface ThongKeTheoTuyenDuong {
  MaDP: string;
  TenDP: string;
  SoLuong: number;
}

export default ThongKeDongHoKhachHang;