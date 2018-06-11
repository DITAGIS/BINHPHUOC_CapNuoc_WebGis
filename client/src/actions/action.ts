import actionTypes from '../constants/action-types';

export type MapAction = {
  type: actionTypes.TAI_XONG_MAP_VIEW, view: __esri.MapView
};

export type MainAction = {
  type: actionTypes.LOADING_FINISH
} |
  { type: actionTypes.LOADING_READY };

export type Action = MapAction | MainAction;
