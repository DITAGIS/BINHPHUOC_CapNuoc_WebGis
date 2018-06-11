import Point = require('esri/geometry/Point');
import Graphic = require('esri/Graphic');
import GraphicsLayer = require('esri/layers/GraphicsLayer');
import SimpleMarkerSymbol = require('esri/symbols/SimpleMarkerSymbol');
import SimpleLineSymbol = require('esri/symbols/SimpleLineSymbol');
import Collection = require('esri/core/Collection');
import Polyline = require('esri/geometry/Polyline');
import QueryTask = require('esri/tasks/QueryTask');
const URL = 'http://sawagis.vn/arcgis/rest/services/TanHoa/TANHOAGIS/MapServer/0';
const COLOR = {
  main: '#26C6DA',
  specifed: '#FF5722',
  radom: ['#1abc9c', '#2ecc71', '#3498db',
    '#9b59b6', '#16a085', '#27ae60', '#2980b9', '#8e44ad',
    '#f1c40f', '#e67e22', '#e74c3c', '#f39c12', '#d35400', '#c0392b']
}

interface Props {
  view: __esri.MapView
}
interface GroupValue {
  NhanVien: string,
  geometrys: { longitude: number, latitude: number }[]
}
interface GiamSatHanhTrinhModel {
  ID: string,
  Latitude: number
  Longtitude: number
  NhanVien: string
  ThoiGian: Date
  DanhBa: string
}
export default class EmpTracking {
  private lineGraphics: Collection<__esri.Graphic>;
  private props: Props;
  private graphicsLayer: GraphicsLayer;
  private pointGraphics: Collection<__esri.Graphic>;
  private dhnGraphics: Collection<__esri.Graphic>;
  private dhnTask: QueryTask;
  private dsNhanVien: string[];//danh sách nhân viên
  constructor(props: Props) {
    this.props = props;
    this.lineGraphics = new Collection();
    this.pointGraphics = new Collection();
    this.dhnGraphics = new Collection();
    this.dhnTask = new QueryTask({ url: URL });
    this.graphicsLayer = new GraphicsLayer({ listMode: 'hide'});
    this.props.view.map.add(this.graphicsLayer);
    this.dsNhanVien = [];
  }
  // private convertData(attr: any): GiamSatHanhTrinhModel {
  //   return {
  //     ID: attr.ID, Latitude: attr.Latitude, Longtitude: attr.Longtitude, NhanVien: attr.NhanVien, ThoiGian: new Date(attr.ThoiGian),
  //     DanhBa: attr.DanhBa
  //   }
  // }
  public addToLayers(rows: GiamSatHanhTrinhModel[]) {
    //xóa dữ liệu
    this.graphicsLayer.removeAll();
    this.pointGraphics.removeAll();
    this.lineGraphics.removeAll();

    rows.forEach(attr => {
      let graphic = this.createPointGraphic(attr);
      this.pointGraphics.add(graphic);
    })

    // let beforeRowSort = new Collection<GiamSatHanhTrinhModel>(rows.map(m => this.convertData(m)));
    // beforeRowSort.sort((a, b) => {
    //   if (a.ThoiGian.getTime() > b.ThoiGian.getTime())
    //     return 1;
    //   if (a.ThoiGian.getTime() < b.ThoiGian.getTime())
    //     return -1;
    //   return 0;
    // })
    // let groupValues = this.groupByEmp(beforeRowSort.toArray());
    // groupValues.forEach(f => {
    //   let graphic = this.createLineGraphic(f);
    //   this.lineGraphics.add(graphic);
    // })
  }
  private createPointGraphic(attributes: GiamSatHanhTrinhModel): Graphic {
    let geometry = new Point({
      latitude: attributes.Latitude,
      longitude: attributes.Longtitude
    });
    let symbol = new SimpleMarkerSymbol({
      color: COLOR.main,
      size: 8,
      outline: { color: "white" }
    });
    let graphic = new Graphic({
      attributes,
      geometry,
      symbol,
      popupTemplate: {
        title: 'Nhân viên: ' + attributes.NhanVien,
        content: 'Thời gian cập nhật: {ThoiGian.toString()}'
      }
    });
    return graphic;
  }
  private async createDHNGraphics(attributes: { NhanVien: string, DanhBa: string }[]): Promise<(Graphic[] | any)> {
    if (!attributes || (attributes && attributes.length === 0)) return null;//nếu dữ liệu đầu vào không đúng

    let results = await this.dhnTask.execute({
      returnGeometry: true, outSpatialReference: this.props.view.spatialReference,
      outFields: [],
      where: 'DBDONGHONUOC in (' + attributes.map(m => `'${m.DanhBa}'`).join(', ') + ')'
    });

    //nếu có kết quả
    if (results.features.length > 0) {
      let symbol = new SimpleMarkerSymbol({
        outline: { color: COLOR.main, width: 1 }
      });

      let graphics: Graphic[] = [];

      for (let i = 0; i < attributes.length; i++) {
        const element = attributes[i],
          feature = results.features[i];
        if (feature)
          graphics.push(new Graphic({
            attributes: element,
            geometry: feature.geometry,
            symbol
          }))
      }

      return graphics;
    }
    else return null;
  }
  // private groupByEmp(rows: GiamSatHanhTrinhModel[]): GroupValue[] {

