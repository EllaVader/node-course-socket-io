var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    var from = 'testUser';
    var text = 'This is a test message';
    var message = generateMessage(from, text);
    //expect(message.from).toBe(from);
    //expect(message.text).toBe(text);
    expect(message).toMatchObject({from,text});
    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'testLocationUser';
    var lat = 15;
    var long = 10;
    var url = `https://www.google.com/maps?q=${lat},${long}`;
    var message = generateLocationMessage(from, lat, long);
    expect(message).toMatchObject({from,url});
    expect(typeof message.createdAt).toBe('number');
  });
});
