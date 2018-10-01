import React, { Component } from 'react';
import { Icon, Progress } from 'antd';
import steemDapps from 'assets/images/img-steem-apps@3x.png';
import signUpLeft from 'assets/images/img-stc-1@3x.png';
import signUpRight from 'assets/images/img-stc-2@3x.png';
import steemWallet from 'assets/images/img-st-wallet@3x.png';
import { formatNumber, formatFloat } from "utils/helpers/steemitHelpers";
import api from 'utils/api';

export default class SignUpGuide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="contents-page">
        <div className="page-block">
          <h1>One Account to Use All Steem-dApps</h1>
          <div className="thin">
            Steemhunt is a Steem dApp on top of Steem blockchain.
            There are over 400 Steem-based apps are running, and you will be able to use most of them once you signed-up via Steemhunt.
            Please read carefully how to manage your Steem account below.
            <a href="https://steem.io/" className="action less-margin" target="_blank" rel="noopener noreferrer">
              Check out Steem blockchain <Icon type="right-circle-o" />
            </a>
          </div>
          <img src={steemDapps} alt="Steem Dapps" className="image hunt-platform" />
        </div>
        <div className="page-block">
          <h2>How to Login Steem dApps?</h2>
          <div className="thin">
            After you signed up via Steemhunt, you will receive the private keys of your Steem account.
            Whenever you login Steem apps including Steemhunt, they will ask you to login via Steemconnect, a secure way to login without giving up your private keys.
          </div>
          <div className="sign-up-samples">
            <div class="sign-up-samples-left">
              <span className="primary-round">You will sign-in<br/>with your Steem<br/>account when the<br/>first-time login.</span>
              <img src={signUpLeft} alt="SignUp Mobile"/>
            </div>
            <div class="sign-up-samples-right">
              <img src={signUpRight} alt="SignUp Mobile" />
              <span className="primary-round">You can just click<br/>your account<br/>whenever you<br/>login next time. </span>
            </div>
          </div>
        </div>
        <div className="page-block">
          <h2>About STEEM Wallet</h2>
          <div className="thin">
            In Steemhunt product hunters are rewarded with STEEM cryptocyrrency for their dedicated activities such as creating/upvoting/commenting hunting posts.
            You can manage your STEEM tokens in your Steemit wallet.
            To see your balances, please login via Steemit.com and click the wallet tab on your profile section.
            <a href="https://steemit.com/" className="action less-margin" target="_blank" rel="noopener noreferrer">
              Check out Steemit.com <Icon type="right-circle-o" />
            </a>
          </div>
          <img src={steemWallet} alt="Steem wallet" className="image hunt-platform" />
        </div>
      </div>
    );
  }
}
