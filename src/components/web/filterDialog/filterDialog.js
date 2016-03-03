import React from 'react';
import { Paper, Styles, Dialog, FlatButton } from 'material-ui';

const style = {
  filterDialog: {
    paddingTop: '0px',
    body: {
      paddingTop: '0px',
      height: '100%',
      padding: '0',
    },
    content: {
      width: '100%',
      maxWidth: 'none',
      height: '100%',
      maxHeight: '100%',
      paddingTop: '0px',
      top: '-80px',
    },
    header: {
      padding: '15px',
      color: '#fff',
      backgroundColor: Styles.Colors.blue600,
      title: {
        color: '#fff',
        fontSize: '22px',
        textTransform: 'none',
        fontWeight: 'normal',
      },
      action: {
        color: '#fff',
        fontWeight: 'normal',
      },
    },
    innerContent: {
      padding: '15px',
    },
    splitAction: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      leftAction: {
        width: '50%',
        textAlign: 'center',
        label: {
          borderRight: '1px solid #ddd',
          padding: '15px',
        },
      },
      rightAction: {
        width: '50%',
        textAlign: 'center',
        label: {
          borderLeft: '1px solid #ddd',
          padding: '15px',
          color: Styles.Colors.blue600,
        },
      },
    },
  },
};

class FilterDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  onApply() {
    this.props.onApply();
  }

  onClear() {
    this.props.onClear();
  }

  onCancel() {
    this.props.onCancel();
  }

  render() {
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return (
      <div>
      <Dialog
          modal={false}
          style={style.filterDialog}
          bodyStyle={style.filterDialog.body}
          contentStyle={style.filterDialog.content}
          autoDetectWindowHeight={false}
          autoScrollBodyContent={false}
          open={this.props.open}
      >
        <div style={{height: `${clientHeight}px`}}>
          <div className="row between-xs" style={style.filterDialog.header}>
            <div><FlatButton labelStyle={style.filterDialog.header.title} label="Filters"/></div>
            <div><FlatButton onTouchTap={this.onClear.bind(this)} labelStyle={style.filterDialog.header.action} label="Clear Filters"/></div>
          </div>
          <div style={style.filterDialog.innerContent}>
            {this.props.children}
          </div>
          <Paper style={style.filterDialog.splitAction} className="row between-xs">
            <div style={style.filterDialog.splitAction.leftAction}>
              <div onClick={this.onCancel.bind(this)} style={style.filterDialog.splitAction.leftAction.label}>Cancel</div>
            </div>
            <div style={style.filterDialog.splitAction.rightAction}>
              <div onClick={this.onApply.bind(this)} style={style.filterDialog.splitAction.rightAction.label}>Apply</div>
            </div>
          </Paper>
        </div>
      </Dialog>

      </div>
    );
  }
}

export default FilterDialog;
