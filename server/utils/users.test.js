const expect = require('expect');

const {Users} = require('./users.js');

describe('Users', () => {
  let users;

  beforeEach(() => {
      users = new Users();
      users.users = [{
        id: '1',
        name: 'Kami',
        room: 'Node Course'
      }, {
        id: '2',
        name: 'Andy',
        room: 'React Course'
      }, {
        id: '3',
        name: 'Logan',
        room: 'Node Course'
      }]
  });

  it('should add new user', () => {
      let users = new Users();
      let user = {
        id: '123',
        name: 'Mark',
        room: 'The Office Fans'
      };
      let resUser = users.addUser(user.id, user.name, user.room);
      expect(users).toInclude(resUser)

      expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    let userId = '1';
    let user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    let userId = '128';
    let user = users.removeUser(userId);
    console.log(users);
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    let userId = '3';
    let user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    let userId = '44';
    let user = users.getUser(userId);
    expect(user).toNotExist();
  });

  it('should return names for Node Course room', () => {
    let userList = users.getUserList('Node Course');
    expect(userList).toEqual(['Kami', 'Logan'])
  });

  it('should return names for React Course room', () => {
    let userList = users.getUserList('React Course');
    expect(userList).toEqual(['Andy'])
  });


});
