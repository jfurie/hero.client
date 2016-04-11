import React from 'react';
import './error.scss';
export default class NotFound extends React.Component {

render(){
  return (
    <div className="error">
      <div className="content">
        <a href="/">
          <img src="/img/hero-logo.png" />
        </a>
        <h2>Sorry, this page isn't available</h2>
        <p>The link you followed may be broken, or the page may have been removed.</p>
        <div className="nav">
          <a href="javascript:history.back()">Back</a>
          <a href="/">Home</a>
        </div>
      </div>


    </div>
  );
}

}
