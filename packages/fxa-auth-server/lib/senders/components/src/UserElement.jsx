import React from 'react';

const UserElement = ({user,classname}) => (
    <div className={classname}>
      <p>Hello {user.userName}</p>
      <p>Thank you for subscribing to our newsletter</p>
    </div>
);

export default UserElement;