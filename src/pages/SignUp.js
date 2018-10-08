import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Input, Icon, Button, notification, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import api from 'utils/api';
import { getLoginURL } from 'utils/token';
import userImage from 'assets/images/icon-create-account@3x.png';
import smsImage from 'assets/images/img-phone@3x.png';
import pinImage from 'assets/images/img-phone-confirmation@3x.png';
import verifiedImage from 'assets/images/icon-thumb@3x.png';
import keyImage from 'assets/images/icon-key@3x.png';
import steemImage from 'assets/images/img-allset-stc@3x.png';
import ReactPhoneInput from 'react-phone-input-2';
import { isValidNumber, formatNumber } from 'libphonenumber-js';
import steem from 'steem';
import crypto from '@steemit/libcrypto';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const FormItem = Form.Item;

class SignUp extends Component {
  state = {
    pageTitle: 'Create Account',
    stage: 0,
    accountCheck: null,
    accountCheckMsg: 'Please input your username',
    accountName: null,
    phoneCheck: false,
    phoneNumber: '',
    pinSent: false,
    pinNumber: '',
    pinCheck: false,
    modalVisible: false,
    privateKey: '',
    keys: null,
    loading: false,
  };

  checkAccount = (_, value, callback) => {
    if (!value || value.length === 0) {
      this.setState({ accountCheck: null, accountCheckMsg: 'Please input your username' });
      return callback();
    }

    if (!/^[a-zA-Z0-9\.\-]+$/.test(value)) {
      this.setState({ accountCheck: false, accountCheckMsg: 'Account name should contain only letters, digits, periods, and dashes' });
      return callback();
    }

    if (value.length < 4) {
      this.setState({ accountCheck: false, accountCheckMsg: 'Account name should be longer' });
      return callback();
    }

    this.setState({ accountName: null, accountCheck: 'loading', accountCheckMsg: 'Checking the server ...' }, () => {
      try {
        steem.api.lookupAccountNames([value], (err, result) => {
          if (result[0] !== null) {
            this.setState({ accountCheck: false, accountCheckMsg: 'This username is already in use' }, () => { return callback(); });
          } else {
            this.setState({ accountName: value, accountCheck: 'validated', accountCheckMsg: <div>The username <span style={{ fontWeight: 'bold' }}>{value}</span> is available</div> }, () => { return callback(); });
          }
        });
      } catch (error) {
        return callback('Service is temporarily unavailable, Please try again later.');
      }
    });
  };

  setPhoneNumber = (number) => {
    this.setState({ phoneNumber: number, phoneCheck: isValidNumber(number) })
  }

  setPinNumber = (e) => {
    this.setState({ pinNumber: e.target.value, pinCheck: /^\d{4}$/.test(e.target.value) })
  }

  submitAccount = (e) => {
    e.preventDefault();
    if (this.state.accountCheck && this.state.accountName !== null) {
      this.moveStage(1);
    }
  }

  sendSms = (e, resend = false) => {
    e.preventDefault();
    api.post('/phone_number/send_sms.json', {phone_number: formatNumber(this.state.phoneNumber, 'International')})
    .then((res) => {
      if (res.pin) {
        notification['success']({ message: 'Pin number has been successfully sent to :' + this.state.phoneNumber });
        if (!resend) {
          this.moveStage(1);
        }
      } else {
        if (res.notification) {
          notification['error']({ message: res.notification })
        }
      }
    })
  }

  verifyPin = (e) => {
    e.preventDefault();
    api.post('/phone_number/verify_pin.json', {user_pin: this.state.pinNumber, phone_number: formatNumber(this.state.phoneNumber, 'International')})
    .then((res) => {
      if (res.is_verified) {
        notification['success']({ message: 'Pin number has been successfully verified' });
        this.moveStage(1);
      } else {
        if (res.notification) {
          notification['error']({ message: res.notification })
        }
      }
    })
  }

  validateStatus = (status) => {
    if (status === null) {
      return '';
    }
    if (status === 'loading') {
      return 'validating';
    }
    return status === 'validated' ? "success" : "error"
  }

