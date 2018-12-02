import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Spin, Radio } from 'antd';
import InfiniteScroll from 'components/InfiniteScroll';
import { selectTopStatus, selectTopPosts, selectPosts } from 'features/Post/selectors';
import { getTopPostsBegin } from 'features/Post/actions/getTopPosts';
import PostItem from 'features/Post/components/PostItem';
import { formatAmount, formatNumber } from "utils/helpers/steemitHelpers";

class HallOfFame extends Component {
  static propTypes = {
    posts: PropTypes.object.isRequired,
    topPosts: PropTypes.object.isRequired,
    topStatus: PropTypes.object.isRequired,
    getTopPosts: PropTypes.func.isRequired,
  };

  state = {
    period: 'week',
  };


  componentDidMount() {
    this.props.getTopPosts(this.state.period, 1);
  }

  loadMore = (nextPage) => {
    this.props.getTopPosts(this.state.period, nextPage);
  };

  handlePeriodChanged = (e) => this.setState({ period: e.target.value },  () => this.props.getTopPosts(this.state.period, 1));

  render() {
    const { posts, topPosts, topStatus } = this.props;
    const { period } = this.state;

    const items = (topPosts[period] || []).map((key, index) =>
      <PostItem key={index + 1} rank={index + 1} pathPrefix="/hall-of-fame" post={posts[key]} lazyLoad={false} />
    )

    let hasMore = true;
    let isLoading = false;
    if (topStatus[period]) {
      if (topStatus[period]['finished']) {
        hasMore = false;
      }

      if (topStatus[period]['loading']) {
        isLoading = true;
      }
    }

    return (
      <InfiniteScroll
        loadMore={this.loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        loader={<Spin className="center-loading" key={0} />}
        useWindow={false}
        className="post-list"
        header={topStatus[period] &&
          <div className="heading left-padded" key="header">
            <h3>Hall of Fame</h3>
            <div className="radio-option">
              <Radio.Group onChange={this.handlePeriodChanged} defaultValue={period} size="small">
                <Radio.Button value="week">This Week</Radio.Button>
                <Radio.Button value="month">This Month</Radio.Button>
                <Radio.Button value="all">All Time</Radio.Button>
              </Radio.Group><br/>
            </div>
            <div className="heading-sub">
              <b>{formatNumber(topStatus[period].total_count, '0,0')}</b> products, <b>{formatAmount(topStatus[period].total_payout)}</b> SBD hunter’s rewards were generated.
            </div>
          </div>
        }
      >
        {items}
      </InfiniteScroll>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  posts: selectPosts(),
  topPosts: selectTopPosts(),
  topStatus: selectTopStatus(),
});


const mapDispatchToProps = dispatch => ({
  getTopPosts: (period, page) => dispatch(getTopPostsBegin(period, page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HallOfFame);
