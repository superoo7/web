import { createSelector } from 'reselect';

const selectWalletDomain = () => state => state.wallet;

export const selectBalances = () => createSelector(
  selectWalletDomain(),
  state => state.balances,
);

export const selectEthAddress = () => createSelector(
  selectWalletDomain(),
  state => state.ethAddress,
);

export const selectTransactions = () => createSelector(
  selectWalletDomain(),
  state => state.transactions,
);

export const selectWithdrawals = () => createSelector(
  selectWalletDomain(),
  state => state.withdrawals,
);

export const selectIsLoading = () => createSelector(
  selectWalletDomain(),
  state => state.isLoading,
);

export const selectIsUpdating = () => createSelector(
  selectWalletDomain(),
  state => state.isUpdating,
);

