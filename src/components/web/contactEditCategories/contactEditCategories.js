import React from 'react';
import Immutable from 'immutable';
import {ContactCategoryToggle, SkillsDetails} from '../';
import {
   IconButton, ToolbarGroup, Toolbar, Toggle,
  FlatButton, ToolbarTitle, Styles,CardText,Avatar, FontIcon,
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
  sectionTitle:{
    color:'#747474',
    fontSize:'16px',
    marginTop:'16px',
    marginBottom:'16px',
    marginLeft:'16px',
    textAlign:'left',
  }
};
export default class ContactEditCategoriesContainer extends React.Component {

  constructor(props){
    super(props);
    this._handleClose = this._handleClose.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.handleResize = this.handleResize.bind(this);
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.state ={'windowWidth':clientWidth};
  }
  _handleClose(){
    this.props.history.goBack();
  }
  _handleSubmit(){
    this.props.history.goBack();
  }
  handleResize(){
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.setState({'windowWidth':clientWidth});
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  _handleChange(categoryItem, currentContactCategory, value){
    console.log(value);
    currentContactCategory = currentContactCategory.set('experience',value);
    this.props.setExperience(this.props.item.get('id'),currentContactCategory, categoryItem);
  }
  _handleToggle(categoryItem, currentContactCategory,e, value){
    currentContactCategory = currentContactCategory.set('primary',value);
    this.props.setPrimary(this.props.item.get('id'),currentContactCategory, categoryItem);
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
  renderStacks(contactCategory,category){
    return (<SkillsDetails
      isEdit={true}
      category={category}
      item={this.props.item}
      setPrimary={this.props.setPrimary.bind(this)}
      setFrameworks={this.props.setFrameworks.bind(this)}
      contactCategory={contactCategory}
     />);
    // return (
    //
    //   <div style={style.stacks}>
    //
    //     <div style={style.stackTitle}>{category.get('shortTitle')}</div>
    //     <div>
    //       {category.get('frameworkArr').map(function(framework){
    //         var styleActive= style.stackSkillInActive;
    //         if(contactCategory.get('frameworkInclude').indexOf(framework) > -1){
    //           styleActive= style.stackSkill;
    //         }
    //         return (
    //             <div title={framework} style={styleActive}>
    //               <EnhancedButton onTouchTap={self.toggleSkill.bind(self,framework,contactCategory)} style={{color:'#ffffff', width:'100%',    whiteSpace: 'nowrap',
    //                   overflow: 'hidden',
    //                   textOverflow: 'ellipsis'}}>
    //               {framework}
    //               </EnhancedButton>
    //             </div>
    //           );
    //       })}
    //     </div>
    //     {this.renderToggle.bind(this)(category,contactCategory)}
    //   </div>);
  }
  render(){
    console.log(this.props.item);
    if(this.state.windowWidth > 768){
      style.toolbarInline.width ='375px';
    } else {
      style.toolbarInline.width = '100%';
    }
    return (
      <div >
        <Toolbar style={style.toolbarInline}>
          <ToolbarGroup key={0} float="left">
            <IconButton onTouchTap={this._handleClose} style={style.toolbarIcon} iconClassName="material-icons">close</IconButton>
            <ToolbarTitle style={style.toolbarTitle} text="Skills" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FlatButton onTouchTap={this._handleSubmit} style={style.toolbarFlat}>Save</FlatButton>
          </ToolbarGroup>
        </Toolbar>
        <div style={{height:'64px'}}></div>

        <div style={{paddingTop:'16px', backgroundColor:'#ffffff', borderBottom:'1px solid #ffffff'}}>
          <div style={style.sectionTitle}>Primary/Secondary Skills</div>
          {this.props.categories.map(categoryItem =>{
            let currentContactCategory =this.props.skills && this.props.skills.find(x=>x.get('categoryId') == categoryItem.get('id'))|| new Immutable.Map();
            return (<div style={{marginBottom:'24px'}}>
            <CardText style={{padding:'24px', paddingBottom:'0px'}}>
              <ContactCategoryToggle
                categoryItem={categoryItem}
                contactCategory={currentContactCategory}
                onChange={this._handleChange.bind(this)}
                 />
            </CardText>

              {currentContactCategory.get('experience') >0 && categoryItem.get('frameworkArr').length > 0 ?(<CardText>
                <div style={{display:'flex'}}>
                  <div style={{flex:'0 0 65px'}}>
                    <Avatar
                        icon={<FontIcon className="material-icons">layers</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />
                  </div>
                  <div style={{display: 'inline-block', position:'relative'}}>
                    {this.renderStacks(currentContactCategory,categoryItem)}
                  </div>
                </div>
              </CardText>):(<span></span>)}

              <div>

              </div>
            </div>);
          })}
        </div>
      </div>
    );
  }

}
