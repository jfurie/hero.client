import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { getCategoriesIfNeeded } from '../../../modules/categories';
import { getOneJob, setCategoryLocal, setExperience, setPrimary, setFrameworks } from '../../../modules/jobs';
import { ContactEditCategories } from '../../../components/web';
function getData(state, props) {
  let job = state.jobs.get('list').get(props.params.jobId);
  let skills = Immutable.List();
  if(job && job.get('_categoryLinks')){
    skills = job.get('_categoryLinks');
  }
  return {
    categories: state.categories.list,
    item: state.jobs.get('list').get(props.params.jobId),
    skills,
  };
}
@connect(getData, {getCategoriesIfNeeded, getOneJob,setCategoryLocal, setExperience, setPrimary, setFrameworks})
export default class ContactEditCategoriesContainer extends React.Component {

  constructor(props){
    super(props);
  }

  setContactCategories(jobId, props){
    if(props.categories && props.item){
      props.categories.map(function(category){
        let currentContactCategory = null;
        if(props.item && props.item.get('_categoryLinks')){
          currentContactCategory = props.item
          .get('_categoryLinks')
          .find(x=>{
            return x.get('categoryId') == category.get('id');
          });
        }
        if(!currentContactCategory){
          props.setCategoryLocal(
            jobId,
            {
              categoryId:category.get('id'),
              jobId,
              experience:0,
              primary:true,
              frameworkInclude: category.get('frameworkArr') && category.get('frameworkArr').toArray()
            });
        }
      });
    }
  }

  componentDidMount(){
    this.props.getCategoriesIfNeeded();
    this.props.getOneJob(this.props.params.jobId);
    //this.props.getContactCategoriesByContact(this.props.params.jobId);
    this.setContactCategories(this.props.params.jobId,this.props);

  }
  componentWillReceiveProps(newProps){
    if(newProps.params.jobId != this.props.params.jobId){
      this.props.getOneJob(newProps.params.jobId);
      //this.props.getContactCategoriesByContact(newProps.params.jobId);

    }
    this.setContactCategories(newProps.params.jobId,newProps);
  }
  render(){
    return (
    <div>
      <ContactEditCategories
          {...this.props}
      />
    </div>
    );
  }

}
