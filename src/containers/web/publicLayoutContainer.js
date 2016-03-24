import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

@connect(state => ({
  public: state.publik,
}),{pushState})
class Layout extends React.Component {

  constructor(props) {
    super(props);
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.state = {
      open: false,
      windowHeight:clientHeight,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount(){
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize(){
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.setState({'windowHeight':clientHeight});
  }

  render () {
    let height = this.state.windowHeight;


    return (
      <div>
        <div
            style={{
              position:'fixed',
              width:'100%',
              height:'100%',
              top:0,
              bottom:0,
              left:0,
              right:0,
              WebkitFilter:'blur(4px)',
              filter:'blur(4px)',
            }}
            className="mapContainer"
        >
        </div>
        <div
            className="mainContainer"
            style={{
              minHeight:`${height}px`,
              backgroundColor:'#ffffff',
            }}
        >
        {React.cloneElement(this.props.children, {
          key: this.props.location.pathname,
        })}
        </div>
      </div>
    );
  }
}

export default Layout;
