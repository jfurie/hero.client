import React from 'react';
import { Card, CardText } from 'material-ui';
import { CardBasic } from '../../../components/web';

const style = {
  templatePicture: {
    width: '40px',
    height: '40px',
  },
};

export default class JobTemplateListItem extends React.Component {
  constructor(props){
    super(props);
  }

  renderBasic() {
    let {jobTemplate} = this.props;

    if (jobTemplate) {

      return (
        <CardBasic
          image={<img style={style.templatePicture} src={jobTemplate.get('imageUrl')} />}
          title={jobTemplate.get('title')}
          subtitle2={jobTemplate.get('shortDescription')}
        ></CardBasic>
      );
    } else {
      return (<div></div>);
    }
  }

  render(){
    let {type} = this.props;

    //console.log('render jobListItem', this.props);

    return (
      type == 'tiny' ? (<div>{this.renderBasic()}</div>) :
      <Card
        style={{
          height: type !=='mini'?'auto':'80px',
          marginBottom:'8px',
          marginLeft:'8px',
          marginRight:'8px',
        }}>
        <CardText
          style={{
            height: type !=='mini'?'auto':'auto',
          }}>
          {this.renderBasic()}
        </CardText>
      </Card>
    );
  }
}
