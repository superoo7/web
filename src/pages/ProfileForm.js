import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { refreshMeBegin } from 'features/User/actions/getMe';
import { selectMe, selectProfileDraft, selectMyAccount } from 'features/User/selectors';
import { updateProfileDraft, resetProfileDraft } from 'features/User/actions/updateProfileDraft';
import { Form, Input, Button, Spin } from 'antd';
import SteemConnect from 'utils/steemConnectAPI';

const FormItem = Form.Item;

class ProfileForm extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    myAccount: PropTypes.object.isRequired,
    profileDraft: PropTypes.object.isRequired,
    updateProfileDraft: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      about: '',
      website: '',
      submitLoading: false
    }
  }

  componentWillUnmount() {
    this.props.resetProfileDraft();
  }

  handleChange = (e, key) => {
    this.props.updateProfileDraft(key, e.target.value)
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { profileDraft, me, myAccount, history, refreshMe } = this.props;
    const profile = myAccount.json_metadata.profile;

    const values = {
      name: profileDraft.name || profile.name,
      about: profileDraft.about || profile.about,
      website: profileDraft.website || profile.website
    };

    const popupOption = 'height=650,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes';
    const win = window.open(SteemConnect.sign('profile-update', values), 'popUpWindow', popupOption, '_blank');
    win.focus();

    var timer = setInterval(function (me, history, refreshMe) {
      if (win.closed) {
        clearInterval(timer);
        refreshMe();
        history.push(`/author/@${me}`);
      }
    }, 500, me, history, refreshMe);
  }

  render() {
    const { match, myAccount } = this.props;

    if (!this.props.me) {
      return (<Spin className="center-loading" />);
    }

    if (this.props.me && match.params.author !== this.props.me) {
      return (
        <div className="heading left-padded">
          <h3>Forbidden</h3>
          <div className="heading-sub">
            You don't have permission to edit this profile.
          </div>
        </div>
      );
    }

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        lg: { span: 24 },
        xl: { span: 6 },
      },
      wrapperCol: {
        lg: { span: 24 },
        xl: { span: 18 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        lg: { span: 24, offset: 0 },
        xl: { span: 18, offset: 6 },
      },
    };

    let profile = myAccount.json_metadata.profile || {};

    return (
      <Form onSubmit={this.handleSubmit} className="post-form">
        <div className="guideline"><a href="https://steemit.com/@astrocket/settings" target="_blank" rel="noopener noreferrer">Edit on Steemit.com</a></div>
        <FormItem
          {...formItemLayout}
          label="name"
        >
          {getFieldDecorator('name', {
            validateTrigger: ['onBlur'],
            initialValue: profile.name
          })(
            <Input
              placeholder="your name"
              onChange={(e) => this.handleChange(e, 'name')} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="about"
        >
          {getFieldDecorator('about', {
            validateTrigger: ['onBlur'],
            initialValue: profile.about
          })(
            <Input.TextArea
              rows={4}
              maxLength={80}
              placeholder="about yourself"
              onChange={(e) => this.handleChange(e, 'about')} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="website"
        >
          {getFieldDecorator('website', {
            validateTrigger: ['onBlur'],
            initialValue: profile.website
          })(
            <Input
              placeholder="https://steemit.com"
              onChange={(e) => this.handleChange(e, 'website')} />
          )}
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button
            type="primary"
            htmlType="submit"
            loading={this.state.submitLoading}
            className="submit-button pull-right round-border padded-button"
          >
            UPDATE
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const WrappedProfileForm = Form.create()(ProfileForm);

const mapStateToProps = () => createStructuredSelector({
  me: selectMe(),
  profileDraft: selectProfileDraft(),
  myAccount: selectMyAccount(),
});

const mapDispatchToProps = (dispatch, props) => ({
  updateProfileDraft: (field, value) => dispatch(updateProfileDraft(field, value)),
  resetProfileDraft: () => dispatch(resetProfileDraft()),
  refreshMe: () => dispatch(refreshMeBegin())
});

export default connect(mapStateToProps, mapDispatchToProps)(WrappedProfileForm);
