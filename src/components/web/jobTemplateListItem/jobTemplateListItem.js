import React from 'react';
import { Card, CardText } from 'material-ui';
import { CardBasic } from '../../../components/web';

export default class JobTemplateListItem extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let {jobTemplate, type} = this.props;

    function renderBasic() {
      return (
        <CardBasic
            image={<img style={{width: '40px', height: '40px'}} src='http://www.w3devcampus.com/wp-content/uploads/logoAndOther/logo_JavaScript.png' />}
            title={jobTemplate.get('title')}
            subtitle2={jobTemplate.get('description')}
          ></CardBasic>
      );
    }

    return (
      type == 'tiny' ? (<div>{renderBasic()}</div>) :
      <Card
        style={{
          height: type !=='mini'?'auto':'80px',
          marginBottom:'8px',
          marginLeft:'8px',
          marginRight:'8px',
        }}>
        <CardText
          style={{
            height: type !=='mini'?'auto':'auto'
          }}>
          {renderBasic()}
        </CardText>
      </Card>
    );
  }
}
