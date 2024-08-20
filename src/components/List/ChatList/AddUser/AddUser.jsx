import React from "react";
import "./addUser.scss"

const AddUser = () => {
  return (
    <div className="addUser">
      <form>
        <input type="text" name="username" placeholder="Username" />
        <button>Search</button>
      </form>
      <div className="user">
        <div className="detail">
          <img src="./avatar.png" alt="" />
          <span>Moshe Shloimi</span>
        </div>
        <button>Add User</button>
      </div>
    </div>
  );
};

export default AddUser;
