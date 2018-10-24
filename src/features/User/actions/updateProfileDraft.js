import update from 'immutability-helper';
import { initialState } from 'features/User/actions';

/*--------- CONSTANTS ---------*/
const UPDATE_PROFILE_PROFILE_DRAFT = 'UPDATE_PROFILE_PROFILE_DRAFT';
const RESET_PROFILE_PROFILE_DRAFT = 'RESET_PROFILE_PROFILE_DRAFT';

/*--------- ACTIONS ---------*/

export function updateProfileDraft(field, value) {
  return { type: UPDATE_PROFILE_PROFILE_DRAFT, field, value };
}

export function resetProfileDraft() {
  return { type: RESET_PROFILE_PROFILE_DRAFT };
}

/*--------- REDUCER ---------*/
export function updateProfileDraftReducer(state, action) {
  switch (action.type) {
    case UPDATE_PROFILE_PROFILE_DRAFT: {
      return update(state, {
        profileDraft: { $merge: { [action.field]: action.value } },
      });
    }
    case RESET_PROFILE_PROFILE_DRAFT: {
      return update(state, {
        profileDraft: { $set: initialState['profileDraft'] },
      });
    }
    default:
      return state;
  }
}
