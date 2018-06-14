interface ConstructProperties {
  view: __esri.MapView;
}

class PopupEditing {
  private view: __esri.MapView;
  constructor(params: ConstructProperties) {
    this.view = params.view;
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