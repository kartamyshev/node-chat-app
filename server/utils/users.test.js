const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {

  let users;
  beforeEach(() => {
    users = new Users();
    users.items = [{
        id: 1,
        name: 'Mike',
        room: 'Node Course'
      }, {
        id: 2,
        name: 'Jen',
        room: 'React Course'
      }, {
        id: 3,
        name: 'Julie',
        room: 'Node Course'
      }
    ];
  });

  it('should add a new user', () => {
    const users = new Users();
    const user = {
      id: 1,
      name: 'Konstantin',
      room: 'The Office Fans'
    };
    const resUser = users.addUser(user.id, user.name, user.room);
    expect(users.items).toEqual([user]);
  });

  it('should return names for node course', () => {
    const usersList = users.getUserLlist('Node Course');
    expect(usersList).toEqual(['Mike', 'Julie']);
  });

  it('should return names for react course', () => {
    const usersList = users.getUserLlist('React Course');
    expect(usersList).toEqual(['Jen']);
  });

  it('should remove a user', () => {
    const userId = 2;
    const user = users.removeUser(userId);
    expect(user).toEqual({
      id: 2,
      name: 'Jen',
      room: 'React Course'
    });
    expect(users.items.length).toBe(2);
  });

  it('should not remove user in case of inexistent id', () => {
    const userId = 12;
    const user = users.removeUser(userId);
    expect(user).toNotExist();
    expect(users.items.length).toBe(3);
  });

  it('should find user', () => {
    const userId = 2;
    const user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    const userId = 14;
    const user = users.getUser(userId);
    expect(user).toNotExist();
  });
});
