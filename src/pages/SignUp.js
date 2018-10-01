import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import { Form, Input, Icon, Button } from 'antd';
import api from 'utils/api';
import { getLoginURL } from 'utils/token';
import userImage from 'assets/images/icon-create-account@3x.png';

const FormItem = Form.Item;

class SignUp extends Component {
  static propTypes = {

  };

  state = {
    pageTitle: 'Create Account',
    stage: 0,
    accountCheck: null,
    accountCheckMsg: 'Please input your username',
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ethAddress !== null) {
      this.setState({ ethModalVisible: false });
    }
  }

  checkAccount  = (_, value, callback) => {
    this.setState({ accountCheck: 'loading', accountCheckMsg: 'Checking the server ...' });

    if (!value || value.length === 0) {
      this.setState({ accountCheck: null, accountCheckMsg: 'Please input your username' });
      return callback();
    }

    api.get('/posts.json', { url: value }, true).then((res) => {
      if (res.result === 'OK') {
        callback();
      } else {
        if (value.length < 4) {
          this.setState({ accountCheck: false, accountCheckMsg: 'Account name should be longer' });
          callback('');
        } else if (value === 'steemhunt') {
          this.setState({ accountCheck: false, accountCheckMsg: 'This username is already in use' });
          callback();
        } else if (value === 'astrocket') {
          this.setState({ accountCheck: 'validated', accountCheckMsg: `The username ${value} is available` });
          callback();
        }
      }
    }).catch(msg => {
      callback('Service is temporarily unavailable, Please try again later.');
    });
  };

  validateStatus = (status) => {
    if (status === null) {
      return '';
    }
    if (status === 'loading') {
      return 'validating';
    }
    return status === 'validated' ? "success" : "error"
  }

  renderForm(stage) {
    const { getFieldDecorator } = this.props.form;

    let form;

    switch(stage) {
      case 0:
        form = (
          <div className="form-container">
            <img src={userImage} alt="Steem User" />
            <p>
              Choose your username.
              This will be your name that are called in Steemhunt and other Steem-based  apps.
            </p>
            <Form>
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
              Do you already have an account?<br/>
              <a href={getLoginURL()} className="action less-margin">
                Sign In
              </a>
            </p>
          </div>
        )
        break;
      case 1:
        form = (
          <div>fdjisalfjsdal</div>
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
