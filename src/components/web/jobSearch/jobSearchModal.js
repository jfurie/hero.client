import React from 'react';

import { Dialog } from '../';

import JobSearch from './jobSearch';

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
  },
  toolbar: {
    backgroundColor: '#ffffff',
    position: 'fixed',
    zIndex: '10',
  },
  box: {
    marginTop: '67px',
  },
};

export default class JobSearchModal extends React.Component {

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
          <div className="row">
              <div className="col-xs-12 col-md-10">
                  <JobSearch {...this.props} />
              </div>
          </div>
        </div>
      </Dialog>
    );
  }
}
