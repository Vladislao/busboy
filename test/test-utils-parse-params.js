var parseParams = require('../lib/utils').parseParams;

var path = require('path'),
    assert = require('assert'),
    inspect = require('util').inspect;

var group = path.basename(__filename, '.js') + '/';

[
  { source: 'video/ogg',
    expected: ['video/ogg'],
    what: 'No parameters'
  },
  { source: 'video/ogg;',
    expected: ['video/ogg'],
    what: 'No parameters (with separator)'
  },
  { source: 'video/ogg; ',
    expected: ['video/ogg'],
    what: 'No parameters (with separator followed by whitespace)'
  },
  { source: ';video/ogg',
    expected: ['', 'video/ogg'],
    what: 'Empty parameter'
  },
  { source: 'video/*',
    expected: ['video/*'],
    what: 'Subtype with asterisk'
  },
  { source: 'text/plain; encoding=utf8',
    expected: ['text/plain', ['encoding', ['utf8', false]]],
    what: 'Unquoted'
  },
  { source: 'text/plain; encoding=',
    expected: ['text/plain', ['encoding', ['', false]]],
    what: 'Unquoted empty string'
  },
  { source: 'text/plain; encoding="utf8"',
    expected: ['text/plain', ['encoding', ['utf8', false]]],
    what: 'Quoted'
  },
  { source: 'text/plain; greeting="hello \\"world\\""',
    expected: ['text/plain', ['greeting', ['hello "world"', false]]],
    what: 'Quotes within quoted'
  },
  { source: 'text/plain; encoding=""',
    expected: ['text/plain', ['encoding', ['', false]]],
    what: 'Quoted empty string'
  },
  { source: 'text/plain; encoding="utf8";\t   foo=bar;test',
    expected: ['text/plain', ['encoding', ['utf8', false]], ['foo', ['bar', false]], 'test'],
    what: 'Multiple params with various spacing'
  },
  { source: "text/plain; filename*=iso-8859-1'en'%A3%20rates",
    expected: ['text/plain', ['filename', ['£ rates', true]]],
    what: 'Extended parameter (RFC 5987) with language'
  },
  { source: "text/plain; filename*=utf-8''%c2%a3%20and%20%e2%82%ac%20rates",
    expected: ['text/plain', ['filename', ['£ and € rates', true]]],
    what: 'Extended parameter (RFC 5987) without language'
  },
  { source: "text/plain; filename*=utf-8''%E6%B5%8B%E8%AF%95%E6%96%87%E6%A1%A3",
    expected: ['text/plain', ['filename', ['测试文档', true]]],
    what: 'Extended parameter (RFC 5987) without language #2'
  },
  { source: "text/plain; filename*=iso-8859-1'en'%A3%20rates; altfilename*=utf-8''%c2%a3%20and%20%e2%82%ac%20rates",
    expected: ['text/plain', ['filename', ['£ rates', true]], ['altfilename', ['£ and € rates', true]]],
    what: 'Multiple extended parameters (RFC 5987) with mixed charsets'
  },
  { source: "text/plain; filename*=iso-8859-1'en'%A3%20rates; altfilename=\"foobarbaz\"",
    expected: ['text/plain', ['filename', ['£ rates', true]], ['altfilename', ['foobarbaz', false]]],
    what: 'Mixed regular and extended parameters (RFC 5987)'
  },
  { source: "text/plain; filename=\"foobarbaz\"; altfilename*=iso-8859-1'en'%A3%20rates",
    expected: ['text/plain', ['filename', ['foobarbaz', false]], ['altfilename', ['£ rates', true]]],
    what: 'Mixed regular and extended parameters (RFC 5987) #2'
  },
  { source: 'text/plain; filename="C:\\folder\\test.png"',
    expected: ['text/plain', ['filename', ['C:\\folder\\test.png', false]]],
    what: 'Unescaped backslashes should be considered backslashes'
  },
  { source: 'text/plain; filename="John \\"Magic\\" Smith.png"',
    expected: ['text/plain', ['filename', ['John "Magic" Smith.png', false]]],
    what: 'Escaped double-quotes should be considered double-quotes'
  },
  { source: 'multipart/form-data; charset=utf-8; boundary=0xKhTmLbOuNdArY',
    expected: ['multipart/form-data', ['charset', ['utf-8', false]], ['boundary', ['0xKhTmLbOuNdArY', false]]],
    what: 'Multiple non-quoted parameters'
  },
].forEach(function(v) {
  var result = parseParams(v.source),
      msg = '[' + group + v.what + ']: parsed parameters mismatch.\n'
            + 'Saw: ' + inspect(result) + '\n'
            + 'Expected: ' + inspect(v.expected);
  assert.deepEqual(result, v.expected, msg);
});
