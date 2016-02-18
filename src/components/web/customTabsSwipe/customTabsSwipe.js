import React from 'react';
import { Styles, Tabs, Tab } from 'material-ui';
import { connect } from 'react-redux';
//import { disableSwipeToOpen, enableSwipeToOpen } from '../../../modules/leftNav';
//import ReactSwipe from 'react-swipe';

/* THIS THING IS A WRAPER FOR JUST A NORMAL MATERIAL-UI TABS TAB */
/* USE TO BE SOMETHING YOU CAN SWIPE with react-swipe */
/* CODE MIGHT STILL BE HERE */

const style = {
  tabs: {
    backgroundColor: Styles.Colors.grey900,
    position: 'fixed',
    width: '100%',
    zIndex: '10',
  },
  tabsLight: {
    backgroundColor: '#ffffff',
    position: 'fixed',
    width: '100%',
    zIndex: '10',
  },
  // tabsInline: {
  //   position: 'relative',
  //   top: '4px',
  // },
  tabLightSelected: {
    fontWeight:'800',
    borderBottom:'2px solid #505050',
    color: Styles.Colors.grey900,
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

    this.setState({
      slideIndex: index,
    });
    if(this.props.onChange){
      this.props.onChange(value);
    }
  }

  // _reactSwipeShouldUpdate() {
  //   return true;
  // }

  render() {

    let { tabs, isLight, isInline } = this.props;

    isInline = isInline || false;
    isLight = isLight || false;

    let tabsStyle = style.tabs;
    let tabStyle = {};

    if (isLight) {
      tabsStyle = style.tabsLight;
      tabStyle.color = Styles.Colors.grey900;
      tabStyle.borderBottom = '1px solid #cccccc';
    }

    let inkBarStyle = style.inkBar;
    if (isInline) {
      inkBarStyle.display = 'none';
      tabsStyle.position = 'relative';
      tabsStyle.top = '4px';
    } else {
      inkBarStyle.display = 'block';
      tabsStyle.position = 'fixed';
      tabStyle.top = '0px';
    }
    //console.log('slideIndex ',this.state.slideIndex);
    return (
      <div>
        <Tabs
            tabItemContainerStyle={tabsStyle}
            onChange={this._handleChangeTabs.bind(this)}
            initialSelectedIndex={(this.props.startingTab || 0)}
            inkBarStyle={inkBarStyle}
        >
          {tabs.map((tab, key) => {

            let tabStyleItem = tabStyle;
            if (this.state.slideIndex == key && isLight) {
              tabStyleItem = style.tabLightSelected;
            }
            // console.log('slideIndex ',this.state.slideIndex);
            // console.log('key ',key);
            return (
              <Tab selected={this.state.slideIndex == key} label={tab} key={key} style={tabStyleItem} value={`${key}`}>
                <div style={{paddingTop: (isInline) ? ('0px') : ('48px')}}>
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
  isLight: React.PropTypes.bool,
  onSwipeEnd: React.PropTypes.func,
  startingTab: React.PropTypes.number,
  tabs: React.PropTypes.array.isRequired,
};

export default CustomTabsSwipe;
