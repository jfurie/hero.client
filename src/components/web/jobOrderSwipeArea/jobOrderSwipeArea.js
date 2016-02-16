import React from 'react';
import { Styles, FontIcon } from 'material-ui';
import ReactSwipe from 'react-swipe';

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
    };
  }

  _onBefore() {

    let index = this.refs.reactSwipe.swipe.getPos();

    this.setState({
      slideIndex: index,
    });

    this.refs.reactSwipe.swipe.prev();

    if (this.props.onChange) {
      this.props.onChange(index);
    }
  }

  _onAfter() {

    let index = this.refs.reactSwipe.swipe.getPos();

    this.setState({
      slideIndex: index,
    });

    this.refs.reactSwipe.swipe.next();

    if (this.props.onChange) {
      this.props.onChange(index);
    }
  }

  _onChange(index) {

    this.setState({
      slideIndex: index,
    });

    if (this.props.onChange) {
      this.props.onChange(index);
    }
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

    return (
      <div className="row center-xs" style={style.rowSwipe}>
        <div className="col-xs-12" style={style.colSwipe}>
          <div className="box">
            <div style={style.leftNav} onTouchTap={this._onBefore.bind(this)}>
              <FontIcon style={style.navIcon} className="material-icons">keyboard_arrow_left</FontIcon>
            </div>
            <div style={style.rightNav} onTouchTap={this._onAfter.bind(this)}>
              <FontIcon style={style.navIcon} className="material-icons">keyboard_arrow_right</FontIcon>
            </div>
            <ReactSwipe
                key={items.length +1}
                continuous
                ref="reactSwipe"
                transitionEnd={this._onChange.bind(this)}
                slideToIndex={this.state.slideIndex}
            >
              <div style={style.slideTitle} key={'a'}>
                <h2 style={style.rowSwipeTitle}>{title}</h2>
                <p style={style.rowSwipeSubTitle}>swipe to select</p>
              </div>
              {itemsToRender}
            </ReactSwipe>
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
