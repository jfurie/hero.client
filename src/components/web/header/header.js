import React from 'react';
import {connect} from 'react-redux';
import {AppBar, IconButton, Styles} from 'material-ui';
import {toggleNav} from '../../../modules/leftNav';

@connect(state => ({
  user: state.auth.user,
}), { toggleNav })
class Header extends React.Component {

  menuClicked() {

    if (this.props.goBack) {
      this.props.goBack();
    } else {
      this.props.toggleNav();
    }
  }

  render() {


    let leftIconFont = 'menu';
    if (this.props.goBack) {
      leftIconFont = 'chevron_left';
    }

    //console.log(this.props.history);

    return (
      <div>
        <AppBar
          iconElementRight={this.props.iconRight}
          style={{position:'fixed', 'backgroundColor': Styles.Colors.grey900}}
          title={this.props.title}
          iconElementLeft={<IconButton onTouchTap={this.menuClicked.bind(this)} iconClassName='material-icons'>{leftIconFont}</IconButton>}
        />
        <div style={{height: '64px'}}></div>
      </div>
    );
  }
}
//
Header.propTypes = {
  goBack: React.PropTypes.func,
};


export default Header;
