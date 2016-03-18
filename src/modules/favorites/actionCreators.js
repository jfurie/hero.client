import * as constants from './constants';

export function getFavoritesByUserId(userId){
  return (dispatch) => {
    return dispatch({
      types:[constants.GET_FAVORITES, constants.GET_FAVORITES_SUCCESS, constants.GET_FAVORITES_FAIL],
      promise:(client,auth) => {
        let filter= {where:{userId}};
        let filterString = encodeURIComponent(JSON.stringify(filter));
        return client.api.get(
          `/favorites?filter=${filterString}`,
          {authToken: auth.authToken},
          ).then(response => {
            return response;
          });
      },
    });
  };
}

export function getFavoriteByType(favorableType, favorableId){
  return (dispatch) => {
    return dispatch({
      types:[constants.GET_FAVORITE_BY_TYPE, constants.GET_FAVORITE_BY_TYPE_SUCCESS, constants.GET_FAVORITE_BY_TYPE_FAIL],
      promise:(client,auth) => {
        let filter= {where:{favorableType, favorableId}};
        let filterString = encodeURIComponent(JSON.stringify(filter));
        return client.api.get(
          `/favorites?filter=${filterString}`,
          {authToken: auth.authToken},
          ).then(response => {
            return response;
          });
      },
    });
  };
}

export function createCompanyFavorite(companyId){
  return {
    types: [constants.CREATE_COMPANY_FAVORITE, constants.CREATE_COMPANY_FAVORITE_SUCCESS, constants.CREATE_COMPANY_FAVORITE_FAIL],
    promise: (client, auth) => client.api.post(`/companies/${companyId}/favorites`, {
      authToken: auth.authToken,
    }),
  };
}

export function deleteCompanyFavorite(companyId){
  return {
    types: [constants.DELETE_COMPANY_FAVORITE, constants.DELETE_COMPANY_FAVORITE_SUCCESS, constants.DELETE_COMPANY_FAVORITE_FAIL],
    promise: (client, auth) => client.api.del(`/companies/unfavorite?id=${companyId}`, {
      authToken: auth.authToken,
    }),
  };
}

export function createContactFavorite(contactId){
  return (dispatch) => {
    dispatch({
      types: [constants.CREATE_CONTACT_FAVORITE, constants.CREATE_CONTACT_FAVORITE_SUCCESS, constants.CREATE_CONTACT_FAVORITE_FAIL],
      promise: (client, auth) => client.api.post(`/contacts/${contactId}/favorites`, {
        authToken: auth.authToken,
      }).then(function (favorite) {
        return favorite;
      }),
    });
  };
}

export function deleteContactFavorite(contactId){
  return (dispatch) => {
    dispatch({
      types: [constants.DELETE_CONTACT_FAVORITE, constants.DELETE_CONTACT_FAVORITE_SUCCESS, constants.DELETE_CONTACT_FAVORITE_FAIL],
      promise: (client, auth) => client.api.del(`/contacts/unfavorite?id=${contactId}`, {
        authToken: auth.authToken,
      }).then(function (favorite) {
        return favorite;
      }),
    });
  };
}
