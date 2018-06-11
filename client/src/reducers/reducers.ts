import { combineReducers } from 'redux';
import { Action } from '../actions/action';
import actionTypes from '../constants/action-types';
export type Map = {
  view: __esri.MapView,
};

export type Main = {
  loading: boolean
};

export type All = {
  map: Map,
  main: Main
};

const mapState: Map = {
  view: null as any
};

function map(state: Map = mapState, action: Action): Map {
  switch (action.type) {
    case actionTypes.TAI_XONG_MAP_VIEW:
      return { ...state, view: action.view };
    default:
      return state;
  }
}

const mainState: Main = {
  loading: false
};

function main(state: Main = mainState, action: Action): Main {
  switch (action.type) {
    case actionTypes.LOADING_READY:
      return { ...state, loading: true };
    case actionTypes.LOADING_FINISH:
      return { ...state, loading: false };
    default:
      return state;
  }
}

export const initialState: All = {
  map: mapState, main: mainState
};
const reducers = combineReducers<All>({
  map,
  main
});
export default reducers;
