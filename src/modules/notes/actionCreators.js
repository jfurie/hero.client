import * as constants from './constants';
import { saveContactsResult } from '../contacts';
export function getNotesByCompany(companyId, userId){
  let filter = {
    where: { or: [
      {and: [{privacyValue: 0}, {userId}]},
      {privacyValue: 1},
    ]},
    include:{
      relation:'contact',
    },
  };

  let filterStr = encodeURIComponent(JSON.stringify(filter));

  return {
    types: [constants.GET_NOTES_BY_COMPANY, constants.GET_NOTES_BY_COMPANY_SUCCESS, constants.GET_NOTES_BY_COMPANY_FAIL],
    promise: (client, auth) => client.api.get(`/companies/${companyId}/notes?filter=${filterStr}`, {
      authToken: auth.authToken,
    }),
  };
}

export function getNotesByJob(jobId, userId){
  let filter = {
    where: { or: [
      {and: [{privacyValue: 0}, {userId}]},
      {privacyValue: 1},
    ]},
    include:{
      relation:'contact',
    },
  };

  let filterStr = encodeURIComponent(JSON.stringify(filter));

  return {
    types: [constants.GET_NOTES_BY_JOB, constants.GET_NOTES_BY_JOB_SUCCESS, constants.GET_NOTES_BY_JOB_FAIL],
    promise: (client, auth) => client.api.get(`/jobs/${jobId}/notes?filter=${filterStr}`, {
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
    note,
    types: [constants.CREATE_NOTE, constants.CREATE_NOTE_SUCCESS, constants.CREATE_NOTE_FAIL],
    promise: (client, auth) => client.api.post(`/companies/${companyId}/notes`, {
      authToken: auth.authToken,
      data:note,
    }),
  };
}

export function createJobNote(jobId, note){
  return {
    note,
    types: [constants.CREATE_NOTE, constants.CREATE_NOTE_SUCCESS, constants.CREATE_NOTE_FAIL],
    promise: (client, auth) => client.api.post(`/jobs/${jobId}/notes`, {
      authToken: auth.authToken,
      data:note,
    }),
  };
}

export function updateNote(note){
  return {
    note,
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
export function createContactNote(contact, note){
  return {
    note,
    types: [constants.CREATE_NOTE, constants.CREATE_NOTE_SUCCESS, constants.CREATE_NOTE_FAIL],
    promise: (client, auth) => client.api.post(`/contacts/${contact}/notes`, {
      authToken: auth.authToken,
      data:note,
    }),
  };
}
export function saveLocalNote(notableId, notableType){
  return (dispatch, getState) => {
    let note = getState().notes.localNote;

    let id = note.get('id');
    if(id && id.indexOf('tmp') > -1){
      note = note.remove('id');
    }

    if (note.get('id')) {
      dispatch(updateNote(note));
    }
    else {
      switch (notableType) {
      case 'company':
        dispatch(createCompanyNote(notableId, note));
        break;
      case 'contact':
        dispatch(createContactNote(notableId, note));
        break;
      case 'job':
        dispatch(createJobNote(notableId, note));
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

export function saveNotesByJobResult(notes){
  return {
    type: constants.GET_NOTES_BY_JOB_SUCCESS,
    result: notes,
  };
}

// export function getNotesByIds(noteIds){
//   return (dispatch) => {
//     return dispatch({
//       types:[constants.GET_NOTES_BY_IDS, constants.GET_NOTES_BY_IDS_SUCCESS, constants.GET_NOTES_BY_IDS_FAIL],
//       promise:(client,auth) => {
//         let filter= {where:{id:{inq:noteIds}}};
//         let filterString = encodeURIComponent(JSON.stringify(filter));
//         return client.api.get(`/notes?filter=${filterString}`,{
//           authToken: auth.authToken,
//         });
//       }
//     });
//   };
// }

export function getNotesByIds(noteIds) {
  return (dispatch) => {
    let filter = {
      where: {
        id: {inq:noteIds},
      },
      include:[
        {
          relation:'contact',
        },
      ],
    };

    let filterString = encodeURIComponent(JSON.stringify(filter));

    dispatch({
      types:[constants.GET_NOTES_BY_IDS, constants.GET_NOTES_BY_IDS_SUCCESS, constants.GET_NOTES_BY_IDS_FAIL],
      promise: (client, auth) => client.api.get(`/notes?filter=${filterString}`, {
        authToken: auth.authToken,
      }).then((notes)=> {

        let contacts = [];

        notes.forEach(note => {
          if (note.contact) {
            contacts.push(note.contact);
          }
        });

        dispatch(saveContactsResult(contacts));

        return notes;
      }),
    });
  };
}

export function getNotesByIdsIfNeeded(noteIds){
  return (dispatch, getState) => {
    let newNoteIds =[];
    noteIds.map((noteId => {
      if(!getState().companies.get('list').get(noteId)){
        newNoteIds.push(noteId);
      }
    }));
    if(newNoteIds && newNoteIds.length > 0){
      return dispatch(getNotesByIds(newNoteIds));
    }

  };
}

export function saveNotesResult(notes){
  return {
    type: constants.GET_NOTES_SUCCESS,
    result: notes,
  };
}
