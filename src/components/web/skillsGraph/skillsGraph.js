import React from 'react';
import {Styles} from 'material-ui';
import { connect } from 'react-redux';

let style={
  container:{
    display: 'flex'
  },
  label:{
    flex:'0 0 150px'
  },
  graph:{
    flex: '1 0 0'
  },
  labelContainer:{
    textAlign:'right',
    paddingRight:'16px'
  },
  labelContainerLabel:{
    lineHeight:'20px',
    height:'20px',
    verticalAlign:'middle'
  },
  labelContainerIcon:{
    flex:'0 0 40px'
  }
};
@connect((state) =>
{
  return {categories: state.categories.list}
})
export default class SkillsGraph extends React.Component {
  //
  // render(){
  //   let percent = this.props.experience * 1.0 / 3.0 * 100.0;
  //   return (
  //     <div style={style.container}>
  //       <div style={style.label}>
  //         <div style={style.labelContainer}>
  //           <div style={style.labelContainerLabel}>{this.props.title}</div>
  //         </div>
  //       </div>
  //       <div style={style.graph}>
  //         <div style={{borderRadius:'4px',width: percent+'%', height:'20px', backgroundColor: '#333333' }}></div>
  //       </div>
  //     </div>
  //   );
  // }
  constructor(props){
    super(props);
    this.state = {
      graphWidth:200
    }
  }
  componentDidMount(){
    console.log('this.refs.widthCheck',this.refs.widthCheck.clientWidth);
    if(this.state.graphWidth !== this.refs.widthCheck.clientWidth){
      this.setState({'graphWidth':this.refs.widthCheck.clientWidth});
    }
  }
  componentDidUpdate(){
    console.log('this.refs.widthCheck.clientWidth',this.refs.widthCheck.clientWidth);
    if(this.state.graphWidth !== this.refs.widthCheck.clientWidth){
      this.setState({'graphWidth':this.refs.widthCheck.clientWidth});
    }

  }
  render(){
    let {skills} = this.props;
    let width = (this.state.graphWidth || 0) -20;
    if(skills.size >0){
      return (
        <div style={{width:'100%', position:'relative'}}>
          <div style={{position:'absolute',top:0,bottom:0,left:0,right:0, zIndex:0}}>
            <div style={{position:'absolute', top:'-20px',bottom:0, right:'-12px', color:'#cccccc', width:'40px'}}>
              Expert
              <div style={{position:'absolute',top:'16px',bottom:0, left:'20px', width:'1px',backgroundColor:'#cccccc'}}></div>
            </div>
            <div style={{position:'absolute', top:'-20px',bottom:0, right:width+'px', color:'#cccccc', width:'40px'}}>
              Novice
              <div style={{position:'absolute',top:'16px',bottom:0, left:'20px', width:'1px',backgroundColor:'#cccccc'}}></div>
            </div>
          </div>
          <div style={{zIndex:1, position:'relative'}}>
            <table style={{width:'100%', tableLayout:'fixed'}}>
              <tbody>
                {skills.map(skill=>{
                  let category = this.props.categories.find(x=>x.get('id') == skill.get('categoryId'));
                  let percent = skill.get('experience') * 1.0 / 3.0 * 100.0;
                  return (
                    <tr style={{width:'100%'}}>
                      <td style={{whiteSpace: 'nowrap', paddingBottom:'1px', paddingRight:'5px',textAlign:'right'}}>{category.get('shortTitle')}</td>
                      <td ref='widthCheck' style={{minWidth:'200px', width:'auto', paddingBottom:'1px'}}>
                         <div style={{borderRadius:'4px',width: percent+'%', height:'20px', backgroundColor: '#333333' }}></div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return (<span></span>)
    }

  }
}
