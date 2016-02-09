import React from 'react';
import {FontIcon } from 'material-ui';
export default class Stars extends React.Component {
  constructor(props){
    super(props);
  }
  renderStar(){
    return ( <FontIcon className="material-icons">star</FontIcon>);
  }
  renderHalfStar(){
    return ( <FontIcon className="material-icons">star_half</FontIcon>);
  }
  renderEmptyStar(){
    return ( <FontIcon className="material-icons">star_border</FontIcon>);
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
    let currentScore = this.score(this.props.score);
    var halfStars = 0;
    var fullStars = 0;
    var emptyStars = 5;
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
    for(let i=0; i <fullStars;i++){
      starsArray.push(this.renderStar());
    }
    for(let i=0; i <halfStars;i++){
      starsArray.push(this.renderHalfStar());
    }
    for(let i=0; i <emptyStars;i++){
      starsArray.push(this.renderEmptyStar());
    }
    return (
      <span>{starsArray}</span>
    );
  }
}
