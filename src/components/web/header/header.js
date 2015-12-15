import React from 'react';
import {connect} from 'react-redux';
import {AppBar} from 'material-ui';
import {toggleNav} from '../../../modules/leftNav';
const Colors = require('material-ui/lib/styles/colors');

@connect(state => ({user: state.auth.user}), { toggleNav})
class Header extends React.Component {

  menuClicked() {
    this.props.toggleNav();
  }

  render() {

    return (
      <div>
        <AppBar iconElementRight={this.props.iconRight} onLeftIconButtonTouchTap={this.menuClicked.bind(this)} style={{
          position:'fixed',
          'backgroundColor': Colors. grey900
        }} title={this.props.title} />
        <div style={{
          height: '64px'
        }}></div>
      </div>
    );
  }
}

export default Header;
