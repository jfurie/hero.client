import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Tabs, Tab, Styles } from 'material-ui';
import { Header, JobsList } from '../../components/web';
import { toggleNav } from '../../modules/leftNav';
import { getAllJobs } from '../../modules/jobs';
import { disableSwipeToOpen, enableSwipeToOpen } from '../../modules/leftNav';
import SwipeableViews from 'react-swipeable-views';

const style = {
  tabs: {
    'backgroundColor': Styles.Colors.grey900,
  },
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

@connect(state => ({
  user: state.auth.user,
  jobs: state.jobs,
}), {pushState, toggleNav, getAllJobs, disableSwipeToOpen, enableSwipeToOpen})
class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 1,
    };
  }

  componentDidMount() {
    this.props.getAllJobs();
    this.props.disableSwipeToOpen();
  }

  componentWillUnmount() {
    this.props.enableSwipeToOpen();
  }

  _handleChangeIndex(index) {
    this.setState({
      slideIndex: index,
    });

    if (index === 1) {
      this.props.disableSwipeToOpen();
    }

    if (index === 0) {
      this.props.enableSwipeToOpen();
    }
  }

  _handleChangeTabs(value) {

    let index = ~~(value);

    if (index === 1) {
      this.props.disableSwipeToOpen();
    }

    if (index === 0) {
      this.props.enableSwipeToOpen();
    }

    this.setState({
      slideIndex: index,
    });
  }
  _handleJobClick(){
    this.props.pushState(null,'/jobs/1a');
  }

  render () {

    let { jobs } = this.props;

    //let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return (
        <div>
        <Header title='Dashboard'></Header>

        <Tabs tabItemContainerStyle={style.tabs} onChange={this._handleChangeTabs.bind(this)} value={this.state.slideIndex + ''}>
          <Tab label="Clients" value="0"></Tab>
          <Tab label="Active Jobs" value="1"></Tab>
          <Tab label="Contacts" value="2"></Tab>
        </Tabs>

        <SwipeableViews index={this.state.slideIndex} onChangeIndex={this._handleChangeIndex.bind(this)}>
          <div style={style.slide}>
            <p>clients</p>
          </div>
          <div style={style.slide}>
            <JobsList onJobClick={this._handleJobClick.bind(this)} jobs={jobs.list}/>
          </div>
          <div style={style.slide}>
            <p>contacts</p>
          </div>
        </SwipeableViews>

      </div>
    );
  }
}

export default HomePage;
