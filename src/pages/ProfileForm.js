import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { setCurrentUserBegin } from 'features/User/actions/setCurrentUser';
import { selectMe, selectProfileDraft, selectMyAccount } from 'features/User/selectors';
import { updateProfileDraft, resetProfileDraft } from 'features/User/actions/updateProfileDraft';
import { Form, Input, Button, Spin } from 'antd';
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
      website: ''
    }
  }

  componentWillUnmount() {
    this.props.resetProfileDraft();
  }

  handleChange = (e, key) => {
    this.props.updateProfileDraft(key, e.target.value)
  }

  render() {
    const { match, profileDraft, myAccount } = this.props;

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

    return(
      <Form onSubmit={this.handleSubmit} className="post-form">
        <div className="guideline"><a href="https://github.com/Steemhunt/web/blob/master/POSTING_GUIDELINES.md" target="_blank" rel="noopener noreferrer">Posting Guidelines</a></div>
        <FormItem
          {...formItemLayout}
          label="about"
        >
          {getFieldDecorator('about', {
            validateTrigger: ['onBlur'],
            initialValue: profile.about
          })(
            <Input
              placeholder="about yourself"
              onChange={(e) => this.handleChange(e, 'about')}/>
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
              onChange={(e) => this.handleChange(e, 'website')}/>
          )}
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-button pull-right round-border padded-button"
            loading={this.props.isPublishing}
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
  resetProfileDraft: () => dispatch(resetProfileDraft())
});

export default connect(mapStateToProps, mapDispatchToProps)(WrappedProfileForm);
