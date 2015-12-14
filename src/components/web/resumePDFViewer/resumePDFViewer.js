import React from 'react';
import { RaisedButton } from 'material-ui';
import PDF from 'react-pdf';

import './resumePDFViewer.scss';

class resumePDFViewer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      pages: 0,
    };
  }

  prevPage(ev) {
    ev.preventDefault();
    this.setState({
      currentPage: (this.state.currentPage > 1) ? (this.state.currentPage - 1) : (1),
    });
  }

  nextPage(ev) {
    ev.preventDefault();
    //if (this.state.currentPage < this.state.pages) {
    this.setState({
      currentPage: (this.state.currentPage < this.state.pages) ? (this.state.currentPage + 1) : (this.state.pages),
    });
    //}
  }

  _onDocumentComplete(pages){
    console.log(pages);
    this.setState({
      pages,
    });
  }

  render() {

    let style = {
      pdfContainer: {
        width: '100%',
        height: '70vh',
        margin: '0px',
      },
      raisedButton: {
        width: '100%',
        marginTop: '14px',
        marginBottom: '14px',
      },
    };

    let { file } = this.props;


    return (
      <div>
        <div className='row'>
          <div className='col-xs-6'>
            <RaisedButton style={style.raisedButton} onTouchTap={this.prevPage.bind(this)} label="Previous page" />
          </div>
          <div className='col-xs-6'>
            <RaisedButton style={style.raisedButton} onTouchTap={this.nextPage.bind(this)} label="Next page" />
          </div>
        </div>
        <div className="row pdfContainer" style={style.pdfContainer}>
          <PDF className="col-xs-12" scale="1.0" file={file} page={this.state.currentPage} onDocumentComplete={this._onDocumentComplete.bind(this)}/>
        </div>
      </div>
    );
  }
}

resumePDFViewer.propTypes = {
  file: React.PropTypes.string.isRequired,
};

export default resumePDFViewer;
