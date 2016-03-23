import React from 'react';
import {} from '../';
import {
EnhancedButton, Toggle
} from 'material-ui';
const style = {
  stacks:{
    backgroundColor:'rgba(51,51,51,.1)',
    paddingLeft:'8px',
    paddingTop:'8px',
    borderRadius:'5px',
    marginBottom:'8px',
    position:'relative',
    width:'263px',
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

  _handleToggle(categoryItem, currentContactCategory,e, value){
    currentContactCategory = currentContactCategory.set('primary',value);
    this.props.setPrimary(this.props.item.get('id'),currentContactCategory, categoryItem);
  }
  toggleSkill(framework,contactCategory){
    var indexofInclude = contactCategory.get('frameworkInclude').indexOf(framework);
    if(indexofInclude > -1){
      contactCategory = contactCategory.setIn(['frameworkInclude'],
        contactCategory.get('frameworkInclude').filter(function(frameworkInc){
          return frameworkInc !== framework;
        })
      );
    } else {
      contactCategory = contactCategory.setIn(['frameworkInclude',contactCategory.get('frameworkInclude').length],framework);
    }
    this.props.setFrameworks(this.props.item.get('id'),contactCategory);
  }
  renderToggle(categoryItem,currentContactCategory){
    if(currentContactCategory.get('experience') > 0 ){
      return (<div style={{position:'absolute', right:'24px', top:'4px'}}>
                <Toggle
                  labelStyle={{color:'rgba(0, 0, 0, .56)',fontSize:'12px', fontWeight:'300'}}
                  label="Is primary?"
                  labelPosition="left"
                  toggled ={currentContactCategory.get('primary')}
                  onToggle={this._handleToggle.bind(this,categoryItem, currentContactCategory)}
                />
            </div>);
    } else {
      return (<div></div>);
    }
  }

  render(){
    let self = this;
    let {category, contactCategory, isEdit} = this.props;
    return (
      <div style={style.stacks}>

        <div style={style.stackTitle}>{category.get('shortTitle')}</div>
        <div>
          {category.get('frameworkArr').map(function(framework){
            let styleActive= style.stackSkillInActive;
            let isActive = false;
            if(contactCategory.get('frameworkInclude').indexOf(framework) > -1){
              styleActive= style.stackSkill;
              isActive = true;
            }
            if(!isActive && !isEdit){
              return (<span></span>);
            } else {
              return (
                  <div title={framework} style={styleActive}>
                    {isEdit?(<EnhancedButton onTouchTap={self.toggleSkill.bind(self,framework,contactCategory)} style={{color:'#ffffff', width:'100%',    whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'}}>
                    {framework}
                    </EnhancedButton>):(
                      <span>{framework}</span>

                    )}
                  </div>
                );
            }

          })}
        </div>
        {isEdit ?this.renderToggle.bind(this)(category,contactCategory): <span></span>}
      </div>);
  }
}
