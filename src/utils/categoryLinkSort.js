export default function sortCategories(a,b){
  if(a.get('primary') == b.get('primary')){
    if(a.get('experience') > b.get('experience')){
      return -1;
    } else if(a.get('experience') < b.get('experience')){
      return 1;
    }else {
      return 0;
    }
  } else if(a.get('primary') && !b.get('primary')){
    return -1;
  } else {
    return 1;
  }
}
