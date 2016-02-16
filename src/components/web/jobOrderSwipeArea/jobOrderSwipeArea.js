import React from 'react';
import { Styles, IconButton } from 'material-ui';
import ReactSwipe from 'react-swipe';

const style = {
  rowSwipe: {
    padding: '30px 0px',
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
  rowSwipeNext: {
    position: 'absolute',
    top: '50%',
    right: '10px',
    marginTop: '-22px',
  },
  rowSwipeBefore: {
    position: 'absolute',
    top: '50%',
    left: '10px',
    marginTop: '-22px',
  },
  colSwipe: {
    padding: '0px',
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
    let self = this;

    return (
      <div className="row center-xs" style={style.rowSwipe}>
        <div className="col-xs-12" style={style.colSwipe}>
          <div className="box">
            <ReactSwipe
                continuous
                ref="reactSwipe"
                transitionEnd={this._onChange.bind(this)}
                slideToIndex={this.state.slideIndex}
            >
              <div>
                <h2 style={style.rowSwipeTitle}>{title}</h2>
                <p style={style.rowSwipeSubTitle}>swipe to select</p>
              </div>
              {(self.props.children && self.props.children.length) ? (
                self.props.children.map((child, key) => {
                  return (
                    <div key={key} /*style={{width: '100%', padding: '0px 60px'}}*/>
                      <div style={{width: '150px', maxWidth: '150px'}}>{child}</div>
                    </div>
                  );
                })
              ) : (null)}
            </ReactSwipe>
            <IconButton style={style.rowSwipeBefore} onTouchTap={this._onBefore.bind(this)} iconClassName="material-icons">navigate_before</IconButton>
            <IconButton style={style.rowSwipeNext} onTouchTap={this._onAfter.bind(this)} iconClassName="material-icons">navigate_next</IconButton>
         </div>
        </div>
      </div>
    );
  }
}

JobOrderSwipeArea.propTypes = {
  // items: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func,
  selected: React.PropTypes.number,
  title: React.PropTypes.string.isRequired,
};

export default JobOrderSwipeArea;
