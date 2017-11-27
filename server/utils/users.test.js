const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
  var testUsers;

  //setup test method
  beforeEach(() => {
      testUsers = new Users();
      testUsers.users = [{
        id: '1',
        name: 'Mike',
        room: 'Node Course'
      },
      {
        id: '2',
        name: 'Jen',
        room: 'React Course'
      },
      {
        id: '3',
        name: 'Julie',
        room: 'Node Course'
      }];
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Janine',
      room: 'The Office Fans'
    };

    var responseUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should return names for node course', () => {
    var userList = testUsers.getUserList('Node Course');
    expect(userList).toEqual(['Mike', 'Julie']);
  });

  it('should return names for react course', () => {
    var userList = testUsers.getUserList('React Course');
    expect(userList).toEqual(['Jen']);
  });

  it('should remove a user', () => {
    var user = testUsers.removeUser('2');
    expect(user).toMatchObject({
      id: '2',
      name: 'Jen',
      room: 'React Course'
    });
    expect(testUsers.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var user = testUsers.removeUser('5');
    expect(user).toBeUndefined();
        expect(testUsers.users.length).toBe(3);
  });

  it('should find a user', () => {
    var user = testUsers.getUser('1');
    expect(user).toMatchObject({
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    });
  });

  it('should not find a user', () => {
    var user = testUsers.getUser('5');
    expect(user).toBeUndefined();
  })
});
