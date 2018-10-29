import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Popconfirm } from 'antd';
import { resteemBegin } from '../actions/resteem';
import steem from 'steem';

class ResteemButton extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    me: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      alreadyResteemed: false
    }
  }

  async getRebloogers() {
    const { author, permlink } = this.props.post;
    try {
      const rebloggers = await steem.api.getRebloggedByAsync(author, permlink);
      return rebloggers.includes(this.props.me);
    } catch (e) {
      console.error('getRebloggedByAsync failed.', e.message);
      return false;
    }
  }

  componentDidMount() {
    this.getRebloogers().then((reblogged) => {
      this.setState({ alreadyResteemed: reblogged });
    });
  }

  clickResteem = async (post) => {
    await this.props.resteem(post)
    this.setState({ alreadyResteemed: true })
  }

  render() {
    const { post } = this.props;

    if (this.state.alreadyResteemed) {
      return <Icon className="resteem-button resteemed" type="retweet" theme="outlined" />;
    }

    return (
      <Popconfirm title="Are you sure to resteem this post?" onConfirm={() => this.clickResteem(post)} okText="Yes" cancelText="No">
          {post.isResteeming ?
            <Icon className="resteem-button" type="loading" /> :
            <Icon className="resteem-button" type="retweet" theme="outlined" />}
      </Popconfirm>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resteem: post => dispatch(resteemBegin(post)),
});

export default connect(null, mapDispatchToProps)(ResteemButton);
