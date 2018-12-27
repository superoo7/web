import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { Button, Select, Icon, Tooltip, Spin } from 'antd';
import { forceCheck } from 'react-lazyload';
import { selectPosts, selectDailyRanking, selectDailyLoadingStatus, selectDailyStats } from './selectors';
import { getPostsBegin } from './actions/getPosts';
import { daysAgoToString } from 'utils/date';
import PostItem from './components/PostItem';
import ShuffleButton from './components/ShuffleButton';
import { getSortOption, setSortOption } from 'utils/sortOptions';
import { isModerator } from 'features/User/utils';
import { selectMe } from 'features/User/selectors';
import { SubHeading } from './components/SubHeading';

class PostList extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    daysAgo: PropTypes.number.isRequired,
    getPosts: PropTypes.func.isRequired,
    posts: PropTypes.object.isRequired,
    dailyRanking: PropTypes.object.isRequired,
    dailyStats: PropTypes.object.isRequired,
  };

  constructor(props) {
    super();

    this.state = {
      showAll: false,
    }

    if (props.daysAgo <= 0) {
      this.state['showAll'] = true;
    }
  }

  componentDidMount() {
    this.props.getPosts(this.props.daysAgo, this.state.showAll);
  }

  showAll = () => {
    this.setState({ showAll: true });
    this.props.getPosts(this.props.daysAgo, true);
  }

  handleSortOption = (value) => {
    setSortOption(`daily-${this.props.daysAgo}`, value);
    this.props.getPosts(this.props.daysAgo, this.state.showAll, forceCheck);
  }

  render() {
    const { me, posts, dailyRanking, dailyLoadingStatus, dailyStats, daysAgo } = this.props;

    if (dailyLoadingStatus[daysAgo] === 'error') {
      return (
        <div className="heading left-padded">
          Service is temporarily unavailable, Please try again later.
        </div>
      );
    }

    let ranking = dailyRanking[daysAgo] || [];
    if (isEmpty(ranking)) { // Hide except today section
      return null;
    }

    let rankingItems = [];
    ranking.forEach(function(postKey, index) {
      const post = posts[postKey];
      if (post) {
        rankingItems.push(
          <PostItem key={post.id} rank={index + 1} post={post} lazyLoad={daysAgo === 0} />
        );
      }
    });

    let buttonClass = 'show-all';
    if (this.state.showAll) {
      buttonClass += ' hide';
    }

    const stats = dailyStats[daysAgo] || {};
    const currentSortOption = getSortOption('daily-' + daysAgo);
    const allRandomMode = daysAgo === -1 && isEmpty(dailyRanking[0]);

    return (
      <div className={`post-list day-ago-${daysAgo}`}>
        <div className="heading left-padded">
          <h3>
            <span className="days-ago-text">{daysAgoToString(daysAgo)}</span>
            {(daysAgo === 0 || allRandomMode) && <ShuffleButton handleSortOption={this.handleSortOption} me={me}/>}
          </h3>
          <SubHeading huntsCount={stats.total_count} dailyTotalReward={stats.total_payout} daysAgo={daysAgo}  />
          {daysAgo !== -1 &&
            <div className="sort-option">
              <span className="text-small">Sort by: </span>
              <Select size="small" value={currentSortOption} onChange={this.handleSortOption}>
                <Select.Option value="hunt_score">Hunt Score</Select.Option>
                {daysAgo === 0 &&
                  <Select.Option value="random">Random</Select.Option>
                }
                <Select.Option value="payout">Payout Value</Select.Option>
                <Select.Option value="created">New</Select.Option>
                <Select.Option value="vote_count">Vote Count</Select.Option>
                <Select.Option value="comment_count">Comment Count</Select.Option>
                {isModerator(me) &&
                  <Select.Option value="unverified">Unverified</Select.Option>
                }
              </Select>
              {currentSortOption === 'hunt_score' &&
                <Tooltip placement="left" title="Hunt score is calculated by upvoting counts that are weighted by Steemhunt User Scores in order to avoid spamming attempts.">
                  <Icon type="question-circle-o" className="help-hunt-score" />
                </Tooltip>
              }
            </div>
          }
        </div>
        <div className="daily-posts">
          {rankingItems}
          {dailyLoadingStatus[daysAgo] === 'done' && !this.state['showAll'] &&
            <Button type="primary" size="default" className={buttonClass} ghost onClick={this.showAll}>Show All</Button>
          }
          {dailyLoadingStatus[daysAgo] === 'loading' &&
            <Spin className="center-loading" />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  me: selectMe(),
  posts: selectPosts(),
  dailyRanking: selectDailyRanking(),
  dailyLoadingStatus: selectDailyLoadingStatus(),
  dailyStats: selectDailyStats(),
});

const mapDispatchToProps = dispatch => ({
  getPosts: (daysAgo, all, callback) => dispatch(getPostsBegin(daysAgo, all, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
