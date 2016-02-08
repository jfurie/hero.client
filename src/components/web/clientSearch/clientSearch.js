import React from 'react';

import { AppBar, Card, CardHeader, IconButton, TextField, RaisedButton } from 'material-ui';
import Infinite from 'react-infinite';

import { ClientListItem } from '../../../components/web';

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

  onQueryClear() {
    this.props.onQueryClear(this.refs.queryTextField);
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
            hintText="Search Clients"
            fullWidth={true}
          >
          </TextField>
        }
      />
      <RaisedButton
        style={style.section}
        fullWidth={true}
        label={'add ' + (query ? query : 'client')}
        onTouchTap={this.props.onDbClientSelect.bind(this, { name: query })}
      />
      {
        searchResults.length > 0 || suggestions.length > 0 ?
        <div>
        {
          searchResults.length > 0 || (query.length > 1 && suggestions.length == 0) ?
          <div>
            <div style={style.heading.container}>
              <span style={style.heading.label}>Search Results: </span>{`${searchResults.length} Client${(searchResults.length == 1) ? ('') : ('s')}`}
            </div>
            <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
              {searchResults.map((client, key) => {
                return (
                  <div key={key} style={style.section}>
                    <ClientListItem company={client} />
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
              <span style={style.heading.label}>Suggestions: </span>{`${suggestions.length} Client${(suggestions.length == 1) ? ('') : ('s')}`}
            </div>
            <Infinite containerHeight={clientHeight - (56+64)} elementHeight={88} useWindowAsScrollContainer>
              {suggestions.map((client, key) => {
                let photo = client.photos ? client.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}) : null;

                return (
                  <div key={key} style={style.section}>
                  <Card
                    style={style.card}
                    onTouchTap={this.props.onGoogleClientSelect.bind(this, client)}
                  >
                    <CardHeader
                      style={style.overflow}
                      title={<span>{client.name}</span>}
                      subtitle={<span>{client.formatted_address}</span>}
                      avatar={photo ? photo : client.icon}
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
