import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
//import marked from 'marked';

import { CardTitle } from 'material-ui';
import defaultImage from './publicJob.jpg';
import {SkillsCard, LocationCard, PublicHeader, DetailsCard, CustomTabsSwipe, CompanyAvatar } from '../../../components/web';
import { RaisedButton, FontIcon, Styles, Card, CardText, Avatar } from 'material-ui';
import './publicJob.scss';

const style = {
  title:{
    color:'rgba(0, 0, 0, 0.87)',
    fontSize:'15px',
    fontWeight:'500',
  },
  content:{
    color:'rgba(0, 0, 0, 0.54)',
    fontSize:'14px',
    fontWeight:'500',
  },
  card: {
    paddingTop: '4px',
  },
};

@connect(() => (
{}), {pushState, replaceState})
export default class PublicJob extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      justInvited: false,
      confirmOpen: false,
    };
  }

  renderBigListItem(title,content,avatar){
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        {
          content ?
          <div style={{display: 'inline-block'}}>
            <div style={style.title}>{title}</div>
            <div style={style.content}>{content}</div>
          </div>
          :
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={style.title}>{title}</div>
          </div>
        }

      </div>
    );
  }

  renderContent(job) {
    if (job) {
      // cover
      let cover = ((job.get('image') && job.get('image').get('item')) ? (job.get('image').get('item')) : (defaultImage));

      // markdown to html
      //let description = job.get('description') ? marked(job.get('description')) : '';

      // salary
      let salaryMin = '$[?]';
      let salaryMax = '$[?]';

      if (job.get('minSalary')) {
        salaryMin = `$${~~(job.get('minSalary')) / 1000}k`;
      }

      if (job.get('maxSalary')) {
        salaryMax = `$${~~(job.get('maxSalary')) / 1000}k`;
      }

      // actions
      let isHot = false;

      if (job.get('tags')) {
        isHot = job.get('tags').indexOf('HOT!') > -1;
      }

      let actions = [{
        materialIcon: 'phone',
        text: 'Call',
        onTouchTap: this.props.apply.bind(this),
      }, {
        materialIcon: 'star_rate',
        text: 'Save',
        onTouchTap: this.props.apply.bind(this),
      }, {
        materialIcon: 'email',
        text: 'Apply',
        active: isHot,
        onTouchTap: this.props.apply.bind(this),
      }, {
        materialIcon: 'share',
        text: 'Share',
        onTouchTap: this.props.share.bind(this),
      }];

      // company
      let companyName;
      let companyWebsite;

      let company = job.get('company');

      if (company) {
        companyName = company.get('name');
        companyWebsite = company.get('website');
      }
      else {
        companyName = 'XYZ Company';
      }
      let categoryLinks =job.get('_categoryLinks');
      return (
        <div>
          <DetailsCard
              topTitle={companyName}
              topSubtitle={`${companyName} - ${job.get('department')}`}
              location={job.get('location')}
              bottomLabel="Job Title"
              bottomTitle={job.get('title')}
              rightLabel="Wage"
              rightTitle={`${salaryMin} - ${salaryMax}`}
              rightSubtitle={job.get('jobType') || 'Permanent'}
              cover={cover}
              actions={actions}
              avatar={<CompanyAvatar style={{width: '95px'}} url={companyWebsite}/>}
              floatActionOnTap={this.props.apply.bind(this)}
              floatActionButtonColor={Styles.Colors.green500}
              floatActionContent={<FontIcon className="material-icons">check</FontIcon>}
              floatActionLabel={'Click to Apply'}
          />
        <CustomTabsSwipe onChange={this.props.apply.bind(this)} startingTab={this.props.tab} isLight isInline tabs={['Details', 'Desc', 'Applicants', 'Notes']}>
          <div>
            <Card>
              <CardTitle title="Details" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
              <CardText>
                {this.renderBigListItem('Quick Pitch', job.get('quickPitch'),
                <Avatar
                    icon={<FontIcon className="material-icons">info_outline</FontIcon>}
                    color={Styles.Colors.grey600}
                    backgroundColor={Styles.Colors.white}
                />)}
              </CardText>
              <CardText>
                {this.renderBigListItem('Bonus & perks', job.get('bonusPerks'),
                <Avatar
                    icon={<FontIcon className="material-icons">redeem</FontIcon>}
                    color={Styles.Colors.grey600}
                    backgroundColor={Styles.Colors.white}
                />)}
              </CardText>
            </Card>

            <LocationCard location={job.get('location')} />
            <SkillsCard skills={categoryLinks} />
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </CustomTabsSwipe>
        <div style={{padding: '16px 24px', textAlign: 'center', backgroundColor: '#333'}}>
          <RaisedButton label="Apply Now" primary style={{}} onTouchTap={this.props.apply.bind(this)} />
        </div>
        </div>
      );

    }
    else {
      return (<div></div>);
    }
  }

  render() {

    let { job } = this.props;
    return (
      <div>
        <PublicHeader onTouchTap={this.props.apply.bind(this)} />
        {this.renderContent(job)}
      </div>
    );
  }
}

PublicJob.propTypes = {
  job: React.PropTypes.object,
  onJobDetailsClose: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
};
