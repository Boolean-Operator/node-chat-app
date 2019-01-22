class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    //add user to users array
    let user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    //return user that was removed
    let user = this.getUser(id);
    if(user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  getUser (id) {
    //return user with given
    return this.users.filter((user) => user.id ===id)[0];
// OR do it in four lines
    // let user = this.users.filter((users) => {
    //   return users.id === id
    // })[0];
    // return user;
  }
  getUserList (room) {
    //get list of users in a given room
    let users = this.users.filter((user) => {
      return user.room === room
    });
    let namesArray = users.map((user) => user.name);
    return namesArray;
  }
}


module.exports = {Users};
