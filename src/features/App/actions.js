import combine from 'utils/combine';
/*
 * EXPORTING REDUCERS and SAGAS
 */
import getAppConfig, { getAppConfigReducer } from './actions/getAppConfig';

export const initialState = {
  // currentCategory: 'created',
  // currentTag: 'steemhunt',
};

export const reducer = (state = initialState, action) =>
  combine([getAppConfigReducer], state, action);

// All sagas to be loaded
export default [getAppConfig];
