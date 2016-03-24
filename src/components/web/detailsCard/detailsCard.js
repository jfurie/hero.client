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
    padding: '24px',
    position: 'relative',
    minHeight: '50px',
    backgroundColor: '#212121',
  },
  topTitle: {
    color: Styles.Colors.white,
    fontSize: '18px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
  },
  topSubtitle: {
    color: Styles.Colors.white,
    opacity: 0.7,
    fontSize: '13px',
    margin: '2px 0',
  },
  bottomLeft: {
    textAlign: 'left',
    paddingLeft: '10px',
    alignSelf: 'flex-end',
  },
  bottomRight: {
    textAlign: 'right',
    paddingRight: '10px',
  },
  bottomLabel: {
    color: Styles.Colors.white,
    opacity: 0.7,
    fontSize: '13px',
    marginBottom: '2px',
    marginTop: '10px',
  },
  bottomTitle: {
    color: Styles.Colors.white,
    fontSize: '21px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
    maxWidth: '200px',
  },
  rightLabel: {
    color: Styles.Colors.white,
    opacity: 0.7,
    fontSize: '13px',
    marginBottom: '2px',
    marginTop: '10px',
  },
  rightTitle: {
    color: Styles.Colors.white,
    fontSize: '18px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
  },
  rightSubtitle: {
    color: Styles.Colors.white,
    opacity: 0.7,
    fontSize: '16px',
    marginTop: '2px',
  },
  locationIcon: {
    color: Styles.Colors.white,
    fontSize: '13px',
    bottom: '-2px',
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
    right: '24px',
    top: '-28px',
    zIndex: '50',
  },
  titlesub: {
    paddingLeft: '3px',
  },
  avatar: {
    position: 'absolute',
    top: '-97px',
    left: '24px',
    maxHeight: '95px',
    border: '2px solid white',
    borderBottom: '0px',
    boxShadow: '1px -1px 5px rgba(0, 0, 0, 0.21)',
  },
  subtitleAvatarWrap:{
    position:'relative',
    paddingLeft: '48px',
    marginTop: '8px',
    minHeight: '40px',
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
  actionsRow:{
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
    right: '16px',
    fontSize: '13px',
    fontWeight: '100',
    color: Styles.Colors.white,
    opacity: 0.7,
    textAlign: 'center',
    width: '80px',
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
    let { actions, topTags, stats, location } = this.props;
    topTags = topTags || [];

    // location stuff
    let locationElm = location && location.get('city') ? (
      <span>
        <FontIcon style={style.locationIcon} className="material-icons">location_on</FontIcon>
        <span style={styleNew.topSubtitle}>{location.get('city')}
        , {location.get('countrySubDivisionCode')}</span>
      </span>
    ) : (<span></span>);

    return (
      <Card>
        <CardMedia style={styleNew.cardmedia}>
          <img src={this.props.cover} />
        </CardMedia>
        <div style={styleNew.cardTitleComponent}>

          <FloatingActionButton onTouchTap={this._onTouchTapFloatAction.bind(this)} style={styleNew.floatActionButton} iconStyle={{color: this.props.floatActionButtonColor || Styles.Colors.blue500}} backgroundColor={Styles.Colors.white}>
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
                    <Tag active value={tag} key={key}/>
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

          {/* top content */}
          <div style={{marginLeft:'0px', marginright:'0px'}} className="row">
            <div className="col-xs-9" style={styleNew.titlesub}>
              <div className="box">
                <h2 style={styleNew.topTitle}>{this.props.topTitle}</h2>
                <div>
                  <p style={styleNew.topSubtitle}>{this.props.topSubtitle}</p>
                  <p>{locationElm}</p>
                </div>
              </div>
            </div>
          </div>



          <div className="row between-xs">
            {/* bottom content */}
            <div style={styleNew.bottomLeft}>
              <div className="box">
                {
                  this.props.bottomTitle ?
                  <div>
                    <p style={styleNew.bottomLabel}>{this.props.bottomLabel}</p>
                    <h2 style={styleNew.bottomTitle}>{this.props.bottomTitle}</h2>
                  </div>
                  : <div></div>
                }
              </div>
            </div>
            {/* bottom content */}
            <div style={styleNew.bottomRight}>
              <div className="box">
                {
                  this.props.rightTitle ?
                  <div>
                    <p style={styleNew.rightLabel}>{this.props.rightLabel}</p>
                    <h2 style={styleNew.rightTitle}>{this.props.rightTitle}</h2>
                  </div>
                  : <div></div>
                }
                <p style={styleNew.rightSubtitle}>{this.props.rightSubtitle}</p>
              </div>
            </div>
          </div>

          {/* extra line (if any) */}
          {/*(this.props.extraLeftLine || this.props.extraCenterLine || this.props.extraRightLine) ? (
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
          ) : (<div></div>)*/}

        </div>
        {this.props.showStats?(
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
        ):(<span></span>)}

        <CardActions className="row center-xs" style={styleNew.actionsRow}>
          {actions.map((action, key) => {

            let disabled = false;
            if (action.disabled) {
              disabled = true;
            }

            let actionFontIcon = styleNew.actionFontIcon;

            if (action.active) {
              actionFontIcon = {...styleNew.actionFontIcon, ...{color:action.activeColor || '#FBC02D'}};
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
  topSubtitle: React.PropTypes.string.isRequired,
  subtitle2: React.PropTypes.string,
  subtitleAvatar: React.PropTypes.object,
  topTitle: React.PropTypes.string.isRequired,
  topTags: React.PropTypes.object,
};

export default DetailsCard;
