import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { setCurrentUserBegin } from 'features/User/actions/setCurrentUser';
import { selectCurrentUser, selectCurrentAccount, selectMe, selectProfileDraft } from 'features/User/selectors';
import { scrollTop } from 'utils/scroller';
import ProfileView from 'features/User/components/ProfileView';

class ProfileDraft extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    account: PropTypes.object.isRequired,
    currentUser: PropTypes.string,
    profileDraft: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.author !== this.props.currentUser) {
      this.props.setCurrentUser(match.params.author);
    }
    scrollTop();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.author !== nextProps.currentUser) {
      this.props.setCurrentUser(nextProps.match.params.author);
      scrollTop();
    }
  }

  render() {
    const { account, me, profileDraft } = this.props;

    return (
      <ProfileView
        account={account}
        me={me}
        onEditing
        profileDraft={profileDraft}
      />
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  me: selectMe(),
  account: selectCurrentAccount(),
  currentUser: selectCurrentUser(),
  profileDraft: selectProfileDraft()
});

const mapDispatchToProps = (dispatch, props) => ({
  setCurrentUser: user => dispatch(setCurrentUserBegin(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDraft);
