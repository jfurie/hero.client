import CandidateSearch from './candidateSearch';
import {Dialog} from '../';
import { Toolbar, ToolbarGroup, IconButton, ToolbarTitle} from 'material-ui';
import React from 'react';


export default class CandidateSearchModal extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <Dialog open={this.props.open}>
            <div style={{
              position:'fixed',
              width:'100%',
            }}>
              <Toolbar style={{backgroundColor:'#ffffff', height:'64px'}}>
                <ToolbarGroup key={0} float="left">
                  <IconButton onTouchTap={this.props.close.bind(this)} style={{marginTop:'8px',float:'left', marginRight:'8px', marginLeft:'-16px'}} iconClassName='material-icons'>close</IconButton>
                  <ToolbarTitle style={{lineHeight:'64px', float:'left'}} text="Find Candidates" />
                </ToolbarGroup>
                <ToolbarGroup key={1} float="right">
                </ToolbarGroup>
              </Toolbar>
            </div>
            <div style={{height:'64px'}}></div>
          <CandidateSearch {...this.props}></CandidateSearch>
        </Dialog>
      </div>
    );
  }
}
