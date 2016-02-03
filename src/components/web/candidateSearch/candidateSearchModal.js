import CandidateSearch from './candidateSearch';
import {Dialog} from '../';
import { Toolbar, ToolbarGroup, IconButton, ToolbarTitle} from 'material-ui';
import React from 'react';

const style = {
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
  },
  bodyStyle: {
    paddingTop: '0px',
    height: '100%',
    padding: '0',
  },
  contentStyle: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    top: '-64px',
  },
  toolbar: {
    backgroundColor: '#ffffff',
    height: '64px',
    position: 'fixed',
    zIndex: '10',
  },
  toolbarIcon: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  toolbarFlat: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  toolbarTitle: {
    lineHeight:'64px',
    float:'left',
  },
  box: {
    marginTop: '67px',
  },
};

export default class CandidateSearchModal extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return (

      <Dialog
          open={this.props.open}
          autoDetectWindowHeight={false}
          autoScrollBodyContent={false}
          repositionOnUpdate={false}
          defaultOpen={false}
          style={style.dialog}
          bodyStyle={style.bodyStyle}
          contentStyle={style.contentStyle}
      >
        <div style={{height: `${clientHeight}px`}}>
          <Toolbar style={style.toolbar}>
            <ToolbarGroup key={0} float="left">
              <IconButton onTouchTap={this.props.close.bind(this)} style={style.toolbarIcon} iconClassName='material-icons'>close</IconButton>
              <ToolbarTitle style={style.toolbarTitle} text="Find Candidates" />
            </ToolbarGroup>
          </Toolbar>
          <div className="row">
              <div className="col-xs-12 col-md-10">
                  <div className="box" style={style.box}>
                    <CandidateSearch {...this.props}></CandidateSearch>
                  </div>
              </div>
          </div>
        </div>
      </Dialog>
    );
  }
}
