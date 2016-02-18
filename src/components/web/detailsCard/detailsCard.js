import React from 'react';
import { FontIcon, Styles } from 'material-ui';

import { Tag } from '../';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardMedia from 'material-ui/lib/card/card-media';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';

let style = {
  cardTitle: {
    position: 'relative',
  },
  cardTitleComponent: {
    padding: '11px 16px 11px',
    position: 'relative',
  },
  title: {
    color: Styles.Colors.white,
    fontSize: '23px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  subtitle: {
    color: Styles.Colors.white,
    fontWeight: 200,
    opacity: 0.5,
    fontSize: '13px',
  },
  extraLine: {
    marginTop: '25px',
  },
  extraLeftLine: {
    color: Styles.Colors.white,
  },
  extraRightLine: {
    color: Styles.Colors.white,
  },
  extraCenterLine: {
    color: Styles.Colors.white,
  },
  extraLineLeftCol: {
    paddingLeft: '3px',
  },
  extraLineRightCol: {
    padding: '0px',
    textAlign: 'right',
    paddingRight: '5px',
  },
  extraLineCenterCol: {
    textAlign: 'center',
  },
  floatActionButton: {
    position: 'absolute',
    right: '10px',
    top: '-28px',
    zIndex: '50',
  },
  titlesub: {
    paddingLeft: '3px',
  },
  avatar: {
    position: 'absolute',
    top: '-60px',
    left: '9px',
    maxHeight: '50px',
  },
  actionButton: {
    minWidth: '0px',
  },
  actionFontIcon: {
    display: 'block',
    maxWidth: '25px',
    position: 'relative',
    left: '50%',
    marginLeft: '-13px',
    top: '6px',
  },
  actionBox: {
    marginRight: '0px',
  },
  cardmedia: {
    maxHeight: '250px',
    overflow: 'hidden',
  },
  topTags: {
    paddingLeft: '3px',
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
      action.onTouchTap(action.disabled);
    }
  }

  render() {

    let { actions, topTags } = this.props;
    topTags = topTags || [];

    if (this.props.mainColor) {
      style.cardTitleComponent.backgroundColor = this.props.mainColor;
      style.floatActionButton.color = this.props.mainColor;
    } else {
      style.cardTitleComponent.backgroundColor = Styles.Colors.indigo500; // default
      style.floatActionButton.color = Styles.Colors.indigo500; // default
    }

    return (
      <Card>
        <CardMedia style={style.cardmedia}>
          <img src={this.props.cover} />
        </CardMedia>
        <div style={style.cardTitleComponent}>

          <FloatingActionButton onTouchTap={this._onTouchTapFloatAction.bind(this)} style={style.floatActionButton} backgroundColor={Styles.Colors.white}>
            {this.props.floatActionContent}
          </FloatingActionButton>

          {/* TOP TAGS */}
          <div className="row">
            <div className="col-xs-12" style={style.topTags}>
              <div className="box">
                {topTags.map((tag, key) => {
                  return (
                    <Tag value={tag} key={key}/>
                  );
                })}
              </div>
            </div>
          </div>

          {/* avatar (if any) */}
          {(this.props.avatar) ? (
            <div style={style.avatar}>
              {this.props.avatar}
            </div>
          ) : (null)}

          {/* title and subtitle */}
          <div className="row">
            <div className="col-xs-12" style={style.titlesub}>
              <div className="box">
                <h2 style={style.title}>{this.props.title}</h2>
                <p style={style.subtitle}>{this.props.subtitle}</p>
              </div>
            </div>
          </div>

          {/* extra line (if any) */}
          {(this.props.extraLeftLine || this.props.extraRightLine) ? (
            <div className="row" style={style.extraLine}>
              {(this.props.extraLeftLine) ? (
                <div className="col-xs" style={style.extraLineLeftCol}>
                  <div className="box">
                    <span style={style.extraLeftLine}>{this.props.extraLeftLine}</span>
                  </div>
                </div>
              ) : (null)}

              {(this.props.extraCenterLine) ? (
                <div className="col-xs" style={style.extraLineCenterCol}>
                  <div className="box">
                    <span style={style.extraCenterLine}>{this.props.extraCenterLine}</span>
                  </div>
                </div>
              ) : (null)}

              {(this.props.extraRightLine) ? (
                <div className="col-xs" style={style.extraLineRightCol}>
                  <div className="box">
                    <span style={style.extraRightLine}>{this.props.extraRightLine}</span>
                  </div>
                </div>
              ) : (null)}
            </div>
          ) : (null)}

        </div>

        <CardActions className="row center-xs">
          {actions.map((action, key) => {

            let disabled = false;
            if (action.disabled) {
              disabled = true;
            }

            let actionFontIcon = style.actionFontIcon;

            if (action.active) {
              actionFontIcon = {...style.actionFontIcon, ...{color:'#FDD835'}};
            }

            return (
              <div className="col-xs" style={style.actionBox} key={key}>
                <div className="box" onTouchTap={this._onTouchTapAction.bind(this, action)}>
                  <FlatButton style={style.actionButton} disabled={disabled}>
                    <div style={(disabled) ? ({opacity: '0.25'}) : ({})}>
                      <FontIcon style={actionFontIcon} className="material-icons">{action.materialIcon}</FontIcon>
                    </div>
                    <span>{action.text}</span>
                  </FlatButton>
                </div>
              </div>
            );
          })}
        </CardActions>
      </Card>
    );
  }
}

DetailsCard.propTypes = {
  actions: React.PropTypes.array.isRequired,
  avatar: React.PropTypes.object,
  cover: React.PropTypes.string.isRequired,
  extraCenterLine: React.PropTypes.string,
  extraLeftLine: React.PropTypes.string,
  extraRightLine: React.PropTypes.string,
  floatActionContent: React.PropTypes.object,
  floatActionOnTap: React.PropTypes.func,
  mainColor: React.PropTypes.string,
  subtitle: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  topTags: React.PropTypes.array,
};

export default DetailsCard;
