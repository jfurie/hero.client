import Immutable from 'immutable';
import * as constants from './constants';
const initialState = {
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
  localNote: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case constants.GET_NOTES: {
    return {
      ...state,
    };
  }
  case constants.GET_NOTES_SUCCESS: {
    return state;
    // return {
    //   ...state,
    //   list: state.list.mergeDeep(FAKENOTES),
    // };
  }
  case constants.GET_NOTES_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case constants.GET_NOTE: {
    return {
      ...state,
    };
  }
  case constants.GET_NOTE_SUCCESS: {
    let noteMap = {};
    noteMap[action.result.id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(noteMap),
    };
  }
  case constants.GET_NOTE_FAIL: {
    return {
      ...state,
      err: action.err,
    };
  }
  case constants.GET_NOTES_BY_COMPANY:{
    return {
      ...state,
      loading:true,
    };
  }
  case constants.GET_NOTES_BY_COMPANY_SUCCESS:{

    let companyId = null;

    if (action.result.length) {
      companyId = action.result[0].notableId;
    }

    if (companyId) {
      let byCompanyMap = {};
      byCompanyMap[companyId] = action.result.map((note) => note.id);
      let companyMap = {};
      action.result.map((c) => {
        companyMap[c.id] = c;
      });

      return {
        ...state,
        byCompanyId: state.byCompanyId.mergeDeep(byCompanyMap),
        list: state.list.mergeDeep(companyMap),
        loading:false,
      };

    }

    return {
      ...state,
      loading:false,
    };
  }
  case constants.GET_NOTES_BY_COMPANY_FAIL:{
    return {
      ...state,
      loading:false,
    };
  }
  case constants.CREATE_NOTE:{
    action.note = action.note.set('saving',true);
    action.note = action.note.set('savingError',null);
    return {
      ...state,
      saving:true,
      savingError:'',
      localNote: action.note,
    };
  }
  case constants.CREATE_NOTE_SUCCESS:{
    let noteMap = {};
    action.result.saving = false;
    action.result.savingError = '';
    noteMap[action.result.id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(noteMap),
      loading:false,
      localNote: new Immutable.Map(action.result),
      saving:false,
      savingError:'',
    };
  }
  case constants.CREATE_NOTE_FAIL:{
    action.note = action.note.set('saving',true);
    action.note = action.note.set('savingError', (action.error && action.error.error && action.error.error.message) || 'Failed to create note');

    return {
      ...state,
      saving:false,
      savingError:'Failed to create note',
      localNote: action.note,
    };
  }
  case constants.UPDATE_NOTE:{
    action.note = action.note.set('saving',true);
    action.note = action.note.set('savingError',null);
    return {
      ...state,
      saving:true,
      savingError:'',
      localNote: action.note,
    };
  }
  case constants.UPDATE_NOTE_SUCCESS:{
    let noteMap = {};
    action.result.saving = false;
    action.result.savingError = '';
    noteMap[action.result.id] = action.result;

    return {
      ...state,
      list: state.list.mergeDeep(noteMap),
      loading:false,
      localNote: new Immutable.Map(action.result),
      saving:false,
      savingError:'',
    };
  }
  case constants.UPDATE_NOTE_FAIL:{
    action.note = action.note.set('saving',true);
    action.note = action.note.set('savingError', (action.error && action.error.error && action.error.error.message) || 'Failed to create note');

    return {
      ...state,
      saving:false,
      savingError:'Failed to create note',
      localNote: action.note,
    };
  }
  case constants.DELETE_NOTE_SUCCESS: {
    return {
      ...state,
      list: state.list.delete(state.localNote.get('id')),
      byCompanyId: state.byCompanyId.delete(state.localNote.get('id')),
      loading: false,
      localNote: state.localNote.mergeDeep({deleted:true}),
    };
  }
  case constants.DELETE_NOTE_FAIL:{
    return {
      ...state,
      loading:false,
    };
  }
  case constants.CREATE_NOTE_LOCAL: {

    return {
      ...state,
      localNote: state.localNote.mergeDeep(action.result),
    };
  }
  case constants.UPDATE_NOTE_LOCAL:{

    return {
      ...state,
      localNote: state.localNote.mergeDeep(action.result),
    };
  }
  case constants.REPLACE_NOTE_LOCAL:{
    return {
      ...state,
      localNote: new Immutable.Map(action.result),
    };
  }
  default:
    return state;
  }
}
