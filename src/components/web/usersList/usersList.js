import React from 'react';

class UsersList extends React.Component {

  render() {

    let { users, controls } = this.props;

    controls = controls || false;

    return (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            {(controls) ? (
              <th>Actions</th>
            ) : (null)}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            return (
              <tr key={index}>
                <td>#{index + 1}</td>
                <td>{user.name}</td>
                {(controls) ? (
                  <th>X</th>
                ) : (null)}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

UsersList.propTypes = {
  users: React.PropTypes.array.isRequired,
  controls: React.PropTypes.bool,
};

export default UsersList;
