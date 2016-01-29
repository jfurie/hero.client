import React from 'react';

import { AppBar, Card, CardHeader, IconButton, TextField, RaisedButton } from 'material-ui';
import Infinite from 'react-infinite';

const style = {
  container: {
    padding: '10px',
  },
  search: {
    bar: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    input: {
      fontSize: '0.8em',
    },
  },
  section: {
    margin: '10px 0',
  },
  heading: {
    container: {
      color: 'rgba(0, 0, 0, 0.54)',
    },
    label: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
  },
};

export default class ClientSearch extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.refs.queryTextField._getInputNode().setAttribute('autocomplete', 'off');
  }

  render(){

    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    let { query, searchResults, suggestions } = this.props;

    return (
      <div style={style.container}>
      <AppBar
        style={style.search.bar}
        iconElementLeft={<IconButton iconStyle={{color: 'rgba(0, 0, 0, 0.54)'}} onTouchTap={this.props.onSearchModalClose.bind(this)} iconClassName='material-icons'>arrow_back</IconButton>}
        iconElementRight={query ? <IconButton iconStyle={{color: 'rgba(0, 0, 0, 0.54)'}} onTouchTap={this.props.onQueryClear.bind(this)} iconClassName='material-icons'>close</IconButton> : <div></div>}
        zDepth={1}
        title=
        {
          <TextField
            ref="queryTextField"
            value={query}
            style={style.search.input}
            underlineShow={false}
            onEnterKeyDown={this.props.onQuerySubmit.bind(this)}
            onChange={this.props.onQueryChange.bind(this)}
            hintText="Search Clients"
          >
          </TextField>
        }
      />
      <RaisedButton
        style={style.section}
        fullWidth={true}
        label={'add ' + (query ? query : 'client')}
      />
      <div style={style.heading.container}>
        <span style={style.heading.label}>Search Results: </span>{`${searchResults.length} Client${(searchResults.length == 1) ? ('') : ('s')}`}
      </div>
      <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
        {searchResults.map((client, key) => {
          return (
            <div key={key} style={style.section}>
            <Card>
              <CardHeader
                title="Client Title"
                subtitle="Client Subtitle"
                avatar="http://lorempixel.com/100/100/nature/"
              />
            </Card>
            </div>
          );
        })}
      </Infinite>
      <div style={style.heading.container}>
        <span style={style.heading.label}>Suggestions: </span>{`${suggestions.length} Client${(suggestions.length == 1) ? ('') : ('s')}`}
      </div>
      <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
        {suggestions.map((client, key) => {
          return (
            <div key={key} style={style.section}>
            <Card>
              <CardHeader
                title="Client Title"
                subtitle="Client Subtitle"
                avatar="http://lorempixel.com/100/100/nature/"
              />
            </Card>
            </div>
          );
        })}
      </Infinite>
      </div>
    );
  }
}
