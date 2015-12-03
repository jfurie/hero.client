import React from 'react';
import { connect } from 'react-redux';
import { Header } from '../../../components/web';
import { getOneCompany } from '../../../modules/companies';

import { Styles, Tabs, Tab, List, ListItem, ListDivider, FontIcon } from 'material-ui';

function getCompany(companies, id) {
  return ((companies.list.size > 0) ? (companies.list.get(id)) : (null));
}

const style = {
  tabs: {
    backgroundColor: Styles.Colors.grey900,
  },
};

@connect((state, props) => ({
  type: state.router.location.query.type,
  company: getCompany(state.companies, props.params.id),
}), {getOneCompany})
class ClientDetailsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getOneCompany(this.props.params.id);
  }

  render() {

    let {company} = this.props;

    if (company) {
      return (
        <div>
          <Header title={company.get('name')}/>
          <Tabs tabItemContainerStyle={style.tabs}>
            <Tab label="Details"></Tab>
            <Tab label="Location"></Tab>
          </Tabs>
          {/* <SwipeableViews index={this.state.slideIndex} onChangeIndex={this._handleChangeIndex.bind(this)}>
            <div>
              <h2 style={styles.headline}>Tabs with slide effect</h2>
              Swipe to see the next slide.<br />
            </div>
            <div style={styles.slide}>
              slide n°2
            </div>
            <div style={styles.slide}>
              slide n°3
            </div>
          </SwipeableViews> */}

            <List>
              <div>
                <ListItem
                  leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                  primaryText={company.get('website')}
                  secondaryText={<p>website</p>}
                  secondaryTextLines={1}
                />
                <ListDivider inset />
                <ListItem
                  leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                  primaryText={`@${company.get('twitterHandle')}`}
                  secondaryText={<p>twitter</p>}
                  secondaryTextLines={1}
                />
                <ListDivider inset />
                <ListItem
                  leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                  primaryText={company.get('indeedId')}
                  secondaryText={<p>indeed Id</p>}
                  secondaryTextLines={1}
                />
              </div>
            </List>

        </div>
      );
    } else {
      return (null);
    }
  }
}

export default ClientDetailsPage;
