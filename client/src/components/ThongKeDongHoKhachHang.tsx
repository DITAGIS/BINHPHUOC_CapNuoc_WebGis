import * as React from 'react';
import EsriMap = require('esri/Map');
import MapView = require('esri/views/MapView');
import MapImageLayer = require('esri/layers/MapImageLayer');
import FeatureLayer = require('esri/layers/FeatureLayer');
import StatisticDefinition = require('esri/tasks/support/StatisticDefinition');
import * as Popup from '../map-lib/widgets/Popup';
import SearchWidget = require('esri/widgets/Search');
import watchUtils = require('esri/core/watchUtils');
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card } from 'material-ui';

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
  chartDatas: ChartData[]
};

const classes = {
  container: 'mapDiv'
};

class ThongKeDongHoKhachHang extends React.Component<Props, States> {
  private mapDiv: HTMLDivElement;
  private map: EsriMap;
  private view: MapView;
  private layer: FeatureLayer;

  constructor(props: Props) {
    super(props);
    this.state = {
      chartDatas: []
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
          if (!val) {
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
            this.queryLayerViewStats(layerView);
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

  render() {
    return (
      <div className={classes.container}>
        <div
          style={{ width: '100%', height: '100%' }}
          ref={
            (element: HTMLDivElement) => this.mapDiv = element
          }>
        </div>
        <Card style={{ position: 'absolute', top: 80, right: 10, height: 550, width: 300 }}>
          <h1 style={{ width: '100%', fontSize: 24, textAlign: 'center' }}>Biểu đồ tình trạng khảo sát</h1>
          <h2 style={{ width: '100%', fontSize: 20, textAlign: 'center' }}>Đồng hồ khách hàng</h2>
          {/* <CardHeader
              style={{ padding: 0 }}
              titleStyle={{ width: '100%', fontSize: 24, textAlign: 'center' }}
              subtitleStyle={{ width: '100%', fontSize: 20, textAlign: 'center' }}
              title=""
              subtitle=""
            /> */}
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
          <PieChart width={280} height={300}>
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
                // label={renderCustomizedLabel}
                label
              >
                {
                  this.state.chartDatas.map((entry, index) =>
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />)
                }
              </Pie>
            }
          </PieChart>
        </Card>
      </div>
    );
  }
}

export default ThongKeDongHoKhachHang;