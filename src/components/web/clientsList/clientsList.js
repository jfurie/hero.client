import React from 'react';
import { List } from 'material-ui';
import Infinite from 'react-infinite';
import { ClientCardContainer } from '../../../components/web';
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

      let height = 169;
      let tags = company.get('tags');
      if(tags && tags.count() >0){
        height = height +26;
      }
      return height;
    });
    heights = heights.toArray();
    if(!heights || heights.length <= 0){
      heights = 169;
    }

    clients = clients.sort((a, b) => {
      return a.get('name').localeCompare(b.get('name'));
    });

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
                <ClientCardContainer companyId={company.get('id')} />
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
