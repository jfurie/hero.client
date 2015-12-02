import React from 'react';
import { connect } from 'react-redux';
import { Header, ClientsCreateModal } from '../../../components/web';
import {getAllCompanies} from '../../../modules/companies';
import {List, ListItem, ListDivider, Avatar, Toolbar, ToolbarGroup, TextField, FontIcon, IconMenu, IconButton, MoreVertIcon } from 'material-ui';
let MenuItem = require('material-ui/lib/menus/menu-item');
const Colors = require('material-ui/lib/styles/colors');
@connect(state => ({
  type: state.router.location.query.type,
  companies: state.companies
}),{getAllCompanies})
class ClientPage extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {createModalOpen:false};
  click(){
    alert('hi');
  }
  openModal(){
    this.setState({
      createModalOpen:true
    });
  }
  componentDidMount() {
    var self = this;
    setTimeout(()=>{
      self.props.getAllCompanies();
    },500);
  }
  render() {
    let {companies} = this.props;

    let listSubheader = companies.list.count() + ' Clients';
    return (
      <div>
        <ClientsCreateModal open={this.state.createModalOpen}></ClientsCreateModal>
        <Header iconRight={
            <IconMenu iconButtonElement={
              <IconButton  iconClassName="material-icons">more_vert</IconButton>
            }>
              <MenuItem index={0} onTouchTap={this.openModal.bind(this)} primaryText="Add" />
            </IconMenu>
        } title='Clients' />
          <Toolbar>
            <ToolbarGroup key={0} float="left">
              <TextField  style={{float:'left', marginTop:'4px'}}
                hintText="Search"
                type="search"
                />


              <FontIcon onTouchTap={this.click.bind(this)} className="material-icons" >search</FontIcon>
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right">

            </ToolbarGroup>
          </Toolbar>
          <List subheader={listSubheader}>
            {companies.list.map((company) => {
              let imageUrl = 'https://logo.clearbit.com/' + company.get('website');
              return (
                <div>
                  <ListItem
                    leftAvatar={<Avatar style={{borderRadius:'none'}} src={imageUrl} />}
                    primaryText={company.get('name')}
                    secondaryText={
                      <p>
                        <span style={{color: Colors.darkBlack}}>3 Jobs | 20 Candidates</span><br/>
                      </p>
                    }
                    secondaryTextLines={2} />
                  <ListDivider inset={true} />
                </div>
              );
            })}
        </List>
      </div>);
  }
}

export default ClientPage;
