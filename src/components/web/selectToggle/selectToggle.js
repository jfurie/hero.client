import React from 'react';
import { Styles } from 'material-ui';

let styles = {
  display: 'table',
  width: '100%',

  selectBoxRow: {
    display: 'table-row',
  },
  selectBoxCell: {
    display: 'table-cell',
    textAlign: 'center',
  },
  selectBoxLabel: {
    width: '100%',
    padding: '15px 0',
    border: '3px solid #ddd',
    borderLeftStyle: 'none',
    borderRightStyle: 'none',
    borderColor: '#ddd',
    firstCell: {
      borderLeftStyle: 'solid',
    },
    lastCell: {
      borderRightStyle: 'solid',
    },
    selectedCell: {
      borderColor: Styles.Colors.blue600,
      backgroundColor: Styles.Colors.blue600,
      color: '#fff',
      borderLeftStyle: 'none',
      borderRightStyle: 'none',
      textTransform: 'uppercase',
    },
  },
};

export default class SelectToggle extends React.Component {
  constructor(props) {
    super(props);
  }

  _onChange(value) {
    this.props.onChange(value);
  }

  render() {
    let { options, value } = this.props;

    return (
      <div style={styles}>
        <div style={styles.selectBoxRow}>
        {
          options.map((option, key) => {
            let isSelected = option.value == value;
            return (
              <div onClick={this._onChange.bind(this, option.value)} key={key} style={{...styles.selectBoxCell, width: `${option.size}%`}}>
                <div style={{
                  ...styles.selectBoxLabel,
                  ...(key == 0 ? styles.selectBoxLabel.firstCell : {}),
                  ...(key == options.length - 1 ? styles.selectBoxLabel.lastCell : {}),
                  ...(isSelected ? styles.selectBoxLabel.selectedCell : {}),
                }}
                >
                {option.value}
                </div>
              </div>
            );
          })
        }
        </div>
      </div>
    );
  }
}
