import React from 'react';
import { FontIcon, Styles } from 'material-ui';
// import md5 from 'md5';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';

let style = {
  cardTitle: {
    position: 'relative',
  },
  cardTitleComponent: {
    //backgroundColor: Styles.Colors.indigo500,
    padding: '21px 16px 26px',
  },
  subtitle: {
    fontWeight: 200,
    opacity: 0.5,
  },
  floatActionButton: {
    position: 'absolute',
    right: '10px',
    top: '-28px',
    zIndex: '50',
  },
  actionFontIcon: {
    position: 'relative',
    // left: '-5px',
    top: '8px',
    marginLeft: '0px',
    width: '24px',
    height: '24px',
  },
  actionBox: {
    marginRight: '0px',
  },
};

class DetailsCard extends React.Component {

  constructor(props){
    super(props);
  }

  _onTouchTapFloatAction() {
    if (this.props.floatActionOnTap) {
      this.props.floatActionOnTap();
    }
  }

  _onTouchTapAction(action) {
    if (action.onTouchTap) {
      action.onTouchTap();
    }
  }

  // renderFloatAction() {
  //   return React.cloneElement(this.props.floatAction, {
  //     style: style.floatAction,
  //   });
  // }

  render() {

    style.cardTitleComponent.backgroundColor = this.props.mainColor;

    //console.log(this.props.actions);

    return (
      <Card>
        <CardMedia>
          <img src={this.props.cover} />
        </CardMedia>
        <div style={style.cardTitle}>
          <FloatingActionButton onTouchTap={this._onTouchTapFloatAction.bind(this)} style={style.floatActionButton} backgroundColor={Styles.Colors.white}>
            {this.props.floatActionContent}
          </FloatingActionButton>
          <CardTitle style={style.cardTitleComponent} subtitleColor={Styles.Colors.white} titleColor={Styles.Colors.white} subtitleStyle={style.subtitle} title={this.props.title} subtitle={this.props.subtitle} />
        </div>
        <CardActions className="row center-xs">
          {this.props.actions.map((action) => {
            return (
              <div className="col-xs" style={style.actionBox}>
                <div className="box" onTouchTap={this._onTouchTapAction.bind(this, action)}>
                  <FontIcon style={style.actionFontIcon} className="material-icons">{action.materialIcon}</FontIcon>
                  <FlatButton style={{minWidth: '0px'}} label={action.text} />
                </div>
              </div>
            );
          })}
          {/*<div className="col-xs" style={style.actionBox}>
            <div className="box">
              <FontIcon style={style.actionFontIcon} className="material-icons">phone</FontIcon>
              <FlatButton style={{minWidth: '0px'}} label="Call" />
            </div>
          </div>
          <div className="col-xs" style={style.actionBox}>
            <div className="box">
              <FontIcon style={style.actionFontIcon} className="material-icons">star_rate</FontIcon>
              <FlatButton style={{minWidth: '0px'}} labelPosition="after" label="Save" />
            </div>
          </div>
          <div className="col-xs" style={style.actionBox}>
            <div className="box">
              <FontIcon style={style.actionFontIcon} className="material-icons">email</FontIcon>
              <FlatButton style={{minWidth: '0px'}} labelPosition="after" label="Email" />
            </div>
          </div>
          <div className="col-xs" style={style.actionBox}>
            <div className="box">
              <FontIcon style={style.actionFontIcon} className="material-icons">share</FontIcon>
              <FlatButton style={{minWidth: '0px'}} labelPosition="after" label="Share" />
            </div>
          </div> */}
        </CardActions>
      </Card>
    );
  }
}

DetailsCard.propTypes = {
  actions: React.PropTypes.array.isRequired,
  cover: React.PropTypes.string.isRequired,
  floatActionContent: React.PropTypes.object,
  floatActionOnTap: React.PropTypes.func,
  mainColor: React.PropTypes.string.isRequired,
  subtitle: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
};

export default DetailsCard;
