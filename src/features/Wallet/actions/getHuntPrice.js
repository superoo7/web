import { put, call } from 'redux-saga/effects';
import update from 'immutability-helper';

/*--------- CONSTANTS ---------*/
const GET_HUNT_PRICE_BEGIN = 'GET_HUNT_PRICE_BEGIN';
const GET_HUNT_PRICE_SUCCESS = 'GET_HUNT_PRICE_SUCCESS';
const GET_HUNT_PRICE_FAILURE = 'GET_HUNT_PRICE_FAILURE';

/*--------- ACTIONS ---------*/
export function getHuntPriceBegin() {
  return { type: GET_HUNT_PRICE_BEGIN };
}

function getHuntPriceSuccess(price) {
  return { type: GET_HUNT_PRICE_SUCCESS, payload: { price } };
}

function getHuntPriceFailure() {
  return { type: GET_HUNT_PRICE_FAILURE };
}

/*--------- REDUCER ---------*/
export function getHuntPriceReducer(state, action) {
  switch (action.type) {
    case GET_HUNT_PRICE_BEGIN:
      return update(state, {
        isPriceLoading: { $set: true }
      });
    case GET_HUNT_PRICE_BEGIN:
      const { price } = action.payload;

      return update(state, {
        price: { $set: price },
        isPriceLoading: { $set: false }
      });
    case GET_HUNT_PRICE_FAILURE:
      return update(state, {
        isPriceLoading: { $set: false }
      });
    default: 
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getHuntPrice() {
  try {
    const result = yield call(
      fetch,
      'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=hunt-token'
    ).then(d => {
      if (!d.ok) {
        throw new Error('CoinGecko server down.');
      }
      return d.json();
    });

    yield put(getHuntPriceSuccess((result['hunt-token'] || {})['usd']));
  } catch (e) {
    yield put(getHuntPriceFailure());
  }
}

export default function* getHuntPriceManager() {
  yield takeEvery(GET_HUNT_PRICE_BEGIN, getHuntPrice);
}
