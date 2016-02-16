import React from 'react';
import { Card, CardText, FontIcon } from 'material-ui';
import { CardBasic } from '../../../components/web';

export default class LocationListItem extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let {location, type} = this.props;

    let line1 = location.get('addressLine');

    let line2 = '';
    if (location.get('city')) line2 += location.get('city');
    if (location.get('countrySubDivisionCode')) {
      if (location.get('city')) line2 += ', ';
      line2 += location.get('countrySubDivisionCode');
    }

    if (location.get('postalCode')) {
      if (location.get('city') || location.get('countrySubDivisionCode')) line2 += ' ';
      line2 += location.get('postalCode');
    }

    function renderBasic() {
      return (
        <CardBasic
          image={<FontIcon className="material-icons" style={{color: '#F5A623', fontSize: '3em'}}>place</FontIcon>}
          title={location.get('name')}
          subtitle1={line1}
          subtitle2={line2}
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
