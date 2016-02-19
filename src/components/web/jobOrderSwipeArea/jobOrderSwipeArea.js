import React from 'react';
import { Styles, FontIcon } from 'material-ui';
import SwipeableViews from 'react-swipeable-views';

const style = {
  rowSwipe: {
    padding: '30px',
    borderBottom: '2px solid #D9D9D9',
    backgroundColor: Styles.Colors.white,
    position: 'relative',
    margin: '0px',
    // maxWidth: '100%',
  },
  rowSwipeTitle: {
    fontSize: '17px',
    fontWeight: '800',
    marginTop: '0px',
    marginBottom: '0px',
  },
  rowSwipeSubTitle: {
    fontWeight: '800',
    fontSize: '12px',
    opacity: '0.25',
    marginTop: '0px',
    marginBottom: '0px',
  },
  colSwipe: {
    padding: '0px',
  },
  leftNav: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    left: '0px',
    top: 0,
    bottom: 0,
  },
  rightNav: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    right: '0px',
    top: 0,
    bottom: 0,
  },
  navIcon: {
    alignSelf: 'center',
    fontSize: '2em',
  },
  slideTitle: {
    padding: '10px 0px',
  },
};

class JobOrderSwipeArea extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      slideIndex: this.props.selected || 0,
      // disabled: false,
    };
  }

  componentWillReceiveProps(props) {
    if (props.selected) {
      this.setState({
        slideIndex: props.selected,
      });
    }
  }

  _onBefore() {
    let index = (this.state.slideIndex > 0) ? (this.state.slideIndex - 1) : (0);
    this._onChange(index);
  }

  _onAfter() {
    let maxIndex = this.props.items.length || 0;
    let index = (this.state.slideIndex < maxIndex) ? (this.state.slideIndex + 1) : (this.state.slideIndex);
    this._onChange(index);
  }

  _onChange(index) {

    if (index !== 1) { /* 1 is middle slide */
      this.setState({
        slideIndex: index,
        // disabled: true,
      });
    } else {
      this.setState({
        slideIndex: index,
        // disabled: false,
      });
    }

    if (this.props.onChange) {
      this.props.onChange(index);
    }
  }

  _reactSwipeShouldUpdate() {
    return true;
  }

  render() {

    let { title } = this.props;

    let items = this.props.items || [];
    let itemsToRender = items.map((item, key) => {
      return (
        <div key={key} style={{textAlign: 'center'}}>
          <div>{item}</div>
        </div>
      );
    });

    let maxIndex = this.props.items.length || 0;

    return (
      <div className="row center-xs" style={style.rowSwipe}>
        <div className="col-xs-12" style={style.colSwipe}>
          <div className="box">
            <div style={Object.assign({}, style.leftNav, {display: (this.state.slideIndex === 0) ? ('none') : ('flex')})} onTouchTap={this._onBefore.bind(this)}>
              <FontIcon style={style.navIcon} className="material-icons">keyboard_arrow_left</FontIcon>
            </div>
            <div style={Object.assign({}, style.rightNav, {display: (this.state.slideIndex === maxIndex) ? ('none') : ('flex')})} onTouchTap={this._onAfter.bind(this)}>
              <FontIcon style={style.navIcon} className="material-icons">keyboard_arrow_right</FontIcon>
            </div>
            <SwipeableViews
                index={this.state.slideIndex}
                onChangeIndex={this._onChange.bind(this)}
            >
              <div style={style.slideTitle} key={'a'}>
                <h2 style={style.rowSwipeTitle}>{title}</h2>
                <p style={style.rowSwipeSubTitle}>swipe to select</p>
              </div>
              {itemsToRender}
            </SwipeableViews>
          </div>
        </div>
      </div>
    );
  }
}

JobOrderSwipeArea.propTypes = {
  items: React.PropTypes.array,
  onChange: React.PropTypes.func,
  selected: React.PropTypes.number,
  title: React.PropTypes.string.isRequired,
};

export default JobOrderSwipeArea;
