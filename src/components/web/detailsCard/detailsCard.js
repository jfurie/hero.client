import React from 'react';
import { FontIcon, Styles } from 'material-ui';

import { Tag } from '../';
import _ from 'lodash';
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
    padding: '11px 16px 11px 16px',
    position: 'relative',
    minHeight: '50px',
  },
  title: {
    color: Styles.Colors.white,
    fontSize: '19px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
  },
  subtitle: {
    color: Styles.Colors.white,
    fontWeight: 500,
    opacity: 0.5,
    fontSize: '13px',
  },
  extraLine: {
    marginTop: '8px',
    marginLeft:'0px',
    marginRight:'0px',
  },
  extraLeftLine: {
    color: Styles.Colors.white,
    fontWeight: 800,
    fontSize: '15px',
  },
  extraRightLine: {
    color: Styles.Colors.white,
    fontWeight: 800,
    fontSize: '15px',
  },
  extraCenterLine: {
    color: Styles.Colors.white,
    fontWeight: 800,
    fontSize: '15px',
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
    right: '16px',
    top: '-28px',
    zIndex: '50',
  },
  titlesub: {
    paddingLeft: '3px',
  },
  avatar: {
    position: 'absolute',
    top: '-97px',
    left: '16px',
    maxHeight: '95px',
    border: '2px solid white',
    borderBottom: '0px',
    boxShadow: '1px -1px 5px rgba(0, 0, 0, 0.21)',
  },
  subtitleAvatarWrap:{
    position:'relative',
    paddingLeft: '48px',
    marginTop:'8px',
    minHeight:'40px'
  },
  subtitleAvatar:{
    position:'absolute',
    top:'0px',
    left:'0px',
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
  statsBox: {
    marginRight: '0px',
  },
  statsRow: {
    borderBottom: '1px solid #CCC',
    borderTop: '1px solid #CCC',
  },
  cardmedia: {
    maxHeight: '250px',
    overflow: 'hidden',
  },
  topTags: {
    paddingLeft: '3px',
  },
  floatActionLabel: {
    position: 'absolute',
    top: '37px',
    right: '9px',
    fontSize: '11px',
    fontWeight: '100',
    color: Styles.Colors.white,
    textAlign: 'center',
    width: '70px',
  },
  statTitle: {
    fontSize: '11px',
    opacity: '0.5',
    textTransform: 'capitalize',
    lineHeight: '20px',
  },
  statNumber: {
    fontSize: '25px',
    marginBottom: '0px',
    lineHeight: '31px',
    marginTop: '0px',
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

  renderSubtitles(subtitle1,subtitle2,avatar, styleNew){
    if(!avatar){
      return (
        <div>
          <p style={styleNew.subtitle}>{subtitle1}</p>
          <p style={styleNew.subtitle}>{subtitle2}</p>
        </div>
      );
    } else {
      return (
        <div style={styleNew.subtitleAvatarWrap}>
          <div style={styleNew.subtitleAvatar}>
            {avatar}
          </div>
          <div>
            <p style={styleNew.subtitle}>{this.props.subtitle}</p>
            <p style={styleNew.subtitle}>{this.props.subtitle2}</p>
          </div>
        </div>
      );
    }
  }
  render() {
    let styleNew = _.merge({},style,this.props.style);
    let { actions, topTags, stats } = this.props;
    topTags = topTags || [];

    if (this.props.mainColor) {
      styleNew.cardTitleComponent.backgroundColor = this.props.mainColor;
      styleNew.floatActionButton.color = this.props.mainColor;
    } else {
      styleNew.cardTitleComponent.backgroundColor = Styles.Colors.indigo500; // default
      styleNew.floatActionButton.color = Styles.Colors.indigo500; // default
    }

    return (
      <Card>
        <CardMedia style={styleNew.cardmedia}>
          <img src={this.props.cover} />
        </CardMedia>
        <div style={styleNew.cardTitleComponent}>

          <FloatingActionButton onTouchTap={this._onTouchTapFloatAction.bind(this)} style={styleNew.floatActionButton} backgroundColor={Styles.Colors.white}>
            {this.props.floatActionContent}
          </FloatingActionButton>

          <div style={styleNew.floatActionLabel}>
            {(this.props.floatActionLabel) ? (
              <p>{this.props.floatActionLabel}</p>
            ) : (<p></p>)}
          </div>

          {/* TOP TAGS */}
          <div style={{marginLeft:'0px', marginright:'0px'}} className="row">
            <div className="col-xs-12" style={styleNew.topTags}>
              <div className="box">
                {topTags.map((tag, key) => {
                  return (
                    <Tag active={true} value={tag} key={key}/>
                  );
                })}
              </div>
            </div>
          </div>

          {/* avatar (if any) */}
          {(this.props.avatar) ? (
            <div style={styleNew.avatar}>
              {this.props.avatar}
            </div>
          ) : (null)}

          {/* title and subtitle */}
          <div style={{marginLeft:'0px', marginright:'0px'}} className="row">
            <div className="col-xs-9" style={styleNew.titlesub}>
              <div className="box">
                <h2 style={styleNew.title}>{this.props.title}</h2>
                {this.renderSubtitles(this.props.subtitle,this.props.subtitle2,this.props.subtitleAvatar,styleNew)}
              </div>
            </div>
          </div>

          {/* extra line (if any) */}
          {(this.props.extraLeftLine || this.props.extraCenterLine || this.props.extraRightLine) ? (
            <div className="row" style={styleNew.extraLine}>
              {(this.props.extraLeftLine) ? (
                <div className="col-xs" style={styleNew.extraLineLeftCol}>
                  <div className="box">
                    <span style={styleNew.extraLeftLine}>{this.props.extraLeftLine}</span>
                  </div>
                </div>
              ) : (null)}

              {(this.props.extraCenterLine) ? (
                <div className="col-xs" style={styleNew.extraLineCenterCol}>
                  <div className="box">
                    <span style={styleNew.extraCenterLine}>{this.props.extraCenterLine}</span>
                  </div>
                </div>
              ) : (null)}

              {(this.props.extraRightLine) ? (
                <div className="col-xs" style={styleNew.extraLineRightCol}>
                  <div className="box">
                    <span style={styleNew.extraRightLine}>{this.props.extraRightLine}</span>
                  </div>
                </div>
              ) : (null)}
            </div>
          ) : (<div></div>)}

        </div>

        <CardActions className="row center-xs" style={styleNew.statsRow}>
          {stats.map((stat, key) => {

            return (
              <div className="col-xs" style={styleNew.statsBox} key={key}>
                <div className="box">
                  <FlatButton style={styleNew.actionButton}>
                    <p style={styleNew.statTitle}>{stat.title}</p>
                    <p style={styleNew.statNumber}>{stat.value}</p>
                  </FlatButton>
                </div>
              </div>
            );
          })}
        </CardActions>

        <CardActions className="row center-xs">
          {actions.map((action, key) => {

            let disabled = false;
            if (action.disabled) {
              disabled = true;
            }

            let actionFontIcon = styleNew.actionFontIcon;

            if (action.active) {
              actionFontIcon = {...styleNew.actionFontIcon, ...{color:'#FBC02D'}};
            }

            return (
              <div className="col-xs" style={styleNew.actionBox} key={key}>
                <div className="box" onTouchTap={this._onTouchTapAction.bind(this, action)}>
                  <FlatButton style={styleNew.actionButton} disabled={disabled}>
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
  floatActionLabel: React.PropTypes.string,
  floatActionOnTap: React.PropTypes.func,
  mainColor: React.PropTypes.string,
  stats: React.PropTypes.array,
  subtitle: React.PropTypes.string.isRequired,
  subtitleAvatar: React.PropTypes.object,
  subtitle2: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  topTags: React.PropTypes.object,
};

export default DetailsCard;