  moveStage = (to) => {
    this.setState({
      stage: this.state.stage + to,
    })
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  createPrivateKeys(e) {
    e.preventDefault();
    const randomKey = crypto.generateKeys();
    const privateKey = 'P' + randomKey.private;
    const keys = steem.auth.generateKeys(this.state.username, privateKey, ['posting', 'active', 'owner', 'memo']);
    this.setState({ keys, privateKey }, () => this.moveStage(1))
  }

  confirmPrivateKey() {
    console.log(this.state)
    this.setState({
      loading: true
     }, () => {
      api.post('/users/sign_up', { sign_up: { keys: this.state.keys, username: this.state.accountName, phone_number: formatNumber(this.state.phoneNumber, 'International') } })
      .then((res) => {
        this.setState({
          privateKey: this.state.privateKey,
          loading: false,
          modalVisible: false,
          stage: this.state.stage + 1,
          pageTitle: "You're all set!",
        }, () => this.moveStage(1))
      })
    })
  }

  renderForm(stage) {
    const { getFieldDecorator } = this.props.form;

    let form;

    switch (stage) {
      case 0:
        form = (
          <div key={0} className="form-container">
            <img src={userImage} alt="Steem User" />
            <p>
              Choose your username.
              This will be your name that are called in Steemhunt and other Steem-based  apps.
            </p>
            <Form onSubmit={this.submitAccount}>
              <FormItem
                validateStatus={this.validateStatus(this.state.accountCheck)}
                help={this.state.accountCheckMsg}
                hasFeedback
              >
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Please input your username!', validator: this.checkAccount }],
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" autoFocus />
                )}
              </FormItem>
              <div className="actions-container">
                <Button type="primary" htmlType="submit" disabled={this.state.accountCheck !== 'validated'} block>Continue</Button>
              </div>
            </Form>
            <p className="form-tail">
              Do you already have an account?<br />
              <a href={getLoginURL()} className="action less-margin">
                Sign In
              </a>
            </p>
          </div>
        )
        break;
      case 1:
        form = (
          <div key={1} className="form-container">
            <img src={smsImage} alt="SMS Send" />
            <p>
              Enter your phone number.
              We will send you a text message with a verification code that you’ll need to enter on the next creen.
            </p>
            <Form onSubmit={this.sendSms}>
              <FormItem>
                <ReactPhoneInput inputStyle={{height: 40, width: '100%'}} defaultCountry={'us'} value={this.state.phoneNumber} onChange={this.setPhoneNumber} inputExtraProps={{ autoFocus: true }} />
              </FormItem>
              <div className="actions-container">
                <Button type="primary" htmlType="submit" disabled={!this.state.phoneCheck} block>Send SMS</Button>
              </div>
            </Form>
            <p className="form-tail">
              <a type="ghost" onClick={() => this.moveStage(-1)}><Icon type="left" /> Back</a>
            </p>
          </div>
        )
        break;
        case 2:
          form = (
            <div key={2} className="form-container">
              <img src={pinImage} alt="Pin Send" />
              <p>
              Enter the confirmation code.
              We sent the code to you by SMS to {this.state.phoneNumber}
              </p>
              <Form onSubmit={this.verifyPin}>
                <FormItem>
                  <Input
                    placeholder="Confirmation code (4 digits)"
                    prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={<a onClick={(e) => this.sendSms(e, true)}>Resend</a>}
                    value={this.state.pinNumber}
                    onChange={this.setPinNumber}
                    autoFocus
                  />
                </FormItem>
                <div className="actions-container">
                  <Button type="primary" htmlType="submit" disabled={!this.state.pinCheck} block>Verify PIN</Button>
                </div>
              </Form>
              <p className="form-tail">
                <a type="ghost" onClick={() => this.moveStage(-1)}><Icon type="left" /> Back</a>
              </p>
            </div>
          )
        break;
      case 3:
        form = (
          <div key={3} className="form-container">
            <img src={verifiedImage} alt="Pin Verified" />
            <p>
              Thank you @{this.state.accountName}!
              Your phone number has been verified.
            </p>
            <div className="actions-container">
              <Form onSubmit={(e) => this.createPrivateKeys(e)}>
                <Button type="primary" htmlType="submit" disabled={!this.state.pinCheck} block >Continue</Button>
              </Form>
            </div>
          </div>
        )
        break;
      case 4:
        form = (
          <div key={4} className="form-container">
            <img src={keyImage} alt="Pin Verified" />
            <p>
              This is the private key (passwords) of your Steem account.
              Please keep it secured.
            </p>
            <div className="private-key-container">
              {this.state.privateKey}
            </div>
            <div className="actions-container">
              <CopyToClipboard text={this.state.privateKey} onCopy={() => notification['success']({ message: 'Your private key has been copied to your clipboard.' })}>
                <Button type="primary" ghost block>Copy the key</Button>
              </CopyToClipboard>
              <Button type="primary" block onClick={() => this.setModalVisible(true)}>Continue</Button>
            </div>
          </div>
        )
        break;
      case 5:
        form = (
          <div key={5} className="form-container">
            <p>
              Now you can use Steemhunt and other Steem apps via SteemConnect, a secure way to login without giving up your private keys (passwords).
            </p>
            <img className="full-width" src={steemImage} alt="All Done" />

            <div className="actions-container">
              <Button type="primary" block onClick={() => window.location = getLoginURL()}>Login Now</Button>
            </div>
            <p className="form-tail">
              <a href={'/'} className="action less-margin">
                Go to main page
              </a>
            </p>
          </div>
        )
        break;
      default:
    }
    return form;
  }

  render() {
    return (
      <div className="sign-up-form">
        <Helmet>
          <title>Wallet - Steemhunt</title>
        </Helmet>
        <h1>{this.state.pageTitle}</h1>
        {this.renderForm(this.state.stage)}
        <Modal
          wrapClassName="private-key-modal"
          visible={this.state.modalVisible}
          onCancel={() => this.setModalVisible(false)}
          footer={[
            <Button key="back" type="primary" ghost block onClick={() => this.setModalVisible(false)}>No, I didn't save it yet.</Button>,
            <Button key="submit" type="primary" block onClick={() => this.confirmPrivateKey()} loading={this.state.loading}>Yes, I saved my key securely!</Button>,
          ]}
        >
          <h1>Have you securly stored your private key (passwords)?</h1>
          <p>
            Your private key is used to generate a signature for actions in Steem blockchain such as singing-in and creating transactions.
            <span style={{ fontWeight: 'bold' }}>We cannot recover your key if you lose it.</span>
            So please securly store the key in which no one can’t access other than you.
          </p>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Form.create()(SignUp));
