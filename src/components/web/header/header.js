import React from 'react';
import {connect} from 'react-redux';
var Sticky = require('react-sticky');
import {AppBar} from 'material-ui';
import {toggleNav} from '../../../modules/leftNav';
const Colors = require('material-ui/lib/styles/colors');

@connect(state => ({user: state.auth.user}), { toggleNav})
class Header extends React.Component {
  menuClicked (e) {console.log(e);
    this.props.toggleNav();}
  render() {

    return (
      <div>
        <Sticky>
          <AppBar onLeftIconButtonTouchTap={this.menuClicked.bind(this)} style={{
            'backgroundColor': Colors. grey900
          }} title={this.props.title} iconClassNameRight="muidocs-icon-navigation-expand-more"/>
        </Sticky>
        <div style={{
          height: '64px'
        }}></div>
      </div>
    );
  }
}

export default Header;
