import * as React from 'react';
import EsriMap = require('esri/Map');
import MapView = require('esri/views/MapView');
import MapImageLayer = require('esri/layers/MapImageLayer');
import FeatureLayer = require('esri/layers/FeatureLayer');
import LayerList = require('esri/widgets/LayerList');
import Expand = require('esri/widgets/Expand');
import Legend = require('esri/widgets/Legend');

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
      id: 'DuongOngLayer'
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