import React from 'react';
import { List } from 'material-ui';
import Infinite from 'react-infinite';
import { ClientListItem } from '../../../components/web';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';
//import { ContactDetailsModal } from '../../../components/web';

const style = {
  textField: {
    float:'left',
    marginTop:'4px',
  },
  list: {
    backgroundColor: 'transparant',
  },
};

@connect(() => (
{}), {pushState})
class ClientsList extends React.Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   detailsContact: null,
    //   detailsModalOpen: false,
    // };
  }

  // openDetails(contact){
  //
  //   if (this.props.onOpenContactDetails) {
  //     this.props.onOpenContactDetails(contact);
  //   }
  //   //console.log(contact);
  //
  //   // this.setState({
  //   //   detailsContact: contact,
  //   //   detailsModalOpen: true,
  //   // });
  // }

  // closeDetails(){
  //   // this.setState({
  //   //   detailsContact: null,
  //   //   detailsModalOpen: false,
  //   // });
  // }

  _showClientDetails(id) {
    this.props.pushState(null, `/clients/${id}`);
  }

  searchCompany() {
    console.log('toto');
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

  render() {

    let { clients } = this.props;

    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    let count = clients.count();
    let ressourceName = 'Client';

    if (count !== 1) {
      ressourceName += 's';
    }
    let heights = clients.map(company =>{

      let height = 198;
      let tags = company.get('tags');
      if(tags && tags.count() >0){
        height = height +26;
      }
      let clientAdvocate = company.get('clientAdvocate');
      let contacts = company.get('contacts');
      if(clientAdvocate){
        height = height +37;
      }
      else if(contacts && contacts.count() >0){
        height = height +25;
      }
      return height;
    });
    heights = heights.toArray();
    if(!heights || heights.length <= 0){
      heights = 261;
    }
    return (

      <div>
        {/*<Toolbar>
          <ToolbarGroup key={0} float="left">
            <TextField onChange={this.searchCompany.bind(this)}  style={style.textField}
                hintText="Search"
                type="search"
                fullWidth
            />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FontIcon className="material-icons">search</FontIcon>
          </ToolbarGroup>
        </Toolbar>*/}
        <List style={style.list} subheader={`${count} ${ressourceName}`}>
          <Infinite containerHeight={clientHeight - (56+64)} elementHeight={heights} useWindowAsScrollContainer>
            {clients.map((company) => {
              return (
                <div>

                  <ClientListItem
                      onClientClick={this._showClientDetails.bind(this)}
                      company={company}
                      favoriteCompany={this.favoriteCompany.bind(this)}
                      unfavoriteCompany={this.unfavoriteCompany.bind(this)}
                  />
                {/*
                  <ListItem
                      leftAvatar={<CompanyAvatar url={company.get('website')} />}
                      primaryText={company.get('name')}
                      secondaryText={<p>{company.get('jobs').size} Job{company.get('jobs').size == 1 ? '' : 's'} | {company.get('candidates').size} Candidate{company.get('candidates').size == 1 ? '' : 's'}</p>}
                      secondaryTextLines={2}
                      onTouchTap={this._showClientDetails.bind(this, company.get('id'))}
                  />
                  */}

                </div>
              );
            })}
          </Infinite>
        </List>
      </div>
    );
  }
}

ClientsList.propTypes = {
  clients: React.PropTypes.object.isRequired,
};

export default ClientsList;
