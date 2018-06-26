import * as React from 'react';
import EsriMap = require('esri/Map');
import MapView = require('esri/views/MapView');
import MapImageLayer = require('esri/layers/MapImageLayer');
import FeatureLayer = require('esri/layers/FeatureLayer');
import StatisticDefinition = require('esri/tasks/support/StatisticDefinition');
import * as Popup from '../map-lib/widgets/Popup';
import SearchWidget = require('esri/widgets/Search');
import Expand = require('esri/widgets/Expand');
import LayerList = require('esri/widgets/LayerList');
import Legend = require('esri/widgets/Legend');
import {
  Tab, Tabs, Paper
} from 'material-ui';
import { thongKeDuongOngTheoTuyenDuong } from '../apis/api';
import TuyenDuongComponent from './DuongOng/TuyenDuongComponent';

type Props = {
};
type States = {
  slideIndex: number;
  tuyenDuongState: {
    datas?: ThongKeTheoTuyenDuong[];
    isLoading: boolean,
    error?: string,
  }
};

const classes = {
  container: 'mapDiv'
};

enum TAB_ID {
  TUYEN_DUONG,
  DONG_HO
}

class ThongKeDuongOng extends React.Component<Props, States> {
  private mapDiv: HTMLDivElement;
  private map: EsriMap;
  private view: MapView;
  private layer: FeatureLayer;

  constructor(props: Props) {
    super(props);
    this.state = {
      slideIndex: -1,

      tuyenDuongState: {
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
    this.handleChange(TAB_ID.TUYEN_DUONG);
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
          featureLayer: this.map.findLayerById('DuongOng'),
          displayField: 'MADUONGONG',
          searchFields: ['MADUONGONG', 'TEN', 'NGUOICAPNHAT'],
          placeholder: 'Tìm đường ống'
        } as __esri.FeatureLayerSource,
        {
          featureLayer: this.map.findLayerById('DHKH'),
          displayField: 'DBDONGHONUOC',
          searchFields: ['DBDONGHONUOC', 'SODIENTHOAI', 'SOHOKHAU',
            'NGUOICAPNHAT', 'LOAIDONGHO', 'HIEUDONGHO', 'SOCHUNGMINH'],
          placeholder: 'Tìm đồng hồ khách hàng'
        } as __esri.FeatureLayerSource,
      ]
    });

    this.view.ui.add(search, 'top-left');

    var expand =
      new Expand({
        expandTooltip: 'Lớp dữ liệu',
        content:
          new LayerList({
            view: this.view,
            listItemCreatedFunction: function (event: any) {
              const item = event.item;
              item.panel = {
                content: 'legend',
                open: true
              };
            }
          })
      });

    this.view.ui.add(expand, 'top-left');
    // không có dòng này thì layerlist không load được legend
    var legend = new Legend({ view: this.view });
  }

  private initFL() {
    var basemap = new MapImageLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/Basemap/MapServer',
      title: 'Bản đồ nền',
      id: 'basemap',
      opacity: 0.8
    });

    this.layer = new FeatureLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/ChuyenDe/FeatureServer/3',
      title: 'Đường ống',
      outFields: ['*'],
      minScale: 0,
      id: 'DuongOng'
    });
    let ongNganh = new FeatureLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/ChuyenDe_TMP/FeatureServer/0',
      title: 'Ống ngành',
      outFields: ['*'],
      id: 'OngNganh'
    });
    let dongHoKhachHang = new FeatureLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/ChuyenDe/FeatureServer/0',
      title: 'Đồng hồ khách hàng',
      outFields: ['*'],
      id: 'DHKH'
    });
    this.map.addMany([basemap, this.layer, ongNganh, dongHoKhachHang]);
  }

  private async  handleChange(value: number) {
    this.setState({ slideIndex: value });

    if (value === TAB_ID.TUYEN_DUONG) {
      let states = {
        ...this.state.tuyenDuongState
      };
      // nếu chưa tải dữ liệu thống kê tuyến đường
      if (!states.datas) {
        try {
          let results = await thongKeDuongOngTheoTuyenDuong() as ThongKeTheoTuyenDuong[];
          states.datas = results;
          states.error = undefined;
        } catch (error) {
          states.error = 'Có lỗi xảy ra trong quá trình thực hiện';
        }
        finally {
          states.isLoading = false;
        }
      }
      this.setState({ tuyenDuongState: states });
    }

  }
  render() {
    const { tuyenDuongState } = this.state;
    return (
      <div className={classes.container}>
        <div
          style={{ width: '100%', height: '100%' }}
          ref={
            (element: HTMLDivElement) => this.mapDiv = element
          }>
        </div>
        <Paper style={{ position: 'absolute', top: 80, right: 10, height: 615, width: 500 }}>
          <Tabs
            onChange={this.handleChange.bind(this)}
            value={this.state.slideIndex}
          >
            <Tab label="Tuyến đường" value={TAB_ID.TUYEN_DUONG}>
              <TuyenDuongComponent
                datas={tuyenDuongState.datas}
                error={tuyenDuongState.error}
                isLoading={tuyenDuongState.isLoading}
              />
            </Tab>
            <Tab label="Đồng hồ" value={TAB_ID.DONG_HO}>
              <h1>Đang phát triển</h1>
            </Tab>
          </Tabs>
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

export default ThongKeDuongOng;