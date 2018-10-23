import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import { Icon, Timeline } from 'antd';
import { setCurrentUserBegin } from 'features/User/actions/setCurrentUser';
import { selectCurrentUser, selectCurrentAccount, selectMyFollowingsList, selectMe } from 'features/User/selectors';
import { COLOR_PRIMARY, COLOR_LIGHT_GREY } from 'styles/constants';
import UserSteemPower from 'features/User/components/UserSteemPower';
import UserEstimatedValue from 'features/User/components/UserEstimatedValue';
import FollowerCount from 'features/User/components/FollowerCount';
import FollowButton from 'features/User/components/FollowButton';
import LevelBar from 'features/User/components/LevelBar';
import CircularProgress from 'components/CircularProgress';
import { scrollTop } from 'utils/scroller';
import { formatNumber } from 'utils/helpers/steemitHelpers';
import { getCachedImage } from 'features/Post/utils';

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
    if (isEmpty(account)) {
      return <CircularProgress />;
    }

    let profile = account.json_metadata.profile || {};
    let coverStyle;
    if (profile.cover_image) {
      coverStyle = {
        backgroundColor: COLOR_PRIMARY,
        backgroundImage: `url(${getCachedImage(profile.cover_image, 1600, 800)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    const profileStyle = {
      backgroundColor: COLOR_LIGHT_GREY,
      backgroundImage: `url(https://i.imgur.com/OUdHb2P.png)`,
    };

    const profileImage = `${process.env.REACT_APP_STEEMCONNECT_IMG_HOST}/@${account.name}`;
    if (profile.profile_image) {
      profileStyle['backgroundImage'] = `url(${profileImage}?s=280)`;
    }

    return (
      <div className="profile diagonal-split-view">
        <Helmet>
          <title>@{account.name} - Steemhunt</title>

          { /* Search Engine */ }
          <meta name="description" content={profile.about} />
          <meta name="image" content={`${profileImage}?s=1200`} />
          { /* Schema.org for Google */ }
          <meta itemprop="name" content={`@${account.name} - Steemhunt`} />
          <meta itemprop="description" content={profile.about} />
          <meta itemprop="image" content={`${profileImage}?s=1200`} />
          { /* Twitter */ }
          <meta name="twitter:title" content={`@${account.name} - Steemhunt`} />
          <meta name="twitter:description" content={profile.about} />
          <meta name="twitter:image:src" content={`${profileImage}?s=1200`} />
          { /* Open Graph general (Facebook, Pinterest & Google+) */ }
          <meta property="og:title" content={`@${account.name} - Steemhunt`} />
          <meta property="og:description" content={profile.about} />
          <meta property="og:image" content={`${profileImage}?s=1200`} />
        </Helmet>
        <div className="top-container primary-gradient" style={coverStyle}>
          <h1>{profile.name || account.name}</h1>
          <h2>{profile.about}</h2>
          {me !== account.name &&
            <FollowButton accountName={account.name} />
          }
        </div>
        <div className="diagonal-line"></div>
        <div className="bottom-container">
          <div className="profile-picture" style={profileStyle}></div>
          <div className="profile-level">
          {account.user_score != null &&
            <LevelBar account={account} />
          }
          </div>
          <div className="timeline-container">
            <ul className="left">
              {account.user_score != null &&
                <li className="pink">User Score</li>
              }
              <li>Reputation</li>
              <li>Followers</li>
              <li>Steem Power</li>
              <li>Estimated Value</li>
            </ul>

            <Timeline>
              {account.user_score != null &&
                <Timeline.Item className="pink">
                  {formatNumber(account.user_score)}
                  {account.boost_score && account.boost_score > 1 &&
                    <span> (x{account.boost_score})</span>
                  }
                </Timeline.Item>
              }
              <Timeline.Item>
                {account.reputation}
              </Timeline.Item>
              <Timeline.Item><FollowerCount author={account.name} unit="followers" /></Timeline.Item>
              <Timeline.Item><UserSteemPower account={account} /></Timeline.Item>
              <Timeline.Item><UserEstimatedValue account={account} /></Timeline.Item>
            </Timeline>
          </div>

          <div className="other-info">
            {profile.website &&
              <p><a href={profile.website} target="_blank"><Icon type="link" /> {profile.website.replace(/^https?:\/\//, '')}</a></p>
            }
            <p><Icon type="book" /> <a href={`https://steemit.com/@${account.name}`} target="_blank" rel="noopener noreferrer">View Steemit blog</a></p>
          </div>
        </div>
      </div>
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
