import React from 'react';
import marked from 'marked';
import './markedViewer.scss';
export default class MarkedViewer extends React.Component {
  render(){
    let value = this.props.value;
    try{
      value = marked(value);
    } catch (ex){
      console.log('failed to parse markdown');
    }
    return (
      <div className="marked">
        <div dangerouslySetInnerHTML={{__html: value}} />
      </div>);
  }
}
