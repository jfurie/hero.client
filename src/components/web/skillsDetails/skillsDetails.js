import React from 'react';
import {} from '../';
import {
EnhancedButton
} from 'material-ui';
const style = {
  stacks:{
    backgroundColor:'rgba(51,51,51,.1)',
    paddingLeft:'8px',
    paddingTop:'8px',
    borderRadius:'5px',
    marginBottom:'8px',
    position:'relative',
    width:'272px',
  },
  stackSkill:{
    backgroundColor:'#333333',
    borderRadius:'3px',
    display:'inline-block',
    width:'69px',
    height:'33px',
    lineHeight:'33px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight:'8px',
    marginBottom:'8px',
    fontSize:'12px',
    color:'#ffffff',
    textAlign:'center',
    paddingLeft:'8px',
    paddingRight:'8px',
    position:'relative',
  },
  stackSkillInActive:{
    backgroundColor:'#CCCCCC',
    borderRadius:'3px',
    display:'inline-block',
    width:'69px',
    height:'33px',
    lineHeight:'33px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight:'8px',
    marginBottom:'8px',
    fontSize:'12px',
    color:'#ffffff',
    textAlign:'center',
    paddingLeft:'8px',
    paddingRight:'8px',
    position:'relative',
  },
  stackTitle:{
    fontSize:'13px',
    color:'#000000',
    marginBottom:'8px',

  },
};
export default class ContactCategoryToggle extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let self = this;
    let {category, contactCategory} = this.props;
    return (
      <div style={style.stacks}>

        <div style={style.stackTitle}>{category.get('shortTitle')}</div>
        <div>
          {category.get('frameworkArr').map(function(framework){
            let styleActive= style.stackSkillInActive;
            if(contactCategory.get('frameworkInclude').indexOf(framework) > -1){
              styleActive= style.stackSkill;
            }
            return (
                <div title={framework} style={styleActive}>
                  <EnhancedButton onTouchTap={self.toggleSkill.bind(self,framework,contactCategory)} style={{color:'#ffffff', width:'100%',    whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'}}>
                  {framework}
                  </EnhancedButton>
                </div>
              );
          })}
        </div>
        {this.renderToggle.bind(this)(category,contactCategory)}
      </div>);
  }
}
