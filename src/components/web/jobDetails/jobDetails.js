import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import marked from 'marked';

import { List } from 'material-ui';

import { Header, DetailsCard, CustomTabsSwipe, CandidatesList, CompanyAvatar, CompanyNotesList } from '../../../components/web';
import {
  IconButton, FontIcon, Styles,
  IconMenu, MenuItem, Card, CardText, Avatar,
} from 'material-ui';

const style = {
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
  },
  bodyStyle: {
    paddingTop: '0px',
    height: '100%',
    padding: '0',
  },
  contentStyle: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    top: '-64px',
  },
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
{}), {pushState})
export default class JobDetails extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      justInvited: false,
      confirmOpen: false,
    };
  }

  renderBigListItem(title, content, avatar){
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        <div style={{display:'inline-block'}}>
          <div style={style.title}>{title}</div>
          <div style={style.content}>{content}</div>
        </div>
      </div>
    );
  }

  goBack() {
    if (this.props.onJobDetailsClose) {
      this.props.onJobDetailsClose();
    }
  }

  _onTouchTapSave() {
    let {job} = this.props;

    if (job.get('isFavorited')) {
      this.props.unfavoriteJob();
    }
    else {
      this.props.favoriteJob();
    }
  }

  _onTouchTapShare() {
    let subject = `Check out ${this.props.job.get('title')} on HERO`;
    let body = `${encodeURIComponent(this.props.job.get('title'))}%0A${encodeURIComponent(window.location.href)}`;
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
  }

  _onTouchTapSearch() {
    this.props.pushState(null,`/clients/${this.props.job.get('companyId')}/jobs/${this.props.job.get('id')}/candidates/search`);
  }
  _onTouchAddCandidate(){
    this.props.pushState(null,`/clients/${this.props.job.get('companyId')}/jobs/${this.props.job.get('id')}/candidates/search`);
  }

  _onTouchTapEdit(){
    this.props.pushState(null,`/clients/${this.props.job.get('companyId')}/jobs/${this.props.job.get('id')}/edit`);
  }

  _onTouchCompanyIcon(){
    this.props.pushState(null,`/clients/${this.props.job.get('companyId')}`);
  }
  createNoteModalOpen(){
    if(this.props.addNoteModalOpen){
      this.props.addNoteModalOpen();
    }
  }

  editNote(note){
    this.props.addNoteModalOpen(note);
  }

  deleteNote(note){
    this.props.deleteNote(note);
  }

  renderContent(job) {

    if (job) {

      // get cover
      let cover = ((job.get('image')) ? (job.get('image').get('item')) : ('/img/default-job.jpg'));

      // markdown to html
      let description = job.get('description') ? marked(job.get('description')) : '';

      // salary
      let salaryMin = '$[?]';
      let salaryMax = '$[?]';

      if (job.get('minSalary')) {
        salaryMin = `$${~~(job.get('minSalary')) / 1000}k`;
      }

      if (job.get('maxSalary')) {
        salaryMax = `$${~~(job.get('maxSalary')) / 1000}k`;
      }

      // fee
      let fee = 'Fee: [?]%';

      if (job.get('fee')) {
        fee = `Fee: ${job.get('fee')}%`;
      }

      // details card
      let actions = [{
        materialIcon: 'search',
        text: 'Find',
        onTouchTap: this._onTouchTapSearch.bind(this),
      }, {
        materialIcon: 'star_rate',
        text: job.get('isFavorited') ? 'Saved' : 'Save',
        active: job.get('isFavorited'),
        onTouchTap: this._onTouchTapSave.bind(this),
      }, {
        materialIcon: 'share',
        text: 'Share',
        onTouchTap: this._onTouchTapShare.bind(this),
      }];

      // company
      let company = job.get('company');
      let companyWebsite = null;
      let companyName = null;
      if (company) {
        companyWebsite = company.get('website');
        companyName = company.get('name');
      }

      // location stuff
      let location = job.get('location');
      let addressLine = null;

      if (location) {
        let address = location.get('addressLine') || '';
        let city = location.get('city') || null;
        let countrySubDivisionCode = location.get('countrySubDivisionCode') || null;

        if (city && countrySubDivisionCode) {
          city += `, ${countrySubDivisionCode}`;
        }

        addressLine = address;
        if (addressLine.length) {
          addressLine += `. ${city}`;
        } else {
          addressLine = city;
        }
      }

      return (

        <div>
          <DetailsCard
              title={job.get('title')}
              subtitle={`${companyName} - ${job.get('department')}`}
              extraLeftLine={`${salaryMin} - ${salaryMax}`}
              extraCenterLine={fee}
              extraRightLine={job.get('employmentType') || 'Permanent'}
              cover={cover}
              mainColor={Styles.Colors.amber700}
              actions={actions}
              avatar={<CompanyAvatar onTouchTap={this._onTouchCompanyIcon.bind(this)} style={{width: '50px'}} url={companyWebsite}/>}
              floatActionOnTap={this._onTouchTapShare.bind(this)}
              floatActionContent={<div><p style={{color: `${Styles.Colors.amber700}`, fontSize: '20px', fontWeight: '500'}}>{job.get('candidates').length}</p></div>}
              topTags={job.get('tags') || []}
          />
          <CustomTabsSwipe isLight isInline tabs={['Details', 'Desc', 'Applicants', 'Notes']}>
            <Card style={style.card}>
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
              <CardText>
                {this.renderBigListItem('Location', addressLine,
                <Avatar
                    icon={<FontIcon className="material-icons">place</FontIcon>}
                    color={Styles.Colors.grey600}
                    backgroundColor={Styles.Colors.white}
                />)}
              </CardText>
            </Card>
            <div>
              <Card>
                <CardText >
                  <div className="description">
                    <div dangerouslySetInnerHTML={{__html: description}} />
                  </div>
                </CardText>
              </Card>
            </div>
            <div>
              <CandidatesList
                  candidates={job.get('candidates')}
                  favoriteContact={this.props.favoriteContact.bind(this)}
                  unfavoriteContact={this.props.unfavoriteContact.bind(this)}
              />
            </div>
            <List subheader={`${job.get('notes').count()} Note${((job.get('notes').count() !== 1) ? ('s') : (''))}`}>
              <CompanyNotesList editNote={this.editNote.bind(this)} deleteNote={this.deleteNote.bind(this)} notes={job.get('notes')}/>
            </List>
          </CustomTabsSwipe>

        </div>
      );

    }
    else {
      return (<div></div>);
    }
  }

  render() {

    let { job } = this.props;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let contentHeight = clientHeight;

    return (
      <div>
        <Header transparent goBack={this.goBack.bind(this)} iconRight={
          <IconMenu iconButtonElement={
            <IconButton iconClassName="material-icons">more_vert</IconButton>
          }>
            <MenuItem onTouchTap={this._onTouchTapEdit.bind(this)} index={0} primaryText="Edit Job" />
            <MenuItem onTouchTap={this._onTouchAddCandidate.bind(this)} index={0} primaryText="Find Candidate" />
            <MenuItem index={0} onTouchTap={this.createNoteModalOpen.bind(this)} primaryText="Add Note" />
          </IconMenu>
        }
        />
        <div style={{height: `${contentHeight}px`, overflowY:'scroll', WebkitOverflowScrolling:'touch'}}>
          {this.renderContent(job)}
        </div>
      </div>
    );
  }
}

JobDetails.propTypes = {
  job: React.PropTypes.object,
  onJobDetailsClose: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
};
