import PopupTemplate = require('esri/PopupTemplate');
import Action = require('esri/support/Action');
import PopupEditing from './Popup/Editing';
import HighlightGraphic from '../support/HighlightGraphic';

export enum PopupAction {
  EDIT,
  DELETE
}

export interface LayerFieldInfo {
  name: string;
  format?: object;
  isEditable?: boolean;
  alias?: string;
  domain?: __esri.Domain;
  type?: 'small-integer' | 'integer' | 'single'
  | 'double' | 'long' | 'string' | 'date' | 'oid' | 'geometry' | 'blob' | 'raster' | 'guid' | 'global-id' | 'xml';
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
  private editing: PopupEditing;
  private highlight: HighlightGraphic;
  constructor(params: ConstructorProperties) {
    this.view = params.view;
    this.layerInfos = params.layerInfos;

    this.layerInfos.forEach(f => {
      this.initPopup(f);
    });
    this.editing = new PopupEditing({ view: this.view });
    this.highlight = new HighlightGraphic(this.view);
    this.registerEvent();
  }

  /**
   * Khởi tạo poup cho layer
   * @param layerInfo Định nghĩa những lớp hiển thị popup
   */
  private initPopup(layerInfo: LayerInfo) {
    layerInfo.showObjectID = layerInfo.showObjectID || false;
    layerInfo.showGlobalID = layerInfo.showGlobalID || false;
    layerInfo.showAttachments = layerInfo.showAttachments || false;
    layerInfo.isEditable = layerInfo.isEditable || false;
    const { layer, isEditable, showDeleteButton, showAttachments, showGlobalID, showObjectID } = layerInfo;
    layer.when((layerView: __esri.LayerView) => {

      let actions = [];
      // nếu được phép chỉnh sửa
      if (isEditable) {
        actions.push(new Action({
          id: PopupAction.EDIT + '',
          title: 'Cập nhật',
          className: 'esri-icon-edit',
        }));
      }
      // nếu hiện nút xóa
      if (showDeleteButton) {
        actions.push(new Action({
          id: PopupAction.DELETE + '',
          title: 'Xóa',
          className: 'esri-icon-erase',
        }));
      }
      let layerFields: LayerFieldInfo[];
      if (layerInfo.layerFields) {
        layerFields = layerInfo.layerFields.slice();
        layerFields.forEach(layerField => {
          let field = layer.fields.find(_field => _field.name === layerField.name);
          if (field) {
            if (!layerField.alias) {
              layerField.alias = field.alias;
            }
            layerField.domain = field.domain;
            layerField.type = field.type as any;
          }
        });
      } else {
        // nếu không có thì tự tạo
        // lấy tất cả field từ layer
        layerFields = layer.fields.map(m => {
          return {
            name: m.name,
            isEditable: isEditable, // mặc định không cho chỉnh sửa,
            domain: m.domain,
            alias: m.alias,
            type: m.type
          } as LayerFieldInfo;
        });

        layerInfo.layerFields = layerFields;
      }
      // lấy fields để nhận name và alias
      let fields = layerFields
        .map(m => {
          let field = layer.fields.find(f => (
            (f.name === m.name)
            && ((showObjectID && f.type !== 'oid')
              || (!showObjectID)
            )
            && ((showGlobalID && f.type !== 'global-id')
              || (!showGlobalID)
            )
          ));
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
      }];

      if (showAttachments) {
        content.push({
          type: 'attachments'
        } as any);
      }
      var popupTemplate = new PopupTemplate({
        title: layer.title,
        content,
        actions
      });
      layer.popupTemplate = popupTemplate;
    });
  }

  /**
   * Đăng ký sự kiện
   */
  private registerEvent() {
    // đăng ký sự kiện khi click vào action
    this.view.popup.on('trigger-action', this.triggerActionHandler.bind(this));

    this.view.popup.watch('visible', (newValue: boolean) => {
      if (!newValue) {
        this.highlight.clear();
      }
    });
    this.view.popup.watch('selectedFeature', (newValue: __esri.Graphic, oldValue: __esri.Graphic) => {
      this.highlight.clear();
      if (newValue && newValue !== oldValue) {
        this.highlight.add(
          this.view.popup.selectedFeature
        );
      }
    });
  }

  private triggerActionHandler(event: {
    action: Action
  }) {
    let actionId = event.action.id;
    switch (actionId) {

      // sự kiện cập nhật
      case PopupAction.EDIT.toString():
        let layerInfos = this.layerInfos.find(f => f.layer.id === this.view.popup.selectedFeature.layer.id);
        if (layerInfos) {
          this.editing.render(layerInfos.layerFields);
        }
        break;
      // sự kiện xóa
      case PopupAction.DELETE.toString():
        this.editing.delete();
        break;
      default:
        break;
    }
  }
}

export default Popup;