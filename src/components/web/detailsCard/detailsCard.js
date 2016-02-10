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
    padding: '11px 16px 20px',
    position: 'relative',
  },
  title: {
    color: Styles.Colors.white,
    fontSize: '23px',
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
  extraLineCol: {
    padding: '0px',
  },
  floatActionButton: {
    position: 'absolute',
    right: '10px',
    top: '-28px',
    zIndex: '50',
  },
  titlesub: {
    paddingTop: '4px',
    position: 'relative',
    left: '-2px',
  },
  avatar: {
    paddingLeft: '1px',
    paddingRight: '1px',
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
    paddingLeft: '0px',
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

    if (this.props.avatar) {
      style.titlesub.paddingLeft = '1px';
    } else {
      style.titlesub.paddingLeft = '11px';
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
                    <Tag value={tag.text} color={tag.color} key={key}/>
                  );
                })}
              </div>
            </div>
          </div>

          {/* avatar (if any) + title and subtitle */}
          <div className="row">
            {(this.props.avatar) ? (
              <div style={style.avatar} className="col-xs-2">
                <div className="box">{this.props.avatar}</div>
              </div>
            ) : (null)}
            <div className="col-xs-10" style={style.titlesub}>
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
                <div className="col-xs" style={style.extraLineCol}>
                  <div className="box">
                    <span style={style.extraLeftLine}>{this.props.extraLeftLine}</span>
                  </div>
                </div>
              ) : (null)}
              {(this.props.extraRightLine) ? (
                <div className="col-xs" style={style.extraLineCol}>
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
            return (
              <div className="col-xs" style={style.actionBox} key={key}>
                <div className="box" onTouchTap={this._onTouchTapAction.bind(this, action)}>
                  <FlatButton style={style.actionButton}>
                    <FontIcon style={style.actionFontIcon} className="material-icons">{action.materialIcon}</FontIcon>
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
