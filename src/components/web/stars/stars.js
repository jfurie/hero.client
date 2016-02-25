import React from 'react';
import {FontIcon } from 'material-ui';
export default class Stars extends React.Component {
  constructor(props){
    super(props);
  }
  renderStar(key){
    return (<FontIcon key={key} className="material-icons">star</FontIcon>);
  }
  renderHalfStar(key){
    return (<FontIcon key={key} className="material-icons">star_half</FontIcon>);
  }
  renderEmptyStar(key){
    return (<FontIcon key={key} className="material-icons">star_border</FontIcon>);
  }
  score(number){
    //max 5
    //change to out of 10
    //round
    number =  number * 2.0;
    number  = Math.round(number);
    return number;
  }
  render(){
    let display = false;
    if(this.props.score){
      display = true;
    }
    let currentScore = this.score(this.props.score);
    var halfStars = 0;
    var fullStars = 0;
    var emptyStars = 5;
    var key = 0;
    for(let i = 0; i < currentScore; i++){
      if(halfStars == 0){
        halfStars++;
        emptyStars--;
      } else if(halfStars == 1){
        halfStars--;
        fullStars++;
      }
    }
    let starsArray = [];
    if(display){
      for(let i=0; i <fullStars;i++){
        starsArray.push(this.renderStar(key++));
      }
      for(let i=0; i <halfStars;i++){
        starsArray.push(this.renderHalfStar(key++));
      }
      for(let i=0; i <emptyStars;i++){
        starsArray.push(this.renderEmptyStar(key++));
      }
    }
    return (
      <span>{starsArray}</span>
    );
  }
}
