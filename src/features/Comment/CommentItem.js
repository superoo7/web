import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Body from 'components/Body';
import { List, Avatar, Icon } from 'antd';
import { sortCommentsFromSteem } from 'utils/helpers/stateHelpers';
import ContentPayoutAndVotes from 'components/ContentPayoutAndVotes';
import Author from 'components/Author';
import CommentReplyForm from './CommentReplyForm';
import VoteButton from 'features/Vote/VoteButton';
import { toTimeAgo } from 'utils/date';
import { selectMe } from 'features/User/selectors';
import { isEditable } from 'features/Post/utils';
import { isAdmin, isModerator, isInfluencer } from 'features/User/utils';
import { decreaseCommentcount } from 'features/Post/reducer';
import { shouldCommentVisible } from 'features/Comment/utils/comments';
import { updateComment } from 'features/Comment/actions/updateComment';
import api from 'utils/api';

class CommentItem extends PureComponent {
  static propTypes = {
    me: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    commentsData: PropTypes.object.isRequired,
    commentsChild: PropTypes.object.isRequired,
    decreaseCommentcount: PropTypes.func.isRequired,
    comment: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      showReplyForm: false,
      showEditForm: false,
      loadingDislike: false
    };
  }

  componentDidMount() {
    const { post, comment } = this.props;

    // NOTE:
    // This will show an incorrect count when the user is the owner or a moderator
    // Hard to fix because getMe() and getCommentsFromPost() - are running asynchronously
    if (comment && isModerator(comment.author) && !post.commentCountAdjusted) {
      this.props.decreaseCommentcount();
    }
  }

  closeReplyForm = () => {
    this.setState({ showReplyForm: false });
  };

  switchReplyForm = () => {
    this.setState({ showReplyForm: !this.state.showReplyForm });
  };

  closeEditForm = () => {
    this.setState({ showEditForm: false });
  };

  switchEditForm = () => {
    this.setState({ showEditForm: !this.state.showEditForm });
  };

  onClickDislike = () => {
    const { comment } = this.props;
    this.setState({ loadingDislike: true }, async () => {
      const res = await api.post(`/comments/dislike.json`, {
        key: comment.id,
        permlink: comment.permlink}, true)
      Object.entries(res).map(([key, value]) => {
        this.props.updateComment(comment.id, key, value);
      })
      this.setState({ loadingDislike: false });
    })
  }

  renderDislike() {
    const { comment } = this.props;
    if(this.state.loadingDislike) {
      return null;
    }

    if (comment.check_disliked) {
      return (
        <Icon className={"dislike-button disliked"} type="dislike" theme="outlined" onClick={this.onClickDislike}/>
      )
    } else {
      return (
        <Icon className={"dislike-button"} type="dislike" theme="outlined" onClick={this.onClickDislike}/>
      )
    }
  }

  render() {
    const { post, comment, commentsChild, commentsData, me } = this.props;
    const { showReplyForm, showEditForm } = this.state;
    const delisted = ((!isModerator(comment.author) && (comment.net_rshares < 0 || comment.author_reputation < 0)) || comment.is_delisted)

    // Hide moderators' comments to normal users
    if (!comment || !shouldCommentVisible(comment, post.author, me)) {
      return null;
    }

    return (
      <List.Item className={`comment${delisted ? ' flagged' : ''}`}>
        <List.Item.Meta
          avatar={<Avatar src={`${process.env.REACT_APP_STEEMCONNECT_IMG_HOST}/@${comment.author}?s=64`} />}
          title={
            <div className="comment-title">
              {this.renderDislike()}
              <Author name={comment.author} />
              {isAdmin(comment.author) ?
                <span className="badge team">TEAM</span>
              :
                isModerator(comment.author) ? <span className="badge moderator">MODERATOR</span> :
                isInfluencer(comment.author) && <span className="badge influencer">INFLUENCER</span>
              }
              <span className="separator">&middot;</span>
              <span className="date">{toTimeAgo(comment.created)}</span>
            </div>
          }
          description={
            <div className="comment-body">
              {showEditForm ?
                <CommentReplyForm content={comment} editMode={true} closeForm={this.closeEditForm} />
              :
                <div>
                  <Body post={comment} />
                  <div className="actions">
                    <VoteButton post={comment} type="comment" layout="comment" />
                    <ContentPayoutAndVotes content={comment} type="comment" />
                    <span className="separator">|</span>
                    <a className="hover-link" onClick={this.switchReplyForm}>reply</a>
                    {me === comment.author && isEditable(comment) &&
                      <span>
                        <span className="separator">|</span>
                        <a className="hover-link" onClick={this.switchEditForm}>edit</a>
                      </span>
                    }
                  </div>
                </div>
              }

              {showReplyForm && (
                <CommentReplyForm content={comment} closeForm={this.closeReplyForm} />
              )}

              {commentsChild[comment.id] && sortCommentsFromSteem(
                commentsChild[comment.id],
                commentsData,
                'score'
              ).map(commentId =>
                <CommentItem
                  {...this.props}
                  key={commentId}
                  comment={commentsData[commentId]}
                />
              )}
            </div>
          }
        />
      </List.Item>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  me: selectMe(),
});

const mapDispatchToProps = (dispatch, props) => ({
  decreaseCommentcount: () => dispatch(decreaseCommentcount(props.post)),
  updateComment: (commentKey, field, value) => dispatch(updateComment(commentKey, field, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentItem);