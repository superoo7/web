/* eslint-disable camelcase,no-param-reassign,consistent-return,no-console,new-cap */
import { call } from 'redux-saga/effects';
import base58 from 'bs58';
import steem from 'steem';
import getSlug from 'speakingurl';
import numeral from 'numeral';
import secureRandom from 'secure-random';

/**
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/utils/ParsersAndFormatters.js
 */
export function parsePayoutAmount(amount) {
  return parseFloat(String(amount).replace(/\s[A-Z]*$/, ''));
}

/**
 * Calculates Payout Details Modified as needed
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/components/elements/Voting.jsx
 */
export const calculatePayout = (post) => {
  const payoutDetails = {};
  const {
    active_votes,
    parent_author,
    cashout_time,
  } = post;

  const max_payout = parsePayoutAmount(post.max_accepted_payout);
  const pending_payout = parsePayoutAmount(post.pending_payout_value);
  const promoted = parsePayoutAmount(post.promoted);
  const total_author_payout = parsePayoutAmount(post.total_payout_value);
  const total_curator_payout = parsePayoutAmount(post.curator_payout_value);
  const is_comment = parent_author !== '';

  let payout = pending_payout + total_author_payout + total_curator_payout;
  if (payout < 0.0) payout = 0.0;
  if (payout > max_payout) payout = max_payout;
  payoutDetails.payoutLimitHit = payout >= max_payout;

  // There is an "active cashout" if: (a) there is a pending payout, OR (b)
  // there is a valid cashout_time AND it's NOT a comment with 0 votes.
  const cashout_active = pending_payout > 0 || (cashout_time.indexOf('1969') !== 0 && !(is_comment && active_votes.length === 0));

  if (cashout_active) {
    payoutDetails.potentialPayout = pending_payout;
  }

  if (promoted > 0) {
    payoutDetails.promotionCost = promoted;
  }

  if (cashout_active) {
    payoutDetails.cashoutInTime = cashout_time;
  }

  if (max_payout === 0) {
    payoutDetails.isPayoutDeclined = true;
  } else if (max_payout < 1000000) {
    payoutDetails.maxAcceptedPayout = max_payout;
  }

  if (total_author_payout > 0) {
    payoutDetails.pastPayouts = total_author_payout + total_curator_payout;
    payoutDetails.authorPayouts = total_author_payout;
    payoutDetails.curatorPayouts = total_curator_payout;
  }

  return payoutDetails;
};

export const calculateContentPayout = content => {
  const pendingPayoutValue = parseFloat(content.pending_payout_value);
  const totalPayoutValue = parseFloat(content.total_payout_value);
  const curatorPayoutValue = parseFloat(content.curator_payout_value);
  return totalPayoutValue + pendingPayoutValue + curatorPayoutValue;
};

export const hasVoted = (content, name) => {
  if (!content || !name) {
    return false;
  }

  return (
    (content.valid_votes && !!content.valid_votes.find(vote => vote && vote.voter === name && vote.percent > 0)) ||
    (content.active_votes && !!content.active_votes.find(vote => vote && vote.voter === name && vote.percent > 0))
  );
}

// Floor the decimal points instead of rounding
function getProperAmount(amount) {
  const num = numeral(amount);
  if (num.value() > -1e-6 && num.value() < 1e-6) { // numeral(1e-7).format('0,0.00000') => NaN issue
    return numeral(0);
  }

  return num;
}
export const formatAmount = amount => getProperAmount(amount).format('$0,0.00');
export const formatNumber = (amount, format = '0,0.00') => getProperAmount(amount).format(format, Math.floor);
export const formatFloat = (float) => Math.round(float * 100) / 100;

export const createCommentPermlink = (parentAuthor, parentPermlink) => {
  let permlink;

  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  const newParentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parentAuthor}-${newParentPermlink}-${timeStr}`;

  if (permlink.length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
};

/**
 * Generate permlink
 * https://github.com/steemit/condenser/blob/master/src/app/redux/TransactionSaga.js
 */

function slug(text) {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 });
}

export function* createPermlink(title, author, parent_author, parent_permlink) {
    let permlink;
    if (title && title.trim() !== '') {
        let s = slug(title);
        if (s === '') {
            s = base58.encode(secureRandom.randomBuffer(4));
        }
        // ensure the permlink(slug) is unique
        const slugState = yield call([steem.api, steem.api.getContentAsync], author, s);
        let prefix;
        if (slugState.body !== '') {
            // make sure slug is unique
            prefix = base58.encode(secureRandom.randomBuffer(4)) + '-';
        } else {
            prefix = '';
        }
        permlink = prefix + s;
    } else {
        // comments: re-parentauthor-parentpermlink-time
        const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
        parent_permlink = parent_permlink.replace(/(-\d{8}t\d{9}z)/g, '');
        permlink = `re-${parent_author}-${parent_permlink}-${timeStr}`;
    }
    if (permlink.length > 255) {
        // STEEMIT_MAX_PERMLINK_LENGTH
        permlink = permlink.substring(permlink.length - 255, permlink.length);
    }
    // only letters numbers and dashes shall survive
    permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
    return permlink;
}


// How much STEEM this account has delegated out (minus received).
// Ref: https://github.com/steemit/condenser/blob/ae1e9534262a19ec163982c71d74e3bd74c9a9d3/src/app/utils/StateFunctions.js
export function delegatedSteem(account, gprops) {
    const delegated_vests = parseFloat(account.delegated_vesting_shares.split( ' ' )[0]);
    const received_vests = parseFloat(account.received_vesting_shares.split( ' ' )[0]);
    const vests = delegated_vests - received_vests;
    const total_vests = parseFloat(gprops.total_vesting_shares.split( ' ' )[0]);
    const total_vest_steem = parseFloat(gprops.total_vesting_fund_steem.split( ' ' )[0]);
    const vesting_steemf = total_vest_steem * (vests / total_vests);
    return vesting_steemf;
}

export function calculateVotingValue(voteWeight, myAccount, appProps, rewardFund, rate) {
    if (!appProps || !rewardFund || !myAccount || !voteWeight) {
      return 0;
    }

    const { steemPower, voting_power } = myAccount;
    const { total_vesting_fund_steem, total_vesting_shares } = appProps;
    const { reward_balance, recent_claims } = rewardFund;

    const totalVestingFundSteem = parseFloat(total_vesting_fund_steem);
    const totalVestingShares = parseFloat(total_vesting_shares);
    const a = totalVestingFundSteem / totalVestingShares;

    const rewardBalance = parseFloat(reward_balance);
    const recentClaims = parseFloat(recent_claims);
    const r = (steemPower - delegatedSteem(myAccount, appProps)) / a;
    let p = voting_power * voteWeight * 100 / 10000;
    p = (p + 49) / 50;
    const result = r * p * 100 * (rewardBalance / recentClaims * parseFloat(rate));

    return result;
}
