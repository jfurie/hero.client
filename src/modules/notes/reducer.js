import Immutable from 'immutable';
import * as constants from './constants';
import * as jobConstants from '../jobs/constants';
const initialState = {
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
  byJobId: new Immutable.Map(),
  localNote: new Immutable.Map(),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case constants.GET_NOTES_BY_IDS_SUCCESS: {
    let notesMap = {};
    action.result.map((c) => {
      notesMap[c.id] = c;
    });

    return {
      ...state,
      list: state.list.merge(notesMap),
    };
  }
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
  case constants.GET_NOTES_BY_JOB:{
    return {
      ...state,
      loading:true,
    };
  }
  case constants.GET_NOTES_BY_NOTE_SUCCESS:{

    let jobId = null;

    if (action.result.length) {
      jobId = action.result[0].notableId;
    }

    if (jobId) {
      let byJobMap = {};
      byJobMap[jobId] = action.result.map((note) => note.id);
      let jobMap = {};
      action.result.map((c) => {
        jobMap[c.id] = c;
      });

      return {
        ...state,
        byJobId: state.byCompanyId.mergeDeep(byJobMap),
        list: state.list.mergeDeep(jobMap),
        loading:false,
      };

    }

    return {
      ...state,
      loading:false,
    };
  }
  case constants.GET_NOTES_BY_NOTE_FAIL:{
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
    let notableType = state.localNote.get('notableType');

    return {
      ...state,
      list: state.list.delete(state.localNote.get('id')),
      byCompanyId: notableType == 'company' ? state.byCompanyId.delete(state.localNote.get('id')) : state.byCompanyId,
      byJobId: notableType == 'job' ? state.byJobId.delete(state.localNote.get('id')) : state.byJobId,
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
  case jobConstants.GET_JOB_DETAIL_SUCCESS:{
    let notesMap = {};
    let byJobId = {};
    let job = action.result;
    if(job && job.notes){
      job.notes.map(note =>{
        notesMap[note.id] = note;
        byJobId[note.notableId] = note;
      });
    }
    notesMap = Immutable.fromJS(notesMap);
    byJobId = Immutable.fromJS(byJobId);
    return {
      ...state,
      list: state.list.mergeDeep(notesMap),
      byJobId: state.byJobId.mergeDeep(byJobId),
    };
  }
  default:
    return state;
  }
}
