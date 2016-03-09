
import React from 'react';

let style = {
  layout: {
    position: 'relative',
  },
  leftContent:{
    display:'flex',
    alignItems: 'stretch',
    position:'relative',
  },
  imageLayout:{
    flex:'0 0 50px',
  },
  contactsLayout:{
    flex:'0 0 150px',
    marginTop:'8px',
  },
  starLayout:{
    flex:'0 0 150px',
  },
  title:{
    color: 'rgba(0, 0, 0, 0.870588)',
    fontSize: '16px',
    lineHeight: '16px',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  subtitle:{
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '14px',
    lineHeight: '18px',
    textAlign: 'left',
  },
  rightContent: {
    position: 'absolute',
    top: 0,
    right: 0,
  }
};

export default class CardBasic extends React.Component {
  click(...args){
    if(this.props.onTouchTap){
      this.props.onTouchTap(...args);
    }
  }
  clickRight(...args){
    if(this.props.onTouchTapRightContent){
      this.props.onTouchTapRightContent(...args);
    }
  }
  render(){
    return (
      <div style={style.layout}>
        <div onTouchTap={this.click.bind(this)} style={style.leftContent}>
          <div style={style.imageLayout}>
            {this.props.image}
          </div>
          <div>
            <div style={style.title}>
                {this.props.title}
            </div>
            <div style={style.subtitle}>
                {this.props.subtitle1}
            </div>
            <div style={style.subtitle}>
                {this.props.subtitle2}
            </div>
          </div>
        </div>
        <div style={style.rightContent}>
          {this.props.rightContent}
        </div>
      </div>
    );
  }
}
