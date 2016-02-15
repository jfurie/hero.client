
import React from 'react';

let style = {
  layout:{
    display:'flex',
    alignItems: 'stretch',
    position:'relative',
  },
  imageLayout:{
    flex:'0 0 56px',
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
  },
  subtitle:{
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '14px',
    lineHeight: '18px',
  },
};

export default class CardBasic extends React.Component {
  click(...args){
    if(this.props.onTouchTap){
      this.props.onTouchTap(...args);
    }
  }
  render(){
    return (
      <div onTouchTap={this.click.bind(this)} style={style.layout}>
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
        <div style={{position: 'absolute', bottom:'0', right:'0'}}>
          {this.props.stars}
        </div>
      </div>
    );
  }
}
