import { MapAction } from './action';
import actionTypes from '../constants/action-types';

export const taiXongMapView = (view: __esri.MapView): MapAction => ({
  type: actionTypes.TAI_XONG_MAP_VIEW,
  view
})