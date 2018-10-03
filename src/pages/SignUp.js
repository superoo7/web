import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import { Form, Input, Icon, Button, Select, notification } from 'antd';
import api from 'utils/api';
import { getLoginURL } from 'utils/token';
import userImage from 'assets/images/icon-create-account@3x.png';
import smsImage from 'assets/images/img-phone@3x.png';
import pinImage from 'assets/images/img-phone-confirmation@3x.png';
import verifiedImage from 'assets/images/icon-thumb@3x.png';
import keyImage from 'assets/images/icon-key@3x.png';
import ReactPhoneInput from 'react-phone-input-2';
import { isValidNumber, parseNumber, formatNumber } from 'libphonenumber-js';
import steem from 'steem';

const FormItem = Form.Item;

class SignUp extends Component {
  static propTypes = {

  };

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
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ethAddress !== null) {
      this.setState({ ethModalVisible: false });
    }
  }

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
      if (res.verified) {
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
                style={{ marginBottom: 20 }}
              >
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Please input your username!', validator: this.checkAccount }],
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="account name" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" disabled={this.state.accountCheck !== 'validated'} block>Continue</Button>
              </FormItem>
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
              <FormItem
                style={{ marginBottom: 20 }}
              >
                <ReactPhoneInput inputStyle={{height: 40, width: '100%'}} defaultCountry={'us'} value={this.state.phoneNumber} onChange={this.setPhoneNumber}/>
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" disabled={!this.state.phoneCheck} block>Send SMS</Button>
              </FormItem>
            </Form>
            <p className="form-tail">
              <a type="ghost" onClick={() => this.moveStage(-1)} block><Icon type="left" /> Back</a>
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
                <FormItem
                  style={{ marginBottom: 20 }}
                >
                  <Input
                    placeholder="Confirmation code (4 digits)"
                    prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={<a onClick={(e) => this.sendSms(e, true)}>Resend</a>}
                    value={this.state.pinNumber}
                    onChange={this.setPinNumber}
                  />
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit" disabled={!this.state.pinCheck} block>Send SMS</Button>
                </FormItem>
              </Form>
              <p className="form-tail">
                <a type="ghost" onClick={() => this.moveStage(-1)} block><Icon type="left" /> Back</a>
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
            <Form onSubmit={() => this.nextStage(1)}>
              <FormItem>
                <Button type="primary" htmlType="submit" disabled={!this.state.pinCheck} block>Continue</Button>
              </FormItem>
            </Form>
          </div>
        )
        break;
      case 4:
       form = (
        <div key={3} className="form-container">
          <img src={keyImage} alt="Pin Verified" />
          <p>
            This is the private key (passwords) of your Steem account.
            Please keep it secured.
          </p>
          <Button type="primary" block>Copy the key</Button>
          <Button type="primary" block>Continue</Button>
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
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({

});

const mapDispatchToProps = (dispatch, props) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SignUp));
