import update from 'immutability-helper';
 /*--------- CONSTANTS ---------*/
const UPDATE_COMMENT = 'UPDATE_COMMENT';
 /*--------- ACTIONS ---------*/
export function updateComment(commentKey, attributes) {
  return { type: UPDATE_COMMENT, commentKey, attributes };
}
 /*--------- REDUCER ---------*/
export function updateCommentReducer(state, action) {
  switch (action.type) {
    case UPDATE_COMMENT: {
      return update(state, {
        commentsData: {
          [action.commentKey]: { $merge: action.attributes },
        }
      });
    }
    default:
      return state;
  }
}
