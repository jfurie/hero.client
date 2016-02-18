import React from 'react';
import {
  IconButton, ToolbarGroup, Toolbar,
  FlatButton, ToolbarTitle, Styles,
  LinearProgress,
} from 'material-ui';
import { FileInput } from '../';

import {
  ClientListItem, JobTemplateListItem, RangeSlider,
  LocationListItem, ContactListItem, JobOrderSwipeArea, JobOrderMoneySwipeArea,
} from '../';

const style = {
  error: {
    float: 'left',
  },
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
  toolbarInline:{
    background: Styles.Colors.grey900,
    color: '#FFFF',
    height: '64px',
    position: 'fixed',
    zIndex: '1000',
    width: '100%',
    maxWidth: '100%',
  },
  contentStyle: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    top: '-64px',
    backgroundColor: '#ffffff',
  },
  toolbar: {
    backgroundColor: '#ffffff',
    height: '64px',
  },
  toolbarIcon: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  addImageIcon: {
    position: 'absolute',
    left: '20px',
  },
  toolbarFlat: {
    marginTop:'14px',
    marginRight:'-24px',
    marginLeft:'auto',
    color: '#FFFFFF',
  },
  toolbarTitle: {
    lineHeight:'64px',
    float:'left',
    color: '#ffffff',
  },
  select: {
    textAlign: 'left',
    color: '#000',
  },
  floatLabel: {
    top: '12px',
    color: 'rgba(0, 0, 0, 0.298039)',
    fontSize: '12px',
    transform: 'none',
  },
  pictureRow: {
    backgroundColor: Styles.Colors.grey900,
    position: 'relative',
    margin: '0px',
  },
  pictureBox: {
    marginBottom: '-4px',
  },
  orderDefault: {
    width: '100%',

    borderRadius: '4px 4px 0px 0px',
  },
  addImage: {
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: '-40px',
    marginTop: '-20px',
  },
  addImageLabel: {
    margin: '0px',
  },
  progress: {
    borderRadius: '0px',
  },
};

