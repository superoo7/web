import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import { Icon, Timeline } from 'antd';
import { setCurrentUserBegin } from 'features/User/actions/setCurrentUser';
import { selectCurrentUser, selectCurrentAccount, selectMe, selectProfileDraft } from 'features/User/selectors';
import { COLOR_PRIMARY, COLOR_LIGHT_GREY } from 'styles/constants';
import UserSteemPower from 'features/User/components/UserSteemPower';
import UserEstimatedValue from 'features/User/components/UserEstimatedValue';
import FollowerCount from 'features/User/components/FollowerCount';
import LevelBar from 'features/User/components/LevelBar';
import CircularProgress from 'components/CircularProgress';
import { scrollTop } from 'utils/scroller';
import { formatNumber } from 'utils/helpers/steemitHelpers';
import { getCachedImage } from 'features/Post/utils';

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
    if (isEmpty(account)) {
      return <CircularProgress />;
    }

    if (!this.props.me || account.name !== this.props.me) {
      return <CircularProgress />;
    }

    let profile = account.json_metadata.profile || {};
    let coverStyle;
    if (profile.cover_image) {
      coverStyle = {
        backgroundColor: COLOR_PRIMARY,
        backgroundImage: `url(${getCachedImage(profile.cover_image, 1600, 800)})`,
        backgroundSize: 'cover',
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

    const draftAbout = profileDraft.about || profile.about;
    const draftWebsite = profileDraft.website || profile.website;

    return (
      <div className="profile diagonal-split-view">
        <Helmet>
          <title>@{account.name} - Editing</title>
        </Helmet>
        <div className="top-container primary-gradient" style={coverStyle}>
          <h1>{profile.name || account.name}</h1>
          <h2>{draftAbout}</h2>
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
            {draftWebsite &&
              <p><a href={draftWebsite} target="_blank"><Icon type="link" /> {draftWebsite.replace(/^https?:\/\//, '')}</a></p>
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
  profileDraft: selectProfileDraft()
});

const mapDispatchToProps = (dispatch, props) => ({
  setCurrentUser: user => dispatch(setCurrentUserBegin(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDraft);
