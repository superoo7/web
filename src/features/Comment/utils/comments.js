import { isModerator } from 'features/User/utils';

export const mapCommentsBasedOnId = (data) => {
  const commentsList = {};
  Object.keys(data).forEach((key) => {
    commentsList[data[key].id] = data[key];
  });
  return commentsList;
};

export const getCommentsChildrenLists = (apiRes) => {
  let listsById = {};
  Object.keys(apiRes.content).forEach((commentKey) => {
    listsById[apiRes.content[commentKey].id] = apiRes.content[commentKey].replies.map(
      childKey => apiRes.content[childKey].id
    );
  });

  return listsById;
};

export const getRootCommentsList = (apiRes) => {
  return Object.keys(apiRes.content).filter((commentKey) => {
    return apiRes.content[commentKey].depth === 1;
  }).map(commentKey => apiRes.content[commentKey].id);
};

export const shouldCommentVisible = function(author, me) {
  if (isModerator(author) && !isModerator(me) && author !== me) {
    return false;
  }

  return true;
};