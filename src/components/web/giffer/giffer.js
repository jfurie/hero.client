
import './giffer.scss';
import React from 'react';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
export default class Giffer extends React.Component {

  constructor(props){
    super(props);
    this.state = {index:0, interval:0};
    this.timeout = this.timeout.bind(this);
  }
  timeout(){
    let self = this;
    clearInterval(self.state.interval);
    let currentInterval = setInterval(function(){
      let total = self.props.items.size;
      let current = self.state.index + 1;
      if(current >= total){
        current = 0;
      }
      self.setState({index:current});
    },this.props.interval || 2000);
    self.setState({interval:currentInterval});
  }
  componentWillMount(){
    this.timeout();
  }
  componentWillUnmount(){
    clearInterval(this.state.interval);
  }
  render(){
    if(this.props.items && this.props.items.size > 0){
      let item = this.props.items.get(this.state.index);

      let renderItem = (<img key={item.get('url')} style={{width:item.get('width')||'80px', height:item.get('height')||'80px', position:'absolute'}} src={item.get('url')} />);
      return (
        <div style={{width:item.get('width')||'80px', height:item.get('height')||'80px', marginLeft:'16px',position:'relative'}}>
          <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
            {renderItem}
          </ReactCSSTransitionGroup>
        </div>
      );
    } else {
      return (<span></span>);
    }

  }
}
