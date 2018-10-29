import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Progress } from 'antd';
import { formatNumber } from 'utils/helpers/steemitHelpers';

function adjustRecharge(lastValue, lastUpdated) {
  const secPassed = (Date.now() - (new Date(lastUpdated * 1000))) / 1000;
  const currentValue = (lastValue + (secPassed / 3600) * (20 / 24)); // 20% recharge in a day
  const result = currentValue > 100 ? 100 : currentValue;

  return Math.round(result * 100) / 100;
}

function currentVP({ max_rc, voting_manabar }) {
  return adjustRecharge(100 * voting_manabar.current_mana / max_rc, voting_manabar.last_update_time);
}

function currentRC({ max_rc, rc_manabar}) {
  return adjustRecharge(100 * rc_manabar.current_mana / max_rc, rc_manabar.last_update_time);
}

const MenuContent = props => {
  if(props.me) {
    return (
      <Menu theme="dark">
        {!props.isFollowing && props.me !== 'steemhunt' &&
          <Menu.Item key="0">
             <span onClick={props.follow}>
              <Icon type={props.isFollowLoading ? 'loading' : 'star-o'} />
              FOLLOW STEEMHUNT
            </span>
          </Menu.Item>
        }

        <Menu.Item key="1">
          <a href="https://token.steemhunt.com" rel="noopener noreferrer" target="_blank">
            <Icon type="api" /> ABOUT HUNT PLATFORM
          </a>
        </Menu.Item>
        <Menu.Item key="1-5" className="mobile-only">
          <Link to="/airdrop" onClick={() => props.changeVisibility(false)}>
            <Icon type="gift" /> ABOUT AIRDROPS
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/hall-of-fame" onClick={() => props.changeVisibility(false)}>
            <Icon type="trophy" /> HALL OF FAME
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to={`/wallet`} onClick={() => props.changeVisibility(false)}>
            <Icon type="wallet" /> WALLET <sup>beta</sup>
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to={`/author/@${props.me}`} onClick={() => props.changeVisibility(false)}>
            <Icon type="user" /> MY PROFILE
          </Link>
        </Menu.Item>
        <Menu.Item key="4-sub" className="sub" disabled>
          <div className="group">
            <div className="label">
              Level: {props.myAccount.level}&nbsp;
              ({formatNumber(props.myAccount.user_score, '0,0.00')}
                {props.myAccount.boost_score && props.myAccount.boost_score > 1 && <span> x {props.myAccount.boost_score}</span> })
            </div>
            <Progress percent={Math.round(100 * props.myAccount.user_score / 8)} status="active" />
          </div>
          <div className="group">
            <div className="label">
              Voting Mana
            </div>
            <Progress percent={Math.round(currentVP(props.myAccount))} status="active" />
          </div>
          <div className="group">
            <div className="label">
              Resource Credits
            </div>
            <Progress percent={Math.round(currentRC(props.myAccount))} status="active" />
          </div>
        </Menu.Item>
        <Menu.Item key="5">
          <a href="https://discord.gg/mWXpgks" rel="noopener noreferrer" target="_blank">
            <Icon type="message" /> CHAT ON DISCORD
          </a>
        </Menu.Item>
        <Menu.Item key="6">
          <span onClick={props.logout}>
            <Icon type="poweroff" /> LOGOUT
          </span>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu theme="dark">
        <Menu.Item key="0" className="two-column-hidden">
          <Link to="/about" onClick={() => props.changeVisibility(false)}>
            <Icon type="question-circle-o" /> ABOUT STEEMHUNT
          </Link>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="https://token.steemhunt.com" rel="noopener noreferrer" target="_blank">
            <Icon type="api" /> ABOUT HUNT PLATFORM
          </a>
        </Menu.Item>
        <Menu.Item key="1-5">
          <Link to="/airdrop" onClick={() => props.changeVisibility(false)}>
            <Icon type="gift" /> ABOUT AIRDROPS
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/hall-of-fame" onClick={() => props.changeVisibility(false)}>
            <Icon type="trophy" /> HALL OF FAME
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <a href="https://discord.gg/mWXpgks" rel="noopener noreferrer" target="_blank">
            <Icon type="message" /> CHAT ON DISCORD
          </a>
        </Menu.Item>
      </Menu>
    );
  }
};

export default MenuContent;

