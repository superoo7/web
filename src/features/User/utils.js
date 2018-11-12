import { formatter } from 'steem';

export function format(user, appProps) {
  const metadata = user.json_metadata ? JSON.parse(user.json_metadata) : {};
  const steemPower = appProps ? formatter.vestToSteem(
    user.vesting_shares,
    appProps.total_vesting_shares,
    appProps.total_vesting_fund_steem
  ) : 0;
  const steemPowerReceived = appProps ? formatter.vestToSteem(
    user.received_vesting_shares - user.delegated_vesting_shares,
    appProps.total_vesting_shares,
    appProps.total_vesting_fund_steem
  ) : 0;
  return {
    ...user,
    json_metadata: metadata,
    reputation: formatter.reputation(user.reputation),
    steemPower: steemPower,
    steemPowerReceived:steemPowerReceived
  };
}

export function isModerator(username) {
  const moderators = [
    'tabris', 'project7', 'astrocket',
    'teamhumble', 'urbangladiator', 'dayleeo', 'fknmayhem', 'jayplayco', 'bitrocker2020', 'joannewong',
    'geekgirl', 'playitforward', 'monajam', 'pialejoana'
  ];
  return moderators.indexOf(username) !== -1;
}

export function isInfluencer(username) {
  const influencer = [
    'elleok', 'chuuuckie', 'mobi72', 'fruitdaddy', 'karamyog', 'elsiekjay', 'calprut',
    'ninuola', 'sonrhey', 'dayjee', 'camzy', 'abasifreke', 'gentleshaid', 'aamirijaz', 'tio',
    'azwarrangkuti', 'ikrahch', 'rodus', 'sanach', 'alikoc07'
  ];
  return influencer.indexOf(username) !== -1;
}

export function isGuardian(username) {
  const guardians = [
    'jayplayco'
  ];
  return guardians.indexOf(username) !== -1;
}

export function isAdmin(username) {
  const admins = [
    'tabris', 'project7',
  ];
  return admins.indexOf(username) !== -1;
}

export const LEVEL_TIER = [
  1.0, 2.0, 3.0, 5.0, 8.0
];
