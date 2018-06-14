import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EditingComponent from './EditingComponent';
import { LayerFieldInfo } from '../Popup';
interface ConstructProperties {
  view: __esri.MapView;
}

class PopupEditing {
  private view: __esri.MapView;
  constructor(params: ConstructProperties) {
    this.view = params.view;
  }

  public render(layerFields: LayerFieldInfo[]) {
    let div = document.createElement('div');
    const { layer, attributes } = this.view.popup.selectedFeature;
    ReactDOM.render(
      <EditingComponent
        layer={layer as __esri.FeatureLayer}
        layerFieldsInfos={layerFields}
        attributes={attributes}
        onSave={this.onSave.bind(this)}
      />,
      div);
    this.view.popup.content = div;
  }

  private async onSave(attributes: object) {
    try {
      const layer = this.view.popup.selectedFeature.layer as __esri.FeatureLayer;

      var updateAttributes = {
        objectId: this.view.popup.selectedFeature.attributes.OBJECTID,
        ...attributes
      };

      let result = await layer.applyEdits({
        updateFeatures: [
          {
            attributes: updateAttributes
          } as __esri.Graphic
        ]
      });

      let updateFeatureResults = result.updateFeatureResults as __esri.FeatureEditResult[];

      if (updateFeatureResults[0].objectId) {
        let query = layer.createQuery();
        query.outFields = ['*'];
        query.where = 'OBJECTID=' + updateAttributes.objectId;
        layer.queryFeatures(query).then(res => {
          this.view.popup.open({
            features: res.features
          });
        });
      }
      return result.updateFeatureResults.length > 0 && !result.updateFeatureResults[0].error;

    } catch (err) {
      return false;
    }

  }

  public async delete() {
    try {
      const objectId = this.view.popup.selectedFeature.attributes.OBJECTID;
      const layer = this.view.popup.selectedFeature.layer as __esri.FeatureLayer;
      let res = await layer.applyEdits({
        deleteFeatures: [{
          objectId
        }]
      });
      return res.deleteFeatureResults.length > 0 && !res.deleteFeatureResults[0].error;
    } catch (error) {
      return false;
    }
  }
}
export default PopupEditing;