import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { setCurrentUserBegin } from 'features/User/actions/setCurrentUser';
import { selectCurrentUser, selectCurrentAccount, selectMyFollowingsList, selectMe } from 'features/User/selectors';
import { scrollTop } from 'utils/scroller';
import ProfileView from 'features/User/components/ProfileView';

class Profile extends Component {
  static propTypes = {
    me: PropTypes.string,
    currentUser: PropTypes.string,
    account: PropTypes.shape({
      name: PropTypes.string,
      reputation: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      post_count: PropTypes.number,
      follower_count: PropTypes.number,
      following_count: PropTypes.number,
    }).isRequired,
    myFollowings: PropTypes.array,
    setCurrentUser: PropTypes.func.isRequired,
  };

  static defaultProps = {
    account: {
      name: undefined,
      reputation: 0,
      post_count: 0,
      follower_count: 0,
      following_count: 0,
    },
  };

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
    const { account, me } = this.props;

    return (
      <ProfileView
        account={account}
        me={me}
      />
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  me: selectMe(),
  account: selectCurrentAccount(),
  currentUser: selectCurrentUser(),
  myFollowings: selectMyFollowingsList(),
});

const mapDispatchToProps = (dispatch, props) => ({
  setCurrentUser: user => dispatch(setCurrentUserBegin(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
