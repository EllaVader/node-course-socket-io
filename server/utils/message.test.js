var expect = require('expect');
var {generateMessage} = require('./message');

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