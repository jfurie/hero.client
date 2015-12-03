import React from 'react';
import { connect } from 'react-redux';
import { Header, ClientsCreateModal, CompanyAvatar } from '../../../components/web';
import { getAllCompanies } from '../../../modules/companies';
import { List, ListItem, ListDivider, Toolbar, ToolbarGroup, TextField, FontIcon, IconMenu, IconButton } from 'material-ui';
import { pushState } from 'redux-router';

let MenuItem = require('material-ui/lib/menus/menu-item');
const Colors = require('material-ui/lib/styles/colors');

@connect(state => ({
  type: state.router.location.query.type,
  companies: state.companies,
}),{getAllCompanies, pushState})

class ClientPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {createModalOpen: false};
  }

  componentDidMount() {
    let self = this;
    setTimeout(() => {
      self.props.getAllCompanies();
    }, 500);
  }

  openModal() {
    this.setState({
      createModalOpen: true,
    });
  }

  click() {
    alert('hi');
  }

  _showClientDetails(id) {
    this.props.pushState(null, `/clients/${id}`);
  }

  render() {
    let {companies} = this.props;
    let listSubheader = companies.list.count() + ' Clients';

    return (
      <div>
        <ClientsCreateModal open={this.state.createModalOpen} />
        <Header iconRight={
            <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}>
              <MenuItem
                  index={0}
                  onTouchTap={this.openModal.bind(this)}
                  primaryText="Add"
              />
            </IconMenu>
        } title="Clients" />

          <Toolbar>
            <ToolbarGroup key={0} float="left">

              <TextField
                  hintText="Search"
                  style={{float:'left', marginTop:'4px'}}
                  type="search"
              />

              <FontIcon onTouchTap={this.click.bind(this)} className="material-icons" >search</FontIcon>
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right"></ToolbarGroup>
          </Toolbar>

          <List subheader={listSubheader}>
            {companies.list.map((company) => {
              //let imageUrl = 'https://logo.clearbit.com/' + company.get('website');
              return (
                <div>
                  <ListItem
                    leftAvatar={<CompanyAvatar url={company.get('website')} />}
                    primaryText={company.get('name')}
                    secondaryText={
                      <p>
                        <span style={{color: Colors.darkBlack}}>3 Jobs | 20 Candidates</span><br/>
                      </p>
                    }
                    secondaryTextLines={2}
                    onTouchTap={this._showClientDetails.bind(this, company.get('id'))}/>
                  <ListDivider inset />
                </div>
              );
            })}
        </List>
      </div>);
  }
}

export default ClientPage;
