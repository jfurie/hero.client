export default function getCompanyDataFromState(state, companyId) {

  let company = ((state.companies.get('list').size > 0) ? (state.companies.get('list').get(companyId)) : (null));

  if (company) {
    let isFavorited = false;

    if (state.favorites.get('list').filter(x => {
      return x.get('favorableId') == company.get('id');
    }).size > 0) {
      isFavorited = true;
    }

    company = company.set('isFavorited', isFavorited);

    let locations = state.locations.list.filter(x => {
      return x.get('locatableType') == 'company' && x.get('locatableId') == company.get('id');
    });

    company = company.set('locations', locations);
  }

  return company;
}
