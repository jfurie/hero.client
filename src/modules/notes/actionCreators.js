import superagent from 'superagent';
import * as constants from './constants';
export function getNotesByCompany(companyId){
  return {
    types: [constants.GET_NOTES_BY_COMPANY, constants.GET_NOTES_BY_COMPANY_SUCCESS, constants.GET_NOTES_BY_COMPANY_FAIL],
    promise: (client, auth) => client.api.get(`/companies/${companyId}/notes`, {
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

export function createNote(note){
  return {
    types: [constants.CREATE_NOTE, constants.CREATE_NOTE_SUCCESS, constants.CREATE_NOTE_FAIL],
    promise: (client, auth) => client.api.post('/notes', {
      authToken: auth.authToken,
      data:note,
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

export function updateNoteImageLocal(file) {
  return (dispatch) => {
    dispatch({
      types: [constants.UPDATE_NOTE_IMAGE_LOCAL, constants.UPDATE_NOTE_IMAGE_LOCAL_SUCCESS, constants.UPDATE_NOTE_IMAGE_LOCAL_FAIL],
      promise: (client, auth) => client.api.post('/resources/signUrl', {
        authToken: auth.authToken,
        data: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      }).then((signUrlData) => new Promise((resolve, reject) => {
        superagent.put(signUrlData.signed_request)
            .send(file)
            .on('progress', function(e) {
              dispatch({
                type: constants.UPDATE_NOTE_IMAGE_LOCAL_PROGRESS,
                result: e.percent,
              });
            })
            .end((err, {
              body,
            } = {}) => {
              if (err) {
                return reject(body || err);
              } else {
                return resolve(signUrlData.url);
              }
            });
      })).then((signUrlData) => {
        console.log(signUrlData);
        return client.api.post('/resources', {
          authToken: auth.authToken,
          data: {
            resourceType: 'image',
            item: signUrlData,
          },
        });
      }),
    });
  };
}
export function saveLocalNote(){
  return (dispatch, getState) => {
    let current = getState().notes.localNote;
    dispatch(createNote(current));
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
