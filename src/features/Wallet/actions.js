import combine from 'utils/combine';
import getTransactions, {
  getTransactionsReducer
} from './actions/getTransactions';
import setEthAddress, { setEthAddressReducer } from './actions/setEthAddress';
import withdraw, { withdrawReducer } from './actions/withdraw';
import getHuntPrice, { getHuntPriceReducer } from './actions/getHuntPrice';

export const initialState = {
  balances: {},
  totalClaimed: 0.0,
  ethAddress: null,
  transactions: [],
  withdrawals: [],
  isLoading: false,
  isUpdating: false,
  isPriceLoading: false,
  price: 0.0
};

export const reducer = (state = initialState, action) =>
  combine(
    [
      getTransactionsReducer,
      setEthAddressReducer,
      withdrawReducer,
      getHuntPriceReducer
    ],
    state,
    action
  );

// All sagas to be loaded
export default [getTransactions, setEthAddress, withdraw, getHuntPrice];
