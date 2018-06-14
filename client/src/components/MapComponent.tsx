import * as React from 'react';
import EsriMap = require('esri/Map');
import MapView = require('esri/views/MapView');
import MapImageLayer = require('esri/layers/MapImageLayer');
import FeatureLayer = require('esri/layers/FeatureLayer');
import LayerList = require('esri/widgets/LayerList');
import Expand = require('esri/widgets/Expand');
import Legend = require('esri/widgets/Legend');
import * as Popup from '../map-lib/widgets/Popup';
import SearchWidget = require('esri/widgets/Search');
import Locator = require('esri/tasks/Locator');
type Props = {
};
type States = {

};

const classes = {
  container: 'mapDiv'
};

class LoginComponent extends React.Component<Props, States> {
  private mapDiv: HTMLDivElement;
  private map: EsriMap;
  private view: MapView;

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

    var popup = new Popup.default({
      view: this.view,
      layerInfos: this.map.allLayers.filter(f => f.type === 'feature')
        .map(m => {
          return {
            layer: m,
            showDeleteButton: true,
            showAttachments: true,
            isEditable: true
          } as Popup.LayerInfo;
        }).toArray()
    });

    // tìm kiếm
    var search = new SearchWidget({
      view: this.view,
      searchAllEnabled: false,
      sources: [
        {
          locator: new Locator({ url: '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer' }),
          singleLineFieldName: 'SingleLine',
          outFields: ['Addr_type'],
          countryCode: 'VNM',
          localSearchOptions: {
            minScale: 300000,
            distance: 50000
          },
          popupEnabled: false,
          placeholder: 'Tìm địa chỉ',
          name: 'Tìm địa chỉ',
        } as __esri.LocatorSource,
        {
          featureLayer: this.map.findLayerById('DHKH'),
          displayField: 'DBDONGHONUOC',
          searchFields: ['DBDONGHONUOC', 'SODIENTHOAI', 'SOHOKHAU',
            'NGUOICAPNHAT', 'LOAIDONGHO', 'HIEUDONGHO', 'SOCHUNGMINH'],
          placeholder: 'Tìm đồng hồ khách hàng'
        } as __esri.FeatureLayerSource,
        {
          featureLayer: this.map.findLayerById('TruHong'),
          displayField: 'MATRU',
          searchFields: ['MATRU', 'TEN', 'NGUOICAPNHAT'],
          placeholder: 'Tìm trụ họng'
        } as __esri.FeatureLayerSource,
        {
          featureLayer: this.map.findLayerById('Van'),
          displayField: 'MA_VAN',
          searchFields: ['MA_VAN', 'TEN', 'VI_TRI_LAP', 'DON_VI_LAP', 'NGUOICAPNHAT'],
          placeholder: 'Tìm van'
        } as __esri.FeatureLayerSource,
        {
          featureLayer: this.map.findLayerById('DuongOng'),
          displayField: 'MADUONGONG',
          searchFields: ['MADUONGONG', 'TEN', 'NGUOICAPNHAT'],
          placeholder: 'Tìm đường ống'
        } as __esri.FeatureLayerSource,
      ]
    });

    this.view.ui.add(search, 'top-right');
  }

  private initFL() {
    var basemap = new MapImageLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/Basemap/MapServer',
      title: 'Bản đồ nền',
      id: 'basemap',
      opacity: 0.8
    });

    var dhkhLayer = new FeatureLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/ChuyenDe/FeatureServer/0',
      title: 'Đồng hồ khách hàng',
      outFields: ['*'],
      id: 'DHKH'
    });
    var truHongLayer = new FeatureLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/ChuyenDe/FeatureServer/1',
      title: 'Trụ họng',
      outFields: ['*'],
      id: 'TruHong'
    });
    var vanLayer = new FeatureLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/ChuyenDe/FeatureServer/2',
      title: 'Van',
      outFields: ['*'],
      id: 'Van'
    });
    var duongOngLayer = new FeatureLayer({
      url: 'https://bpwis.vbgis.vn:6443/arcgis/rest/services/CapNuocBinhPhuoc/ChuyenDe/FeatureServer/3',
      title: 'Đường ống',
      outFields: ['*'],
      id: 'DuongOng'
    });

    this.map.addMany([basemap, dhkhLayer, truHongLayer, vanLayer, duongOngLayer]);

  }

  render() {
    return (
      <div className={classes.container}
        ref={
          (element: HTMLDivElement) => this.mapDiv = element
        }
      >
      </div>
    );
  }
}

export default LoginComponent;