import { createSelector } from 'reselect';

const selectUserDomain = () => state => state.user;

export const selectIsLoading = () => createSelector(
  selectUserDomain(),
  state => state.isLoading,
);

export const selectMe = () => createSelector(
  selectUserDomain(),
  state => state.me,
);

export const selectProfileDraft = () => createSelector(
  selectUserDomain(),
  state => state.profileDraft,
);

// ACCOUNTS
export const selectAccounts = () => createSelector(
  selectUserDomain(),
  state => state.accounts || {},
);

export const selectAccount = accountName => createSelector(
  selectAccounts(),
  accounts => { return accounts[accountName] || {}; },
);

export const selectCurrentUser = () => createSelector(
  selectUserDomain(),
  state => state.currentUser,
);

export const selectCurrentAccount = () => createSelector(
  [selectCurrentUser(), selectAccounts()],
  (currentUser, accounts) => accounts[currentUser] || {},
);

export const selectMyAccount = () => createSelector(
  [selectMe(), selectAccounts()],
  (me, accounts) => accounts[me] || {},
);

export const selectMyFollowingsList = () => createSelector(
  [selectMe(), selectFollowings()],
  (me, state) => (state[me] && state[me].list) || [],
);

export const selectMyFollowingsLoadStatus = () => createSelector(
  [selectMe(), selectFollowings()],
  (me, state) => (state[me] && state[me].loadStatus) || {},
);

// FOLLOWERS
const selectFollowers = () => createSelector(
  selectUserDomain(),
  state => state.followers,
);

const selectFollowersFromUser = accountName => createSelector(
  selectFollowers(),
  state => state[accountName] || {},
);

export const selectFollowersCount = accountName => createSelector(
  selectFollowersFromUser(accountName),
  state => state.count,
);

// FOLLOWING
const selectFollowings = () => createSelector(
  selectUserDomain(),
  state => state.followings,
);

const selectFollowingsFromUser = accountName => createSelector(
  selectFollowings(),
  state => state[accountName] || {},
);

export const selectFollowingsCount = accountName => createSelector(
  selectFollowingsFromUser(accountName),
  state => state.count,
);
