import React from 'react';
import {Dialog as DialogUI } from 'material-ui';

class Dialog extends React.Component {
  constructor(props){
    super(props);
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.state= {'windowWidth':clientWidth};
    this.handleResize = this.handleResize.bind(this);
  }

  closeModal(){
    this.props.closeModal();
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
  render(){
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if(this.props.toolbar){
      clientHeight = (clientHeight -64);
    }
    let width = '100%';
    if(this.state.windowWidth > 768){
      width = '375px'
    } else {
      width = this.state.windowWidth;
    }
    return (
      <DialogUI open={this.props.open} autoDetectWindowHeight={false} autoScrollBodyContent={false} repositionOnUpdate={false} defaultOpen={false} style={{
        height: '100%', maxHeight: '100%', paddingTop: '0px',width,
      }} bodyStyle={{
        paddingTop: '0px', height: '100%', padding: '0'
      }} contentStyle={{
        width, maxWidth: 'none', height: '100%', maxHeight: '100%', paddingTop: '0px', top: '-64px'
      }} ref="addNewDialog">
        {this.props.toolbar}
        <div style={{
          height: ( clientHeight) + 'px',
          overflowY:'scroll',
          WebkitOverflowScrolling: 'touch'
        }}>
          {this.props.children}
        </div>
      </DialogUI>
    );
  }
}

Dialog.propTypes = {
  open: React.PropTypes.bool.isRequired,
};

export default Dialog;
