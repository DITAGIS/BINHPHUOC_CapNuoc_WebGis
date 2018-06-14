import PopupTemplate = require('esri/PopupTemplate');

export interface LayerFieldInfo {
  name: string;
  format?: object;
  isEditable?: boolean;
}

export interface LayerInfo {
  layerFields: LayerFieldInfo[];
  isEditable?: boolean;
  layer: __esri.FeatureLayer;
  showAttachments?: boolean;
  showDeleteButton?: boolean;
  showObjectID?: boolean;
  showGlobalID?: boolean;
}

interface ConstructorProperties {
  layerInfos: LayerInfo[];
  view: __esri.MapView;
}

class Popup {
  private view: __esri.MapView;
  private layerInfos: LayerInfo[];
  constructor(params: ConstructorProperties) {
    this.view = params.view;
    this.layerInfos = params.layerInfos;

    this.layerInfos.forEach(f => {
      this.initPopup(f);
    });
  }

  private initPopup(layerInfo: LayerInfo) {
    const { layer, isEditable, showAttachments, showDeleteButton, showGlobalID, showObjectID } = layerInfo;

    layer.when(_ => {
      // nếu được phép chỉnh sửa
      var popupTemplate = new PopupTemplate();
      popupTemplate.title = layer.title;

      if (isEditable) {
        // hihi
      } else {
        let layerFields: LayerFieldInfo[];
        if (layerInfo.layerFields) {
          layerFields = layerInfo.layerFields;
        } else {
          // nếu không có thì tự tạo
          // lấy tất cả field từ layer
          layerFields = layer.fields.map(m => {
            return {
              name: m.name,
              isEditable: false// mặc định không cho chỉnh sửa
            } as LayerFieldInfo;
          });
        }
        // lấy fields để nhận name và alias
        let fields = layerFields
          .map(m => {
            let field = layer.fields.find(f => f.name === m.name);
            if (field) {
              return field;
            } else {
              return null;
            }
          })
          .filter(f => f !== null);

        let content = [{
          type: 'fields',
          fieldInfos: fields.map((m: __esri.Field) => {
            return {
              fieldName: m.name,
              label: m.alias,
            };
          })
        }
        ];
        popupTemplate.content = content;
      }

      layer.popupTemplate = popupTemplate;
    });
  }
}

export default Popup;