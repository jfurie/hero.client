import React from 'react';
import Immutable from 'immutable';
import {SelectToggle} from '../';
import {
   IconButton, ToolbarGroup, Toolbar, Toggle,
  FlatButton, ToolbarTitle, Styles,
} from 'material-ui';

const style = {
  error: {
    float: 'left',
  },
  divider:{
    marginTop:'16px',
  },
  subheader:{
    color: Styles.Colors.grey600,
    fontSize:'14px',
    marginTop:'16px',
    marginBottom:'16px',
    marginLeft:'16px',
    textAlign:'left',
  },
  textField: {
    'width': '100%',
  },
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
  },
  bodyStyle: {
    paddingTop: '0px',
    height: '100%',
    padding: '0',
  },
  contentStyle: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    top: '-64px',
  },
  toolbar: {
    backgroundColor: '#ffffff',
    height: '64px',
  },
  toolbarInline:{
    backgroundColor: '#ffffff',
    height: '64px',
    position:'fixed',
    zIndex:'1000',
  },
  toolbarIcon: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  toolbarFlat: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  toolbarTitle: {
    lineHeight:'64px',
    float:'left',
  },
  select: {
    textAlign: 'left',
    color: '#000',
  },
  floatLabel: {
    top: '12px',
    color: 'rgba(0, 0, 0, 0.298039)',
    fontSize: '12px',
    transform: 'none',
  },
};
export default class ContactEditCategoriesContainer extends React.Component {

  constructor(props){
    super(props);
    this._handleClose = this._handleClose.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }
  _handleClose(){

  }
  _handleSubmit(){

  }
  _handleChange(categoryItem, currentContactCategory, value){
    console.log(value);
    currentContactCategory = currentContactCategory.set('experience',value);
    this.props.setExperience(this.props.contact.get('id'),currentContactCategory, categoryItem);
  }
  _handleToggle(categoryItem, currentContactCategory,e, value){
    currentContactCategory = currentContactCategory.set('primary',value);
    this.props.setPrimary(this.props.contact.get('id'),currentContactCategory, categoryItem);
  }
  renderToggle(categoryItem,currentContactCategory){
    if(currentContactCategory.get('experience') > 0 ){
      return (<div style={{position:'absolute', right:'16px', top:'-4px'}}>
                <Toggle
                  labelStyle={{color:'rgba(0, 0, 0, .56)',fontSize:'14px', fontWeight:'300'}}
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
    console.log(this.props.contact);

    return (
      <div >
        <Toolbar style={style.toolbarInline}>
          <ToolbarGroup key={0} float="left">
            <IconButton onTouchTap={this._handleClose} style={style.toolbarIcon} iconClassName="material-icons">close</IconButton>
            <ToolbarTitle style={style.toolbarTitle} text="Edit Categories" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FlatButton onTouchTap={this._handleSubmit} style={style.toolbarFlat}>Save</FlatButton>
          </ToolbarGroup>
        </Toolbar>
        <div style={{height:'64px'}}></div>
        <div style={{paddingTop:'16px', backgroundColor:'#ffffff'}}>
          {this.props.categories.map(categoryItem =>{
            let skillImg = <img style={{width: '33px', height: '33px'}} src={categoryItem.get('imageUrl')} />;
            let currentContactCategory =this.props.contact && this.props.contact.get('_contactCategories').find(x=>x.get('categoryId') == categoryItem.get('id'))|| new Immutable.Map();
            return (<div>
              <div style={{position:'relative', color:'rgba(0, 0, 0, .56)',fontSize:'14px', fontWeight:'400', paddingLeft:'16px',paddingTop:'0px', paddingBottom:'8px'}}>
                {categoryItem.get('shortTitle')}
                {this.renderToggle.bind(this)(categoryItem,currentContactCategory)}
              </div>
              <div style={{paddingLeft:'79px', position:'relative',marginBottom:'16px',paddingRight:'16px'}}>
                <div style={{position:'absolute',left:'16px' ,top:'0px'}}>
                  {skillImg}
                </div>
                <SelectToggle onChange={this._handleChange.bind(this,categoryItem, currentContactCategory)} iconLeft={skillImg} value={currentContactCategory.get('experience')} options={[{value:0, title:'None'},{value:1,title:'Novice'},{value:2,title:'Experience'},{value:3,title:'Expert'}]} ></SelectToggle>
              </div>


            </div>);
          })}
        </div>
      </div>
    );
  }

}
