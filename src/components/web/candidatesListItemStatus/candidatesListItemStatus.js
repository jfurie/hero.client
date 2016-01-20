import React from 'react';
import { Styles } from 'material-ui';

import ActionDone from 'material-ui/lib/svg-icons/action/done';
import AvNotInterested from 'material-ui/lib/svg-icons/av/not-interested';

class CandidatesListItemStatus extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let { status, style } = this.props;

    if (status === 'interested') {
      style.backgroundColor = Styles.Colors.lightGreen600;
    } else if (status === 'notinterested') {
      style.backgroundColor = Styles.Colors.red600;
    }

    style.width = 'auto';
    style.padding = '5px';
    style.borderRadius = '3px';
    style.fill = '#FFF';
    style.marginTop = '7px';

    return (
      <div>
        {(status === 'notinterested') ? (
          <AvNotInterested style={style} />
        ) : (null)}

        {(status === 'interested') ? (
          <ActionDone style={style} />
        ) : (null)}
      </div>
    );
  }
}

CandidatesListItemStatus.propTypes = {
  status: React.PropTypes.string.isRequired,
  style: React.PropTypes.object,
};

export default CandidatesListItemStatus;
