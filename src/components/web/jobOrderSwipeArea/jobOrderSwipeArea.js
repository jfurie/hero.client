import React from 'react';
import { Styles, IconButton } from 'material-ui';

const style = {
  rowSwipe: {
    padding: '30px 0px',
    borderBottom: '2px solid #D9D9D9',
    backgroundColor: Styles.Colors.white,
    position: 'relative',
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
};

class JobOrderSwipeArea extends React.Component {

  render() {

    let { title } = this.props;

    return (
      <div className="row center-xs" style={style.rowSwipe}>
        <div className="col-xs-12">
          <div className="box">
            <h2 style={style.rowSwipeTitle}>{title}</h2>
            <p style={style.rowSwipeSubTitle}>swipe to select</p>
            <IconButton style={style.rowSwipeBefore} iconClassName="material-icons">navigate_before</IconButton>
            <IconButton style={style.rowSwipeNext} iconClassName="material-icons">navigate_next</IconButton>
          </div>
        </div>
      </div>
    );
  }
}

JobOrderSwipeArea.propTypes = {
  items: React.PropTypes.array.isRequired,
  title: React.PropTypes.string.isRequired,
};

export default JobOrderSwipeArea;
