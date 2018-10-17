import React, { Component } from 'react';
import { Icon } from 'antd';
import steemDapps from 'assets/images/sign-up/img-steem-apps@2x.png';
import signUpLeft from 'assets/images/sign-up/img-stc-1@2x.png';
import signUpRight from 'assets/images/sign-up/img-stc-2@2x.png';
import steemWallet from 'assets/images/sign-up/img-st-wallet@2x.png';

export default class SignUpGuide extends Component {

  render() {
    return (
      <div className="contents-page">
        <div className="page-block">
          <h1>One Account to Use All Steem-dApps</h1>
          <div className="thin">
            Steemhunt is a Steem dApp on top of Steem blockchain.
            There are over 400 Steem-based apps running, and you will be able to use most of them once you have signed-up via Steemhunt.
            Please check out the details below to see how you can manage your Steem account.
            <a href="https://steem.io/" className="action less-margin" target="_blank" rel="noopener noreferrer">
              Check out Steem blockchain <Icon type="right-circle-o" />
            </a>
          </div>
          <img src={steemDapps} alt="Steem Dapps" className="image hunt-platform" />
        </div>
        <div className="page-block">
          <h2>How to Login to Steem dApps?</h2>
          <div className="thin">
            After you’ve signed up via Steemhunt, you will receive the private key for your Steem account.
            Whenever you login to any Steem apps (including Steemhunt), you will be asked to login via Steemconnect, a secure way to login without giving up your private key.
          </div>
          <div className="sign-up-samples">
            <div className="sign-up-samples-left">
              <span className="primary-round">When you login<br/>for the first time<br/>you will sign-in with<br/>your Steem account.</span>
              <img src={signUpLeft} alt="SignUp Mobile"/>
            </div>
            <div className="sign-up-samples-right">
              <img src={signUpRight} alt="SignUp Mobile" />
              <span className="primary-round">Every other time<br/>you login you can<br/>just simply click on<br/>your account tab.</span>
            </div>
          </div>
        </div>
        <div className="page-block">
          <h2>About STEEM Wallet</h2>
          <div className="thin">
            In Steemhunt, product hunters are rewarded with STEEM cryptocurrency for their dedicated activities, such as creating, upvoting and commenting on hunting posts.
            You can manage your STEEM tokens in your Steemit wallet.
            To see your balance, please login via Steemit.com and click the wallet tab on your profile section.
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
