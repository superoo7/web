import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import { Form, Input, Icon, Button, Select } from 'antd';
import api from 'utils/api';
import { getLoginURL } from 'utils/token';
import userImage from 'assets/images/icon-create-account@3x.png';
import smsImage from 'assets/images/img-phone@3x.png';
import ReactPhoneInput from 'react-phone-input-2';
import { isValidNumber } from 'libphonenumber-js'
import steem from 'steem';

const FormItem = Form.Item;

class SignUp extends Component {
  static propTypes = {

  };

  state = {
    pageTitle: 'Create Account',
    stage: 1,
    accountCheck: null,
    accountCheckMsg: 'Please input your username',
    accountName: null,
    phoneCheck: false,
    phoneNumber: '',
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

  sendMessage = (e) => {
    e.preventDefault();
    const res = api.post('/phone_number/send_sms.json', {phone_number: this.state.phoneNumber});
    console.log(res);
  }

  submitAccount = (e) => {
    e.preventDefault();
    if (this.state.accountCheck && this.state.accountName !== null) {
      this.nextStage();
    }
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

  nextStage = () => {
    this.setState({
      stage: this.state.stage += 1,
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
            <Form onSubmit={this.sendMessage}>
              <FormItem
                style={{ marginBottom: 20 }}
              >
                <ReactPhoneInput inputStyle={{height: 40, width: '100%'}} defaultCountry={'us'} value={this.state.phoneNumber} onChange={this.setPhoneNumber}/>
                {this.state.phoneNumber}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" disabled={!this.state.phoneCheck} block>Send SMS</Button>
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
