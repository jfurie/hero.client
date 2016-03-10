import * as constants from './constants';

// function getFavorites(context){


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
      }
    });
  };
}
