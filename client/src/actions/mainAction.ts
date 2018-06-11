import { MainAction } from './action';
import actionTypes from '../constants/action-types';

export const loadingReady = (): MainAction => ({
  type: actionTypes.LOADING_READY,
});
export const loadingFinish = (): MainAction => ({
  type: actionTypes.LOADING_FINISH,
});