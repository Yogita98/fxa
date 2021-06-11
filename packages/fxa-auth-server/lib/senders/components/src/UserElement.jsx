// var user = require("./userData");

const user = {
    userName: "XYZ",
  };
  
  const UserElement = () => (
    <div>
      <p>Hello {user.userName}</p>
      <p>Thank you for subscribing to our newsletter</p>
    </div>
  );
  
  export default UserElement;
  