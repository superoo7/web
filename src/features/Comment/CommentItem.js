import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Body from 'components/Body';
import { List, Avatar } from 'antd';
import { sortCommentsFromSteem } from 'utils/helpers/stateHelpers';
import ContentPayoutAndVotes from 'components/ContentPayoutAndVotes';
import Author from 'components/Author';
import CommentReplyForm from './CommentReplyForm';
import VoteButton from 'features/Vote/VoteButton';
import { toTimeAgo } from 'utils/date';
import { selectMe } from 'features/User/selectors';
import { isEditable } from 'features/Post/utils';
import { isAdmin, isModerator, isInfluencer } from 'features/User/utils';

class CommentItem extends PureComponent {
  static propTypes = {
    me: PropTypes.string.isRequired,
    comment: PropTypes.object,
    commentsData: PropTypes.object,
    commentsChild: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      showReplyForm: false,
      showEditForm: false,
    };
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

  render() {
    const { comment, commentsChild, commentsData, me } = this.props;
    const { showReplyForm, showEditForm } = this.state;

    if (!comment) {
      return null;
    }

    // Hide moderators' comments to normal users
    if (isModerator(comment.author) && !isModerator(me) && comment.author !== me) {
      return null;
    }

    return (
      <List.Item className={`comment${(!isModerator(comment.author) && (comment.net_rshares < 0 || comment.author_reputation < 0)) ? ' flagged' : ''}`}>
        <List.Item.Meta
          avatar={<Avatar src={`${process.env.REACT_APP_STEEMCONNECT_IMG_HOST}/@${comment.author}?s=64`} />}
          title={
            <div className="comment-title">
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
                    <span className="separator">|</span>
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
                'trending'
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

export default connect(mapStateToProps, null)(CommentItem);