export default class JobCreate extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isSalary: false,
      isHourly: false,
      salary: [90000, 120000],
      hourlySalary: [20, 50],
    };
  }

  _handleClose(){
    this.props.closeModal();
  }

  _handleSubmit() {
    if(this.props.job.get('saving') == true) return;
    this.props.onSubmit(this.props.job);
  }

  onImageChange(value){
    this.props.onImageChange(value);
  }

  _onSalaryChange(value) {
    this.setState({
      salary: value,
    });

    this.props.onSalaryChange({
      isSalary: this.state.isSalary,
      isHourly: this.state.isHourly,
      value,
    });
  }

  _onHourlySalaryChange(value) {
    this.setState({
      hourlySalary: value,
    });

    this.props.onSalaryChange({
      isSalary: this.state.isSalary,
      isHourly: this.state.isHourly,
      value,
    });
  }

  _onCategoryChange(index) {
    let categoryId = null;
    let pos = 1;

    this.props.categories.forEach(function(c, id) {
      if (pos === index) {
        categoryId = id;
      }
      pos++;
    });

    this.props.onCategoryChange(categoryId);
  }

  _onCompanyChange(index) {
    let companyId = null;
    let pos = 1;

    this.props.clients.forEach(function(c, id) {
      if (pos === index) {
        companyId = id;
      }
      pos++;
    });
    this.props.onCompanyChange(companyId);
  }

  _onMoneyChange(index) {

    let isSalary = (index === 2) ? (true) : (false);
    let isHourly = (index === 0) ? (true) : (false);

    let value = null;
    if (isSalary) {
      value = this.state.salary;
    } else if (isHourly) {
      value = this.state.hourlySalary;
    }

    this.props.onSalaryChange({
      isSalary,
      isHourly,
      value,
    });

    this.setState({
      isSalary,
      isHourly,
    });
  }

  _onHiringManagerChange(index) {
    let contactId = null;
    let pos = 1;

    this.props.contacts.forEach(function(c, id) {
      if (pos === index) {
        contactId = id;
      }
      pos++;
    });
    this.props.onContactChange(contactId);
  }

  _onLocationChange(index) {
    let locationId = null;
    let pos = 1;

    this.props.locations.forEach(function(l) {
      if (pos === index) {
        locationId = l.get('id');
      }
      pos++;
    });
    this.props.onLocationChange(locationId);
  }

  _renderContents() {

    let { company } = this.props;
    let contacts = [];

    // default indexes
    let clientDefaultSlide = 0;
    let locationDefaultSlide = 0;
    let hrDefaultSlide = 0;

    /* clients */

    let clients = [];
    let pos = 1;
    this.props.clients.forEach(function(c) {
      clients.push(<ClientListItem company={c} type="tiny" />);
      if (company && company.get('id') === c.get('id')) {
        clientDefaultSlide = pos;
      }
      pos++;
    });

    /* job template */

    let categories = [];
    this.props.categories.forEach(function(c) {
      categories.push(<JobTemplateListItem jobTemplate={c} type="tiny" />);
    });

    /* hr manager */

    if (company) {
      this.props.contacts.forEach(function(c) {
        contacts.push(<ContactListItem contact={c} company={company} type="tiny" />);
        hrDefaultSlide = 1;
      });
    }

    /* location */

    let locations = [];
    this.props.locations.forEach(function(l) {
      locations.push(<LocationListItem location={l} type="tiny" />);
      locationDefaultSlide = 1;
    });

    /* salary */

    let money = [
      <div style={{padding: '0px 20px'}}>
        <RangeSlider
            min={0}
            max={150}
            step={0.5}
            value={this.state.hourlySalary}
            onChange={this._onHourlySalaryChange.bind(this)}
            format="money"
        />
      </div>,
      <div style={{padding: '0px 20px'}}>
        <RangeSlider
            min={0}
            max={180000}
            step={1000}
            value={this.state.salary}
            onChange={this._onSalaryChange.bind(this)}
            format="money"
        />
      </div>,
    ];

    return (
      <div>
        <div className="row center-xs" style={style.pictureRow}>
          <div className="col-xs-10">
            <div className="box" style={style.pictureBox}>
              {(() => {
                if(this.props.jobImage){
                  return (<img style={style.orderDefault} src={this.props.jobImage.get('item')}></img>);
                } else {
                  return (<img style={style.orderDefault} src="/img/job-order-default.jpg" />);
                }
              })()}
              <div style={style.addImage}>
                <FileInput
                    label={
                      <div>
                        <div>{this.props.jobImage ? 'Change Image' : 'Add Image'}</div>
                        <IconButton style={style.addImageIcon} iconClassName="material-icons">camera_alt</IconButton>
                      </div>
                    }
                    onFileChanged={this.onImageChange.bind(this)}
                />
                  <LinearProgress mode="determinate" style={style.progress} value={this.props.job && this.props.job.get('percentUploaded')} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <JobOrderSwipeArea title={'Client'} items={clients} onChange={this._onCompanyChange.bind(this)} selected={clientDefaultSlide}/>
          <JobOrderSwipeArea title={'Job Description'} items={categories} onChange={this._onCategoryChange.bind(this)} />
          <JobOrderMoneySwipeArea title={'Hourly - Salary'} leftItems={[money[0]]} rightItems={[money[1]]} onChange={this._onMoneyChange.bind(this)} />
          <JobOrderSwipeArea title={'Hiring Manager'} items={contacts} onChange={this._onHiringManagerChange.bind(this)} selected={hrDefaultSlide} />
          <JobOrderSwipeArea title={'Location'} items={locations} onChange={this._onLocationChange.bind(this)} selected={locationDefaultSlide}/>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Toolbar style={style.toolbarInline}>
          <ToolbarGroup key={0} float="left">
            <IconButton onTouchTap={this._handleClose.bind(this)} style={style.toolbarIcon} iconStyle={{'color': '#ffffff'}} iconClassName="material-icons">close</IconButton>
            <ToolbarTitle style={style.toolbarTitle} text={'Job Order'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={style.toolbarFlat}>Save</FlatButton>
          </ToolbarGroup>
        </Toolbar>
        <div style={{height:'64px'}}></div>
        <div>
          {this._renderContents()}
        </div>
      </div>
    );
  }
}

JobCreate.propTypes = {
  categories: React.PropTypes.object,
  clients: React.PropTypes.object,
  company: React.PropTypes.object,
  contacts: React.PropTypes.object,
  job: React.PropTypes.object,
  locations: React.PropTypes.array,
  onCategoryChange: React.PropTypes.func.isRequired,
  onCompanyChange: React.PropTypes.func.isRequired,
  onContactChange: React.PropTypes.func.isRequired,
  onImageChange: React.PropTypes.func.isRequired,
  onJobChange: React.PropTypes.func.isRequired,
  onLocationChange: React.PropTypes.func.isRequired,
  onSalaryChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
};
