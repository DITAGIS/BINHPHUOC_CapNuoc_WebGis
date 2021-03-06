import * as React from 'react';
import EsriMap = require('esri/Map');
import MapView = require('esri/views/MapView');
import MapImageLayer = require('esri/layers/MapImageLayer');
import FeatureLayer = require('esri/layers/FeatureLayer');
import StatisticDefinition = require('esri/tasks/support/StatisticDefinition');
import * as Popup from '../map-lib/widgets/Popup';
import SearchWidget = require('esri/widgets/Search');
import watchUtils = require('esri/core/watchUtils');

import {
  Tab, Tabs, Paper
} from 'material-ui';
import { thongKeTieuThuTheoTuyenDuong, thongKeTheoTuyenDuong, layTieuThuTheoKhachHangTrong12Thang } from '../apis/api';
import TinhTrangComponent from './DongHoKhachHang/TinhTrangComponent';
import TuyenDuongComponent from './DongHoKhachHang/TuyenDuongComponent';
import TieuThuComponent from './DongHoKhachHang/TieuThuComponent';
import BieuDoTieuThuComponent from './DongHoKhachHang/BieuDoTieuThuComponent';

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
    datas?: any[],
    isLoading: boolean,
    error?: string,
    isOpen: boolean,
    danhBo?: string
  }
  tuyenDuongDongHo: {
    datas?: ThongKeTheoTuyenDuong[];
    isLoading: boolean,
    error?: string,
  }
  tieuThu: {
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
        isLoading: true,
        isOpen: false
      },
      tuyenDuongDongHo: {
        isLoading: true
      },
      tieuThu: {
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

    this.view.popup.watch('selectedFeature', this.popupSelectedFeatureChangeHandle.bind(this));
    this.view.popup.watch('visible', this.popupVisibleChangeHandle.bind(this));
  }
  /**
   * Bắt sự kiện đóng mở popup
   */
  private popupVisibleChangeHandle(newVal: boolean, oldVal: boolean) {
    // nếu newVal = false tức là popup đã tắt
    if (!newVal) {
      // tắt hiển thị biểu đồ tiêu thụ
      this.setState({
        bieuDoTieuThu: {
          datas: [],
          error: undefined,
          isLoading: true,
          isOpen: false
        }
      });
    }
  }

  /**
   * Bắt sự kiện thay đổi đối tượng hiển thị popup
   */
  private popupSelectedFeatureChangeHandle(newVal: __esri.Graphic, oldVal: __esri.Graphic) {

    if (newVal && newVal.layer.id === 'DHKH' && (newVal !== oldVal)) {
      const maDanhBo = newVal.attributes.DBDONGHONUOC;
      if (maDanhBo) {
        this.setState({
          bieuDoTieuThu: {
            datas: [],
            error: undefined,
            isLoading: true,
            isOpen: true,
            danhBo: maDanhBo
          }
        });

        layTieuThuTheoKhachHangTrong12Thang(maDanhBo)
          .then((result: any) => {
            this.setState({
              bieuDoTieuThu: {
                datas: result,
                error: undefined,
                isLoading: false,
                isOpen: true,
                danhBo: maDanhBo
              }
            });
          })
          .catch((e: any) => {
            this.setState({
              bieuDoTieuThu: {
                datas: [],
                error: e && e.Message && e.Message,
                isLoading: false,
                isOpen: true
              }
            });
          });
      } else {
        this.setState({
          bieuDoTieuThu: {
            datas: [],
            error: 'Không tồn tại mã danh bộ',
            isLoading: false,
            isOpen: true
          }
        });
      }
    } else {
      this.setState({
        bieuDoTieuThu: {
          datas: [],
          error: undefined,
          isLoading: true,
          isOpen: false
        }
      });
    }
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
        ...this.state.tuyenDuongDongHo
      };
      // nếu chưa tải dữ liệu thống kê tuyến đường
      if (!states.datas) {
        try {
          let results = await thongKeTheoTuyenDuong() as ThongKeTheoTuyenDuong[];
          states.datas = results;
          states.error = undefined;
        } catch (error) {
          states.error = 'Có lỗi xảy ra trong quá trình thực hiện';
        }
        finally {
          states.isLoading = false;
          this.setState({ tuyenDuongDongHo: states });
        }
      }
    } else if (value === TAB_ID.TIEU_THU) {
      let states = {
        ...this.state.tieuThu
      };
      // nếu chưa tải dữ liệu thống kê tuyến đường
      if (!states.datas) {
        try {
          let results = await thongKeTieuThuTheoTuyenDuong() as ThongKeTheoTuyenDuong[];
          states.datas = results;
          states.error = undefined;
        } catch (error) {
          states.error = 'Có lỗi xảy ra trong quá trình thực hiện';
        }
        finally {
          states.isLoading = false;
          this.setState({ tieuThu: states });
        }
      }
    }

  }
  render() {
    const { tuyenDuongDongHo, tieuThu, bieuDoTieuThu } = this.state;
    return (
      <div className={classes.container}>
        <div
          style={{ width: '100%', height: '100%' }}
          ref={
            (element: HTMLDivElement) => this.mapDiv = element
          }>
        </div>
        <BieuDoTieuThuComponent
          datas={bieuDoTieuThu.datas}
          error={bieuDoTieuThu.error}
          isLoading={bieuDoTieuThu.isLoading}
          isOpen={bieuDoTieuThu.isOpen}
          danhBo={bieuDoTieuThu.danhBo ? bieuDoTieuThu.danhBo : ''}
        />
        <Paper style={{ position: 'absolute', top: 80, right: 10, height: 615, width: 405 }}>
          <Tabs
            onChange={this.handleChange.bind(this)}
            value={this.state.slideIndex}
          >
            <Tab label="Tình trạng" value={TAB_ID.TINH_TRANG}>
              <TinhTrangComponent datas={this.state.chartDatas} />
            </Tab>
            <Tab label="Tuyến đường" value={TAB_ID.TUYEN_DUONG}>
              <TuyenDuongComponent
                datas={tuyenDuongDongHo.datas}
                error={tuyenDuongDongHo.error}
                isLoading={tuyenDuongDongHo.isLoading} />
            </Tab>
            <Tab label="Tiêu thụ" value={TAB_ID.TIEU_THU} >
              <TieuThuComponent
                datas={tieuThu.datas}
                error={tieuThu.error}
                isLoading={tieuThu.isLoading} />
            </Tab>
          </Tabs>
          {/* <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
          >
            <TinhTrangComponent datas={this.state.chartDatas} />
            <TuyenDuongComponent
              datas={tuyenDuongDongHoState.datas}
              error={tuyenDuongDongHoState.error}
              isLoading={tuyenDuongDongHoState.isLoading} />
            <TieuThuComponent
              datas={tieuThuState.datas}
              error={tieuThuState.error}
              isLoading={tieuThuState.isLoading} />
            />
          </SwipeableViews> */}
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