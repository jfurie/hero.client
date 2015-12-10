import React from 'react';
import { Styles, Tabs, Tab } from 'material-ui';
import { connect } from 'react-redux';
import { disableSwipeToOpen, enableSwipeToOpen } from '../../../modules/leftNav';
import ReactSwipe from 'react-swipe';

const style = {
  tabs: {
    backgroundColor: Styles.Colors.grey900,
  },
};

@connect(() => ({}
), { disableSwipeToOpen, enableSwipeToOpen })
class CustomTabsSwipe extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      slideIndex: this.props.startingTab || 0,
    };
  }

  componentWillMount() {
    // disable swipe if we are not on the first tab
    if (this.props.startingTab && this.props.startingTab > 0) {
      this.props.disableSwipeToOpen();
    }
  }

  componentWillUnmount() {
    this.props.enableSwipeToOpen();
  }

  _handleChangeIndex(index) {

    if (this.state.slideIndex !== index) {
      this.setState({
        slideIndex: index,
      });

      if (index === 1) {
        this.props.disableSwipeToOpen();
      }

      if (index === 0) {
        this.props.enableSwipeToOpen();
      }

      // notify parent of a swipe event
      if (this.props.onSwipeEnd) {
        this.props.onSwipeEnd();
      }

    }
  }

  _handleChangeTabs(value) {

    let index = ~~(value);

    if (this.state.slideIndex !== index) {
      this.setState({
        slideIndex: index,
      });

      if (index === 1) {
        this.props.disableSwipeToOpen();
      }

      if (index === 0) {
        this.props.enableSwipeToOpen();
      }

      // notify parent of a swipe event
      if (this.props.onSwipeEnd) {
        this.props.onSwipeEnd();
      }
    }
  }

  _reactSwipeShouldUpdate() {
    return true;
  }

  render() {

    let { tabs, startingTab } = this.props;
    let startSlide = startingTab || 0;

    return (
      <div>
        <Tabs
            tabItemContainerStyle={style.tabs}
            onChange={this._handleChangeTabs.bind(this)}
            value={`${this.state.slideIndex}`}
        >
          {tabs.map((tab, key) => {
            return (
              <Tab label={tab} key={key} value={`${key}`}></Tab>
            );
          })}
        </Tabs>

        <ReactSwipe
            speed={250}
            startSlide={startSlide}
            slideToIndex={this.state.slideIndex}
            transitionEnd={this._handleChangeIndex.bind(this)}
            continuous={false}
            shouldUpdate={this._reactSwipeShouldUpdate}
        >
          {this.props.children}
        </ReactSwipe>
      </div>
    );
  }
}

CustomTabsSwipe.propTypes = {
  onSwipeEnd: React.PropTypes.func,
  startingTab: React.PropTypes.number,
  tabs: React.PropTypes.array.isRequired,
};

export default CustomTabsSwipe;
