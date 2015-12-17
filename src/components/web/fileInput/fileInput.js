import React from 'react';
import { FlatButton } from 'material-ui';
export default class FileInput extends React.Component {
  constructor(props){
    super(props);
  }
  _handleChange(e){
    console.log(e.target.value);
    var reader = new FileReader();
    reader.onload = function(){
      console.log(reader.result);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
    this.props.onFileChanged(e.target.files[0]);
  }
  _openFileDialog(){
    var fileUploadDom = React.findDOMNode(this.refs.fileUpload);
    fileUploadDom.click();
  }
  render() {
    let label = this.props.label || 'Upload File';
    return (
      <div>
      <FlatButton
        label={label}
        onClick={this._openFileDialog.bind(this)}/>
      <input
        ref="fileUpload"
        type="file"
        style={{'display' : 'none'}}
        onChange={this._handleChange.bind(this)}/>
        </div>
    );
  }
}
