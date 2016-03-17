import React from 'react';
import {SelectToggle} from '../';
export default class ContactCategoryToggle extends React.Component {
  constructor(props){
    super(props);
    this._onChange = this._onChange.bind(this);
  }
  _onChange(value){
    if(this.props.onChange){
      this.props.onChange(this.props.categoryItem,this.props.contactCategory, value);
    }
  }
  render(){
    let skillImg = <img style={{width: '33px', height: '33px'}} src={this.props.categoryItem.get('imageUrl')} />;
    return (
      <div>
        <div style={{position:'relative', color:'rgba(0, 0, 0, .56)',fontSize:'14px', fontWeight:'400', paddingLeft:'0px',paddingTop:'0px', paddingBottom:'8px'}}>
          {this.props.categoryItem.get('shortTitle')}

        </div>
        <div style={{paddingLeft:'58px', position:'relative',paddingRight:'0px'}}>
          <div style={{position:'absolute',left:'0px' ,top:'0px'}}>
            {skillImg}
          </div>
          <SelectToggle
              onChange={this._onChange}
              iconLeft={skillImg}
              value={this.props.contactCategory.get('experience')}
              options={[{value:0,title:'None'},{value:1,title:'Novice'},{value:2,title:'Experienced'},{value:3,title:'Expert'}]} />
        </div>
      </div>

      );
  }
}
