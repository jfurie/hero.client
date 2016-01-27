import React from 'react';
import { Styles, Tabs, Tab } from 'material-ui';
import { connect } from 'react-redux';
//import { disableSwipeToOpen, enableSwipeToOpen } from '../../../modules/leftNav';
//import ReactSwipe from 'react-swipe';

/* THIS THING IS A WRAPER FOR JUST A NORMAL MATERIAL-UI TABS TAB */
/* USE TO BE SOMETHING YOU CAN SWIPE with react-swipe */
/* CODE MIGHT STILL BE HERE */

const style = {
  tabsContainer: {
  },
  tabs: {
    backgroundColor: Styles.Colors.grey900,
    position: 'fixed',
    width: '100%',
    zIndex: '10',
  },
  tabs2: {
    backgroundColor: '#ffffff',
    position: 'fixed',
    width: '100%',
    zIndex: '10',
  },
  tab:{
    // marginTop: '48px',
  },
  tab2:{
    color:Styles.Colors.grey900,
    // marginTop: '48px',
  },
  inkBar: {
    marginTop: '0px',
    position: 'fixed',
    top: '110px',
    zIndex: '20',
  },
};

@connect(() => ({}
), {}, null, {withRef: true})
class CustomTabsSwipe extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      slideIndex: this.props.startingTab || 0,
    };
  }

  // componentWillMount() {
  //   // disable swipe if we are not on the first tab
  //   if (this.props.startingTab && this.props.startingTab > 0) {
  //     this.props.disableSwipeToOpen();
  //   }
  // }

  componentWillUnmount() {
    //this.props.enableSwipeToOpen();
  }

  // _handleChangeIndex() {
  //
  //   if (this.state.slideIndex !== index) {
  //     this.setState({
  //       slideIndex: index,
  //     });
  //
  //     if (index === 1) {
  //       this.props.disableSwipeToOpen();
  //     }
  //
  //     if (index === 0) {
  //       this.props.enableSwipeToOpen();
  //     }
  //
  //     // notify parent of a swipe event
  //     if (this.props.onSwipeEnd) {
  //       this.props.onSwipeEnd(index);
  //     }
  //
  //   }
  // }

  _handleChangeTabs(value) {

    let index = ~~(value);

    if (this.state.slideIndex !== index) {
      this.setState({
        slideIndex: index,
      });

      // if (index === 1) {
      //   this.props.disableSwipeToOpen();
      // }
      //
      // if (index === 0) {
      //   this.props.enableSwipeToOpen();
      // }

      // notify parent of a swipe event
      if (this.props.onSwipeEnd) {
        this.props.onSwipeEnd(index);
      }
    }
  }

  // _reactSwipeShouldUpdate() {
  //   return true;
  // }

  render() {

    let { tabs, /*startingTab,*/ isLight } = this.props;
    //let startSlide = startingTab || 0;
    let tabsStyle = style.tabs;
    let tabStyle = style.tab;
    if (isLight) {
      tabsStyle = style.tabs2;
      tabStyle = style.tab2;
    }
    return (
      <div>
        <Tabs
            tabItemContainerStyle={tabsStyle}
            /*onChange={this._handleChangeTabs.bind(this)}
            value={`${this.state.slideIndex}`}*/
            initialSelectedIndex={(this.props.startingTab || 0)}
            style={style.tabsContainer}
            inkBarStyle={style.inkBar}
        >
          {tabs.map((tab, key) => {
            return (
              <Tab label={tab} key={key} style={tabStyle} value={`${key}`}>
                <div style={{paddingTop: '48px'}}>
                  {this.props.children[key]}
                </div>
              </Tab>
            );
          })}
        </Tabs>

        {/* <ReactSwipe
            speed={250}
            startSlide={startSlide}
            slideToIndex={this.state.slideIndex}
            transitionEnd={this._handleChangeIndex.bind(this)}
            continuous={false}
            shouldUpdate={this._reactSwipeShouldUpdate}
        >
          {this.props.children}
        </ReactSwipe> */}
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
