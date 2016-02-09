import * as constants from './constants';
export function getNotesByCompany(companyId){
  return {
    types: [constants.GET_NOTES_BY_COMPANY, constants.GET_NOTES_BY_COMPANY_SUCCESS, constants.GET_NOTES_BY_COMPANY_FAIL],
    promise: (client, auth) => client.api.get(`/companies/${companyId}/notes?filter[include]=contact`, {
      authToken: auth.authToken,
    }),
  };
}

export function getAllNotes() {
  return {
    types: [constants.GET_NOTES, constants.GET_NOTES_SUCCESS, constants.GET_NOTES_FAIL],
    promise: (client, auth) => client.api.get('/notes', {
      authToken: auth.authToken,
    }),
  };
}

export function createCompanyNote(companyId, note){
  return {
    types: [constants.CREATE_NOTE, constants.CREATE_NOTE_SUCCESS, constants.CREATE_NOTE_FAIL],
    promise: (client, auth) => client.api.post(`/companies/${companyId}/notes`, {
      authToken: auth.authToken,
      data:note,
    }),
  };
}

export function updateNote(note){
  return {
    types: [constants.UPDATE_NOTE, constants.UPDATE_NOTE_SUCCESS, constants.UPDATE_NOTE_FAIL],
    promise: (client, auth) => client.api.put('/notes', {
      authToken: auth.authToken,
      data:note,
    }),
  };
}

export function deleteNote(id){
  return {
    types: [constants.DELETE_NOTE, constants.DELETE_NOTE_SUCCESS, constants.DELETE_NOTE_FAIL],
    promise: (client, auth) => client.api.del(`/notes/${id}`, {
      authToken: auth.authToken,
    }),
  };
}

export function updateNoteLocal(note){
  return {
    type: constants.UPDATE_NOTE_LOCAL,
    result: note,
  };
}
export function replaceNoteLocal(note){
  return {
    type: constants.REPLACE_NOTE_LOCAL,
    result: note,
  };
}

export function saveLocalNote(notableId, notableType){
  return (dispatch, getState) => {
    let current = getState().notes.localNote;
    if (current.get('id')) {
      dispatch(updateNote(current));
    }
    else {
      switch (notableType) {
      case 'company':
        dispatch(createCompanyNote(notableId, current));
        break;
      default:
      }
    }
  };
}

export function getOneNote(id) {
  return {
    types: [constants.GET_NOTE, constants.GET_NOTE_SUCCESS, constants.GET_NOTE_FAIL],
    promise: (client, auth) => client.api.get(`/notes/${id}`, {
      authToken: auth.authToken,
      data: {
        id,
      },
    }),
  };
}

export function saveNotesByCompanyResult(notes){
  return {
    type: constants.GET_NOTES_BY_COMPANY_SUCCESS,
    result: notes,
  };
}
