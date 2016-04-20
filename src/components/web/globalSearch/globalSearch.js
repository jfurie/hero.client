import React from 'react';

import { AppBar, IconButton, TextField, Snackbar } from 'material-ui';
import { ClientListItem, JobListItem, ContactListItem } from '../../../components/web';

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
      marginTop:'8px',
      marginBottom:'8px',
      color: 'rgba(0, 0, 0, 0.54)',
    },
    label: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
  },
};

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
favoriteCompany(company) {
  if (this.props.favoriteCompany) {
    this.props.favoriteCompany(company);
  }
}

unfavoriteCompany(company) {
  if (this.props.unfavoriteCompany) {
    this.props.unfavoriteCompany(company);
  }
}

renderItem(item){
  switch (item.get('type')) {
  case 'company':
    return (
      <ClientListItem
        onClientClick={this.props.onItemSelect.bind(this, item)}
        company={item}
        favoriteCompany={this.favoriteCompany.bind(this)}
        unfavoriteCompany={this.unfavoriteCompany.bind(this)}
       />
    );
  case 'job':
    return (
      <JobListItem
        job={item}
        onJobClick={this.props.onItemSelect.bind(this, item)}
        />
      );
  case 'contact':
    console.log(item);
    return(
      <ContactListItem
      contact={item}
      onContactClick={this.props.onItemSelect.bind(this, item)}
      />
    );
  default:
    return (<div></div>);
  }
}

render(){


  let { query, searchResults } = this.props;
  let self = this;
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
          hintText="Search"
          fullWidth={true}
          value={this.props.location.state && this.props.location.state.query}
        >
        </TextField>
      }
    />
    <Snackbar
        open={ (this.props.candidates && this.props.candidates.errorMessage)?true:false}
        message={this.props.candidates && this.props.candidates.errorMessage}
        autoHideDuration={4000}
      ></Snackbar>

      {
        searchResults && searchResults.get('results') &&searchResults.get('results').length > 0 ?
          <div>
            <div style={style.heading.container}>
              <span style={style.heading.label}>Search Results: </span>{`${searchResults.get('count')}`}
            </div>
              {searchResults.get('results').map((item) => {
                console.log('renderItem');
                return self.renderItem.bind(this)(item);
              })}
          </div>
        :

          <div></div>

      }

  </div>
  );
}
}