  //   let results: GroupValue[] = [];
  //   for (const row of rows) {
  //     //nếu tìm thấy nhân viên
  //     let item = results.find(f => f.NhanVien == row.NhanVien),
  //       geometry = { latitude: row.Latitude, longitude: row.Longtitude };

  //     if (item) {
  //       item.geometrys.push(geometry)
  //     }
  //     //nếu không tìm thấy nhân viên
  //     else {
  //       //tạo mới trong dữ liệu
  //       results.push({
  //         NhanVien: row.NhanVien,
  //         geometrys: [geometry]
  //       })
  //     }
  //   }
  //   return results;
  // }
  // private createLineGraphic(groupValue: GroupValue): Graphic {
  //   let symbol = new SimpleLineSymbol({
  //     color: COLOR.main,
  //     width: 2
  //   });
  //   let geometry = new Polyline();
  //   geometry.addPath(groupValue.geometrys.map(m => [m.longitude, m.latitude]));
  //   let graphic = new Graphic({
  //     symbol, attributes: groupValue, geometry
  //   })
  //   return graphic;
  // }
  private createLineGraphic(option: { viTriNhanVien: Point, viTriDongHo: Point, attributes: any }): Graphic {
    let symbol = new SimpleLineSymbol({
      color: COLOR.radom[Math.floor(Math.random() * COLOR.radom.length)],
      width: 2
    });
    let geometry = new Polyline();
    geometry.addPath([[option.viTriNhanVien.longitude, option.viTriNhanVien.latitude],
    [option.viTriDongHo.longitude, option.viTriDongHo.latitude]
    ]);
    let graphic = new Graphic({
      symbol, attributes: option.attributes, geometry
    })
    return graphic;
  }
  public async filter(items: string[]) {
    //so sánh dan sách nhân viên với danh sách nhân viên truyền vào
    //nếu như đã tồn tại thì không cần truy vấn
    //nếu như chưa có thì phải truy vấn dữ liệu GIS
    if (this.pointGraphics
      && this.pointGraphics.length > 0) {
      for (const item of items) {
        if (!this.dsNhanVien.some(s => s == item)) {
          var dsLoc = this.pointGraphics
            .filter(f => f.attributes.NhanVien == item)//lọc những đối tượng có nhân viên là item
            .map(m => { return { DanhBa: m.attributes.DanhBa, NhanVien: m.attributes.NhanVien } })//map đối tượng cần thiết
            .toArray();//chuyển thành mảng
          if (dsLoc.length > 0)
            await this.createDHNGraphics(dsLoc as any)
              .then((graphics: Graphic[]) => {
                graphics && this.dhnGraphics.addMany(graphics);

                //duyệt mảng
                graphics.forEach(f => {
                  let viTriNhanVien = this.pointGraphics.find(pG => pG.attributes.DanhBa == f.attributes.DanhBa),
                    viTriDongHo = f.geometry as Point,
                    attributes = dsLoc.find(l => l.DanhBa == f.attributes.DanhBa);
                  let graphic = this.createLineGraphic({
                    viTriDongHo,
                    viTriNhanVien: viTriNhanVien.geometry as Point,
                    attributes
                  });
                  this.lineGraphics.add(graphic);
                })

              })
          this.dsNhanVien.push(item);
        }
      }
    }

    this.graphicsLayer.removeAll();

    let lstGraphic = this.pointGraphics.filter(f => items.indexOf((f.attributes as GiamSatHanhTrinhModel).NhanVien) != -1)
    this.graphicsLayer.addMany(lstGraphic.toArray());

    let lstLineGraphic = this.lineGraphics.filter(f => items.indexOf((f.attributes as GroupValue).NhanVien) != -1)
    this.graphicsLayer.addMany(lstLineGraphic.toArray());

    let lstDHNGraphic = this.dhnGraphics.filter(f => items.indexOf((f.attributes as GiamSatHanhTrinhModel).NhanVien) != -1)
    this.graphicsLayer.addMany(lstDHNGraphic.toArray());

    //chuyển view
    this.props.view.goTo(lstGraphic);
    return null;
  }
}