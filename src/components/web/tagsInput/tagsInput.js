import TagsInput from 'react-tagsinput'
import React from 'react';
import Style from './tagsInput.scss';
export default class Tags extends React.Component {
  constructor() {
    super()
    this.state = {tags: []}
  }
  handleChange(tags) {
    if(this.props.onChange){
      this.props.onChange(tags);
    }
  }

  render() {
    let tags = this.props.value?this.props.value.toJSON():[];
    return (
      <div className="tags-wrap">
        <label>{this.props.title}</label>
        <TagsInput value={tags} onChange={::this.handleChange} />
      </div>);
  }
}
