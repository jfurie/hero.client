import React from 'react';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import {RaisedButton, AppBar, Dialog} from 'material-ui';
import {Header} from '../../components/web';
import { toggleNav } from '../../modules/leftNav';
const Colors = require('material-ui/lib/styles/colors');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');

@connect(state => ({user: state.auth.user}),{pushState, toggleNav})

class HomePage extends React.Component {
  constructor() {
    super();
  }
  handleTouchTap (e) {e.stopPropagation();
    this.props.pushState(null, '/test');
  }
  menuClicked (e) {console.log(e);
    this.props.toggleNav();}
  render () {

    let {
      user
    } = this.props;
    let title = (
      <div style={{
        'color': Colors. grey700
      }}>hero</div>
    );
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return (
        <div>
        <Header title='Home'></Header>
        <Dialog modal={false} autoDetectWindowHeight={false} autoScrollBodyContent={false} repositionOnUpdate={false} defaultOpen={false} style={{
          height: '100%', maxHeight: '100%', paddingTop: '0px'
        }} bodyStyle={{
          paddingTop: '0px', height: '100%', padding: '0'
        }} contentStyle={{
          width: '100%', maxWidth: 'none', height: '100%', maxHeight: '100%', paddingTop: '0px', top: '-64px'
        }} ref="addNewDialog">
          <div style={{
            height: ( clientHeight) + 'px'
          }}>
            <AppBar onLeftIconButtonTouchTap={this.menuClicked.bind(this)} titleStyle={{
              'color': Colors. grey700
            }} style={{
              'backgroundColor': Colors. white, title: { 'color': Colors. grey700
              }
            }} title={title} iconClassNameRight="muidocs-icon-navigation-expand-more"/>

          </div>
        </Dialog>
        <Tabs  tabItemContainerStyle={{
          'background-color': Colors. grey700
        }}>
          <Tab label="Item One">
            {(user && user.email)
              ? (
                <p>hi
                  {user.email}</p>
              )
              : (
                <p>hi guest</p>
              )}
            <h1>HOME</h1>

          </Tab>
          <Tab label="Item Two">
            (Tab content...)
              <RaisedButton onTouchTap={this.handleTouchTap.bind(this)} label="Default"></RaisedButton>
            <div style={{
              height: '1900px'
            }}></div>
          </Tab>
          <Tab label="Item Two">
            (Tab content...)
          </Tab>
          <Tab label="Item Two">
            (Tab content...)
          </Tab>
          <Tab label="Item Two">
            (Tab content...)
          </Tab>
          <Tab label="Item Two">
            (Tab content...)
          </Tab>
          <Tab label="Item Three" route="home" onActive={this._handleTabActive}/>
        </Tabs>
      </div>
    );
  }
}

export default HomePage;
