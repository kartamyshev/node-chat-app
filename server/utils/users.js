class Users {
  constructor() {
    this.items = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.items.push(user);
    return user;
  }

  removeUser(id) {
    const user = this.getUser(id);
    if (user) {
      this.items = this.items.filter(item => item.id !== id);
    }
    return user;
  }

  getUser(id) {
    return this.items.filter(item => item.id === id)[0];
  }

  getUserLlist(room) {
    return this.items
      .filter(user => user.room === room)
      .map(user => user.name);
  }
}

module.exports = { Users };
