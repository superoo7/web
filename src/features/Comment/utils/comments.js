import { isModerator } from 'features/User/utils';

export const mapCommentsBasedOnId = (data) => {
  const commentsList = {};
  Object.keys(data).forEach((key) => {
    commentsList[data[key].post_id] = data[key];
  });
  return commentsList;
};

export const getCommentsChildrenLists = (apiRes) => {
  let listsById = {};
  Object.keys(apiRes.content).forEach((commentKey) => {
    listsById[apiRes.content[commentKey].post_id] = apiRes.content[commentKey].replies.map(
      childKey => apiRes.content[childKey].post_id
    );
  });

  return listsById;
};

export const getRootCommentsList = (apiRes) => {
  return Object.keys(apiRes.content).filter((commentKey) => {
    return apiRes.content[commentKey].depth === 1;
  }).map(commentKey => apiRes.content[commentKey].post_id);
};

export const shouldCommentVisible = function(comment, postAuthor, me) {
  let meta = null;
  try {
    meta = JSON.parse(comment.json_metadata);
  } catch(e) {}
  if (meta && meta.verified_by === comment.author && isModerator(comment.author) && !isModerator(me) && postAuthor !== me) {
    return false;
  }

  return true;
};