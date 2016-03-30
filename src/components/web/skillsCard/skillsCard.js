import {Giffer, SkillsGraph, SkillsDetails } from '../../../components/web';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
  CardTitle, CardText, Card, Styles, Avatar, FontIcon
} from 'material-ui';
import React from 'react';
import categoryLinkSort from '../../../utils/categoryLinkSort';

function setGiffers(skills, categories){
  let gifferList = new Immutable.List();
  let gifferItems = skills.groupBy(x=>x.get('experience')).sort((x,y)=>{
    if(x.get(0).get('experience') > y.get(0).get('experience')){
      return -1;
    } else{
      return 1;
    }
  }).first();
  if(gifferItems){
    gifferList = new Immutable.List(gifferItems.map(skill=>{
      let category = categories.find(x=>x.get('id') == skill.get('categoryId'));
      if(category){
        return new Immutable.fromJS({
          key:category.get('imageUrl'),
          url:category.get('imageUrl'),
          width:'80px',
          height:'80px',
          title:category.get('title')
        });
      } else {
        return new Immutable.fromJS({
        });
      }

    }));
  }
  return gifferList;
}

@connect((state) =>
{
  return {categories: state.categories.list};
})
export default class ContactDetails extends React.Component {
  render(){
    let primary = new Immutable.List();
    let secondary = new Immutable.List();
    let all = new Immutable.List();
    let skills = this.props.skills;
    if(skills){
      primary = skills.filter(x=>x.get('primary') && x.get('experience') > 0).sort(categoryLinkSort);
      secondary = skills.filter(x=>!x.get('primary') && x.get('experience') > 0).sort(categoryLinkSort);
      all = skills.filter(x=>x.get('experience') > 0).sort(categoryLinkSort);
    }
    let gifferList = setGiffers(primary, this.props.categories);
    let gifferList2 = setGiffers(secondary, this.props.categories);

    let showPrimary = primary && primary.size > 0;
    let showSecondary = secondary && secondary.size > 0;
    let showAll = all && all.size > 0 && all.filter(x => { return x.get('frameworkInclude') && x.get('frameworkInclude').size > 0; }).size > 0;

    return ((primary && primary.size > 0) || (secondary && secondary.size > 0) || (all && all.size > 0) ?
        <Card>
          {
            showPrimary ?
            <CardTitle title="Primary Skills" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
            : (null)
          }
          {
            showPrimary ?
            <CardText style={{margin:'24px', paddingBottom:'0px'}}>
            <div style={{display:'flex'}}>
              <div style={{flex:'1 0 0',position:'relative'}}>
                <SkillsGraph skills={primary} title="Javascript" experience={1} />
              </div>
              <div style={{flex:'0 0 96px'}}>
                <Giffer interval={5000} items={gifferList} />
              </div>
            </div>
            </CardText>
            : (null)
          }
          {
            showSecondary ?
            <CardTitle title="Secondary Skills" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
            : (null)
          }
          {
            showSecondary ?
            <CardText style={{margin:'24px', paddingBottom:'0px'}}>
              <div style={{display:'flex'}}>
                <div style={{flex:'1 0 0',position:'relative'}}>
                  <SkillsGraph skills={secondary} title="Javascript" experience={1} />
                </div>
                <div style={{flex:'0 0 96px'}}>
                  <Giffer interval={5000} items={gifferList2} />
                </div>
              </div>
            </CardText>
            : (null)
          }
          {
            showAll ?
            <CardTitle title="Stacks/Frameworks" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
            : (null)
          }
          {
            showAll ?
            <CardText>
            <div style={{display:'flex'}}>
              <div style={{flex:'0 0 56px'}}>
                <Avatar
                    icon={<FontIcon className="material-icons">layers</FontIcon>}
                    color={Styles.Colors.grey600}
                    backgroundColor={Styles.Colors.white}
                />
              </div>
              <div style={{display: 'inline-block', position:'relative'}}>
                {all.map(skill=>{
                  let category = this.props.categories.find(x=>x.get('id') == skill.get('categoryId'));
                  return (skill.get('frameworkInclude') && skill.get('frameworkInclude').size > 0 ?
                    <SkillsDetails
                        isEdit={false}
                        category={category}
                        contactCategory={skill}
                    /> : (null)
                  );
                })}
              </div>
            </div>
            </CardText>
            : (null)
          }
        </Card>
        : (null)
      );
  }
}
