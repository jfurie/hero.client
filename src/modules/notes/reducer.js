import Immutable from 'immutable';
import * as constants from './constants';
const initialState = {
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
  localNote: new Immutable.Map(),
};

// TMP FAKE NOTES

//let FAKENOTES = {};

// FAKENOTES['1a'] = {
//   title: 'Android Mobile Engineer',
//   location: 'Santa Monica, CA',
//   id: '1a',
// };
//
// FAKENOTES['2b'] = {
//   title: 'Software Ruby Engineer',
//   location: 'Venice, CA',
//   id: '2b',
// };

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
      companyId = action.result[0].companyId;
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
    return {
      ...state,
      loading:true,
    };
  }
  case constants.CREATE_NOTE_SUCCESS:{
    let noteMap = {};
    noteMap[action.result.id] = action.result;
    let byCompanyMap ={};
    byCompanyMap[action.result.companyId] = [action.result.id];
    return {
      ...state,
      list: state.list.mergeDeep(noteMap),
      byCompanyId: state.byCompanyId.mergeDeep(byCompanyMap),
      loading:false,
      localNote: state.localNote.mergeDeep({success:true}),
    };
  }
  case constants.CREATE_NOTE_FAIL:{
    return {
      ...state,
      loading:false,
    };
  }
  case constants.UPDATE_NOTE_SUCCESS:{
    let noteMap = {};
    noteMap[action.result.id] = action.result;
    let byCompanyMap ={};
    byCompanyMap[action.result.companyId] = [action.result.id];
    return {
      ...state,
      list: state.list.mergeDeep(noteMap),
      byCompanyId: state.byCompanyId.mergeDeep(byCompanyMap),
      loading:false,
      localNote: state.localNote.mergeDeep({success:true}),
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
  case constants.UPDATE_NOTE_IMAGE_LOCAL:{

    return{
      ...state,
      localNote: state.localNote.mergeDeep({
        isUploading:true,
        percentUploaded:0
      }),

    };
  }
  case constants.UPDATE_NOTE_IMAGE_LOCAL_SUCCESS:{
    let image = {
      imageId:action.result.id,
      isUploading:false,
      percentUploaded:100
    };
    return{
      ...state,
      localNote: state.localNote.mergeDeep(image),
    };
  }
  case constants.UPDATE_NOTE_IMAGE_LOCAL_PROGRESS:{
    let image = {
      isUploading:true,
      percentUploaded:action.result
    };
    return{
      ...state,
      localNote: state.localNote.mergeDeep(image),
    };
  }
  case constants.UPDATE_NOTE_IMAGE_LOCAL_FAIL:{
    return{
      ...state
    };
  }
  default:
    return state;
  }
}
