const expect = require('expect');
const {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'Mark';
    let text = 'test text message';
    let message = generateMessage(from, text);
      expect(message.createdAt).toBeA('number');
      //
      expect(message.from).toBe('Mark');
      expect(message.text).toBe('test text message');
      // more compact & efficient way
      expect(message).toInclude({from,text});
  });
});

describe('generateLocationMessage', ()=> {
  it('should generate correct location object', () => {
    let from = 'Mark';
    let latitude = 123;
    let longitude = 456;
    let url = `https://www.google.com/maps?q=${latitude},${longitude}`
    let message = generateLocationMessage(from, latitude, longitude);
    // console.log(message);
      expect(message.createdAt).toBeA('number');
      expect(message.from).toBe(from);
      expect(message.url).toBe(`${url}`);
      // more compact & efficient way
      expect(message).toInclude({from, url});

  });
});
