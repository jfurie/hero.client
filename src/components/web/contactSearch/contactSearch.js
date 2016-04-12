import React from 'react';

import { AppBar, Card, CardHeader, IconButton, TextField, RaisedButton, Snackbar } from 'material-ui';
import Infinite from 'react-infinite';

import { Gravatar } from '../../../components/web';

const style = {
  overflow: {
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
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
  card: {
    cursor: 'pointer',
    gravatar: {
      display: 'inline',
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

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default class ContactSearch extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.refs.queryTextField._getInputNode().setAttribute('autocomplete', 'off');
  }

  onQueryClear() {
    this.props.onQueryClear(this.refs.queryTextField);
  }

  handleAddClient(){
    let firstName =null;
    let lastName = null;
    let email = null;
    if(validateEmail(this.props.query)){
      email = this.props.query;
    } else {
      firstName = this.props.query.split(' ').slice(0, -1).join(' ');
      lastName = this.props.query.split(' ').slice(-1).join(' ');
    }
    this.props.onDbContactSelect({
      firstName,
      lastName,
      email,
    });
  }

  render(){

    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    let { query, searchResults, suggestions } = this.props;
    return (
      <div style={style.container}>
      <AppBar
        style={style.search.bar}
        iconElementLeft={<IconButton iconStyle={{color: 'rgba(0, 0, 0, 0.54)'}} onTouchTap={this.props.onSearchModalClose.bind(this)} iconClassName='material-icons'>arrow_back</IconButton>}
        iconElementRight={query ? <IconButton iconStyle={{color: 'rgba(0, 0, 0, 0.54)'}} onTouchTap={this.onQueryClear.bind(this)} iconClassName='material-icons'>close</IconButton> : <div></div>}
        zDepth={1}
        title=
        {
          <TextField
            ref="queryTextField"
            style={style.search.input}
            underlineShow={false}
            onEnterKeyDown={this.props.onQuerySubmit.bind(this)}
            onChange={this.props.onQueryChange.bind(this)}
            hintText="Search Contacts"
            fullWidth={true}
          >
          </TextField>
        }
      />
      <Snackbar
          open={ (this.props.candidates && this.props.candidates.errorMessage)?true:false}
          message={this.props.candidates && this.props.candidates.errorMessage}
          autoHideDuration={4000}
        ></Snackbar>
      <RaisedButton
        style={style.section}
        fullWidth={true}
        label={'add ' + (query ? query : 'contact')}
        onTouchTap={this.handleAddClient.bind(this)}
      />
      {
        searchResults.length > 0 || suggestions.length > 0 ?
        <div>
        {
          searchResults.length > 0 || (query.length > 1 && suggestions.length == 0) ?
          <div>
            <div style={style.heading.container}>
              <span style={style.heading.label}>Search Results: </span>{`${searchResults.length} Contact${(searchResults.length == 1) ? ('') : ('s')}`}
            </div>
            <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
              {searchResults.map((contact, key) => {
                return (
                  <div key={key} style={style.section}>
                  <Card
                    style={style.card}
                    onTouchTap={this.props.onDbContactSelect.bind(this, contact)}
                  >
                    <CardHeader
                      title={contact.get('displayName')}
                      subtitle={contact.get('email')}
                      avatar={<Gravatar style={style.card.gravatar} email={contact.get('email')} status="notset" />}
                    />
                  </Card>
                  </div>
                );
              })}
            </Infinite>
          </div>
          : <div></div>
        }
        {
          suggestions.length > 0 || (query.length > 1 && searchResults.length == 0) ?
          <div>
            <div style={style.heading.container}>
              <span style={style.heading.label}>Suggestions: </span>{`${suggestions.length} Contact${(suggestions.length == 1) ? ('') : ('s')}`}
            </div>
            <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
              {suggestions.map((contact, key) => {
                return (
                  <div key={key} style={style.section}>
                  <Card
                    style={style.card}
                    onTouchTap={this.props.onDbContactSelect.bind(this, contact)}
                  >
                    <CardHeader
                      title={contact.get('displayName')}
                      subtitle={contact.get('email')}
                      avatar={<Gravatar style={style.card.gravatar} email={contact.get('email')} status="notset" />}
                    />
                  </Card>
                  </div>
                );
              })}
            </Infinite>
          </div>
          : <div></div>
        }
        </div>
        :
        <div>
        {
          query.length > 1 ?
          <div style={style.heading.container}>
            <span style={style.heading.label}>No results found for "{query}"</span>
          </div>
          : <div></div>
        }
        </div>
      }
      </div>
    );
  }
}
