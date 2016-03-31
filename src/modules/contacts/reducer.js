import * as constants from './constants';
import * as companyConstants from '../companies/constants';
import * as jobConstants from '../jobs/constants';
import * as authConstants from '../auth/constants';
import Immutable from 'immutable';
import {actionTypes} from 'redux-localstorage';

const initialState = new Immutable.Map({
  list: new Immutable.Map(),
  byCompanyId: new Immutable.Map(),
  queries: new Immutable.Map(),
  myContactIds: new Immutable.Map(),
  myFavoriteContactIds: new Immutable.Map(),
});

let ContactCategory = new Immutable.Record({
  id:null,
  categoryId:null,
  contactId:null,
  experience:0,
  primary:true,
  frameworkInclude: []
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case actionTypes.INIT:{
    const persistedState = action.payload && action.payload['contacts'];
    if(persistedState){
      return state.set('list',Immutable.fromJS(persistedState.list));
    } else{
      return state;
    }
  }
  case authConstants.LOGOUT:{
    return initialState;
  }
  case constants.GET_CONTACTS_BY_IDS_SUCCESS:{
    let contactsMap = {};
    action.result.map((c) => {
      contactsMap[c.id] = c;
    });
    return state.set('list',state.get('list').merge(contactsMap));
  }
  case constants.GET_CONTACTS:
    return state;
  case constants.GET_CONTACTS_SUCCESS: {
    let contactsMap = {};
    action.result.map((c) => {
      contactsMap[c.id] = c;
    });
    return state.set('list',state.get('list').mergeDeep(contactsMap));
  }
  case constants.GET_CONTACTS_FAIL:
    return state.set('err',action.err);
  case constants.GET_ONE_CONTACT: {
    return state;
  }
  case constants.GET_ONE_CONTACT_SUCCESS: {
    let contactsMap = {};
    let id = action.result.id;
    contactsMap[id] = action.result;

    return state.set('list',state.get('list').merge(contactsMap));
  }
  case constants.GET_ONE_CONTACT_FAIL: {
    return state;
  }
  case constants.GET_CONTACT_CREATED:{
    let contactList = {};
    let contact = {};
    contact.id = action.id;
    contact.saving = true;
    contact.savingError = null;
    contactList[action.id] = contact;
    return state.withMutations(ctx=> {
      ctx
      .set('saving',true)
      .set('savingError','')
      .set('list', state.get('list').mergeDeep(contactList));
    });
  }
  case constants.GET_CONTACT_CREATED_SUCCESS: {
    let contactsMap = {};
    contactsMap[action.result.id] = action.result;
    contactsMap[action.id] = {
      saving: false,
      savingError: '',
    };
    return state.withMutations(ctx=> {
      ctx
      .set('saving',false)
      .set('savingError','')
      .set('list', state.get('list').mergeDeep(contactsMap));
    });
  }
  case constants.GET_CONTACT_CREATED_FAIL: {
    return state.withMutations(ctx=> {
      ctx
      .set('creating',false)
      .set('error','Error Creating Contact');
    });
  }
  case constants.CREATE_CONTACT: {
    let contact = {};
    action.contact = action.contact.set('saving',true);
    action.contact = action.contact.set('savingError',null);
    contact[action.id] = action.contact;
    return state.withMutations(ctx=> {
      ctx
      .set('saving',true)
      .set('savingError','')
      .set('list', state.get('list').mergeDeep(contact));
    });
  }
  case constants.CREATE_CONTACT_SUCCESS: {
    let contactsMap = {};
    contactsMap[action.result.id] = action.result;

    contactsMap[action.id] = {
      saving: false,
      savingError: '',
      newId: action.result.id,
    };
    return state.withMutations(ctx=> {
      ctx
      .set('saving',false)
      .set('savingError','')
      .set('list', state.get('list').mergeDeep(contactsMap));
    });
  }
  case constants.CREATE_CONTACT_FAIL: {
    let contact = {};
    contact[action.id] = {};
    contact[action.id].saving = false;
    contact[action.id].savingError = (action.error && action.error.error && action.error.error.message) || 'Failed to create contact';
    return state.withMutations(ctx=> {
      ctx
      .set('saving',false)
      .set('savingError','Failed to create contact')
      .set('list', state.get('list').mergeDeep(contact));
    });
  }
  case constants.EDIT_CONTACT:
    {
      let contactList ={};
      let contact = {};
      contact.id = action.id;
      contact.saving = true;
      contact.savingError = null;
      contactList[action.id] = contact;
      return state.withMutations(ctx=> {
        ctx
        .set('saving',true)
        .set('savingError','')
        .set('list', state.get('list').mergeDeep(contactList));
      });
    }
  case constants.EDIT_CONTACT_SUCCESS:
    {
      let contactsMap = {};
      contactsMap[action.result.id] = action.result;

      contactsMap[action.id] = {
        saving: false,
        savingError: '',
        newId: action.result.id,
      };
      return state.withMutations(ctx=> {
        ctx
        .set('saving',false)
        .set('savingError','')
        .set('list', state.get('list').mergeDeep(contactsMap));
      });
    }
  case constants.EDIT_CONTACT_FAIL:
    return state.withMutations(ctx=> {
      ctx
      .set('creating',false)
      .set('error','Error Creating Contact');
    });
  case constants.GET_CONTACTS_BY_COMPANY_SUCCESS: {
    let byCompanyMap = {};
    byCompanyMap[action.result.companyId] = action.result.result.map((contact)=>contact.id);
    let contactsMap = {};
    action.result.result.map((c) => {
      contactsMap[c.id] = c;
    });
    return state.withMutations(ctx=> {
      ctx
      .set('byCompanyId', state.get('byCompanyId').mergeDeep(byCompanyMap))
      .set('list', state.get('list').mergeDeep(contactsMap));
    });
  }
  case constants.CREATE_COMPANY_CONTACT: {
    let contact = {};
    if(action.contact){
      action.contact = action.contact.set('saving',true);
      action.contact = action.contact.set('savingError',null);
      contact[action.id] = action.contact;
    }
    return state.withMutations(ctx=> {
      ctx
      .set('saving', true)
      .set('savingError', '')
      .set('list', state.get('list').mergeDeep(contact));
    });
  }
  case constants.CREATE_COMPANY_CONTACT_SUCCESS: {
    let contactMap = {};
    contactMap[action.result.id] = action.result;

    contactMap[action.id] = {
      saving: false,
      savingError: '',
      newId: action.result.contactId,
    };

    let companyId = action.result.companyId;
    let byCompanyMapNew = {};

    byCompanyMapNew[companyId] = state.byCompanyId.get(companyId) || new Immutable.List();
    byCompanyMapNew[companyId] = byCompanyMapNew[companyId].push(action.result.id);
    return state.withMutations(ctx=> {
      ctx
      .set('saving', false)
      .set('savingError', '')
      .set('byCompanyId', state.get('byCompanyId').mergeDeep(byCompanyMapNew))
      .set('list', state.get('list').mergeDeep(contactMap));
    });
  }
  case constants.CREATE_COMPANY_CONTACT_FAIL: {
    let contact = {};
    contact[action.id] = {};
    contact[action.id].saving = false;
    contact[action.id].savingError = (action.error && action.error.error && action.error.error.message) || 'Failed to create contact';
    return state.withMutations(ctx=> {
      ctx
      .set('saving', false)
      .set('savingError', 'Failed to create contact');
    });
  }
  case constants.CREATE_TEMP_CONTACT:{
    let contactsMap = {};
    contactsMap[action.result.id] = action.result;
    return state.withMutations(ctx=> {
      ctx
      .set('list', state.get('list').mergeDeep(contactsMap));
    });
  }
  case companyConstants.GET_COMPANY_SUCCESS:{
    let contactsMap = {};
    if(action.result && action.result.clientAdvocate){
      let id = action.result.clientAdvocate.id;
      contactsMap[id] = action.result.clientAdvocate;
    }
    return state.withMutations(ctx=> {
      ctx
      .set('list', state.get('list').merge(contactsMap));
    });

  }
  case jobConstants.GET_JOB_SUCCESS:{
    let contactsMap = {};
    if(action.result.talentAdvocate){
      let id = action.result.talentAdvocate.id;
      contactsMap[id] = action.result.talentAdvocate;
    }
    if(action.result.contact){
      let id = action.result.contact.id;
      contactsMap[id] = action.result.contact;
    }
    return state.withMutations(ctx=> {
      ctx
      .set('list', state.get('list').merge(contactsMap));
    });
  }
  case jobConstants.GET_MY_JOBS_SUCCESS:
    {
      let contactList =  {};
      action.result.map(job =>{
        job.candidates.map(candidate=>{
          contactList[candidate.contact.id] = candidate.contact;
        });
      });
      return state.withMutations(ctx=> {
        ctx
        .set('list', state.get('list').mergeDeep(contactList));
      });
    }
  case constants.SEARCH_CONTACTS_SUCCESS: {
    let query = action.result.query;

    let queriesMap = {};
    queriesMap[query] = action.result.results;

    return state.withMutations(ctx=> {
      ctx
      .set('queries', state.get('queries').mergeDeep(queriesMap));
    });
  }
  case constants.SEARCH_CONTACTS_FAIL:
    return state.set('err', Immutable.fromJS(action.err));
  case constants.GET_CONTACT_DETAIL: {
    return state;
  }
  case constants.GET_CONTACT_DETAIL_SUCCESS: {
    let contactsMap = {};
    let id = action.result.id;
    contactsMap[id] = action.result;

    return state.withMutations(ctx=> {
      ctx
      .set('list', state.get('list').mergeDeep(contactsMap));
    });
  }
  case constants.GET_CONTACT_DETAIL_FAIL: {
    return state;
  }
  case constants.GET_MY_CONTACTS_SUCCESS: {
    let contactsMap = {};
    action.result.map((c) => {
      contactsMap[c.id] = c;
    });
    return state.withMutations(ctx=> {
      ctx
      .set('byCompanyId', state.get('byCompanyId').mergeDeep(contactsMap))
      .set('list', state.get('list').mergeDeep(contactsMap));
    });
  }
  case constants.GET_MY_FAVORITE_CONTACTS_SUCCESS: {
    let contactsMap = {};
    action.result.map((c) => {
      contactsMap[c.id] = c;
    });
    return state.withMutations(ctx=> {
      ctx
      .set('myFavoriteContactIds', state.get('myFavoriteContactIds').mergeDeep(contactsMap))
      .set('list', state.get('list').mergeDeep(contactsMap));
    });
  }
  case constants.CREATE_CONTACT_FAVORITE_SUCCESS: {
    let contact = state.get('list').get(action.result.favorableId);

    if (contact) {
      contact = contact.set('isFavorited', true);

      let contactMap = {};
      contactMap[contact.get('id')] = contact;
      return state.withMutations(ctx=> {
        ctx
        .set('myFavoriteContactIds', state.get('myFavoriteContactIds').mergeDeep(contactMap))
        .set('myContactIds', state.get('myContactIds').mergeDeep(contactMap));
      });
    }
    else {
      return state;
    }
  }
  case constants.DELETE_CONTACT_FAVORITE_SUCCESS: {
    let contact = state.get('list').get(action.result.favorableId);

    if (contact) {
      contact = contact.set('isFavorited', false);

      let contactMap = {};
      contactMap[contact.get('id')] = contact;
      return state.withMutations(ctx=> {
        ctx
        .set('list', state.get('list').mergeDeep(contactMap))
        .set('myFavoriteContactIds', state.get('myFavoriteContactIds').delete(action.result.favorableId))
        .set('myContactIds', state.get('myContactIds').mergeDeep(contactMap));
      });
    }
    else {
      return state;
    }
  }
  case constants.SET_EXPERIENCE:{
    let contactCategory = action.result;
    state = state.updateIn(['list',action.contactId,'_categoryLinks'],arr =>{
      let returnArr = null;
      if(!arr){
        arr = new Immutable.List();
      }
      let row = arr.findEntry(x=> x.get('categoryId') == contactCategory.categoryId);
      if(row){
        let newItem = row[1].set('experience',contactCategory.experience);
        returnArr = arr.set(row[0],newItem);
      } else {
        returnArr = arr;
      }
      return returnArr;
    });

    return state;
  }
  case constants.SET_CONTACT_CATEGORIES_LOCAL:{
    //find current contact
    let contactCategory = action.result;
    state = state.updateIn(['list',action.contactId,'_categoryLinks'],arr =>{
      let returnArr = null;
      if(!arr){
        arr = new Immutable.List();
      }
      let row = arr.findEntry(x=> x.get('categoryId') == contactCategory.categoryId);
      if(!row){
        returnArr = arr.push( new ContactCategory(contactCategory));
      } else {
        returnArr = arr.set(row[0],new ContactCategory(contactCategory));
      }
      return returnArr;
    });
    return state;
  }
  case constants.SET_PRIMARY:{
    let contactCategory = action.result;
    state= state.updateIn(['list',action.contactId,'_categoryLinks'],arr =>{
      let returnArr = null;
      if(!arr){
        arr = new Immutable.List();
      }
      let row = arr.findEntry(x=> x.get('categoryId') == contactCategory.categoryId);
      if(row){
        let newItem = row[1].set('primary',contactCategory.primary);
        returnArr = arr.set(row[0],newItem);
      } else {
        returnArr = arr;
      }
      return returnArr;
    });
    return state;
  }
  case constants.CREATE_CONTACT_CATEGORY_SUCCESS:{
    let contactCategory = action.result.response;
    let contactId = action.result.contactId;
    state = state.updateIn(['list',contactId,'_categoryLinks'],arr =>{
      let returnArr = null;
      if(!arr){
        arr = new Immutable.List();
      }
      let row = arr.findEntry(x=> x.get('categoryId') == contactCategory.categoryId);
      if(row){
        returnArr = arr.set(row[0],new ContactCategory(Immutable.fromJS(contactCategory)));
      } else {
        returnArr = arr;
      }
      return returnArr;
    });
    return state;
  }
  case constants.EDIT_CONTACT_CATEGORY_SUCCESS:{
    let contactCategory = action.result.response;
    let contactId = action.result.contactId;
    state = state.updateIn(['list',contactId,'_categoryLinks'],arr =>{
      let returnArr = null;
      if(!arr){
        arr = new Immutable.List();
      }
      let row = arr.findEntry(x=> x.get('categoryId') == contactCategory.categoryId);
      if(row){
        returnArr = arr.set(row[0],new ContactCategory(Immutable.fromJS(contactCategory)));
      } else {
        returnArr = arr;
      }
      return returnArr;
    });
    return state;
  }
  case jobConstants.GET_JOB_DETAIL_SUCCESS:{
    let contacts = {};
    let job = action.result;
    if(job){
      if(job.candidates){
        job.candidates.map(candidate =>{
          if(candidate.contact){
            contacts[candidate.contact.id] = candidate.contact;
          }
        });
      }
      if(job.company && job.company.talentAdvocate){
        contacts[job.company.talentAdvocate.id] = job.company.talentAdvocate;
      }
    }
    contacts = Immutable.fromJS(contacts);
    return state.mergeDeepIn(['list'],contacts);
  }
  default:
    return state;
  }
}
