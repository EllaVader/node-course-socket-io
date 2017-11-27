class Users {
  constructor(){
    this.users = [];
  }

  addUser(id, name, room){
    //create a user object
    var user = {id, name, room};
    //add it to our users array
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    //return the user we just removed
    var user = this.getUser(id);
    if(user){
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }

  getUser(id) {
    return this.users.find((user) => user.id === id)

  }

  getUserList(room){
    //just get the elements in the user array that match the room
    var users = this.users.filter((user) => user.room === room);
    //create a new array from this array, just getting the users name
    var namesArray = users.map((user) => user.name);
    return namesArray;
  }
}

module.exports = {Users};

// class Person {
//
//   //constructor for our object
//   constructor(name, age){
//     this.name = name;
//     this.age = age;
//   }
//
//   //methods on classes
//   getUserDescription(){
//     return `${this.name} is ${this.age} year(s) old`;
//   }
// }
//
// //instance of class Person
// var me = new Person('Janine', 48);
// var description = me.getUserDescription();
// console.log(description);
