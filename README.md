node-sybase
---------

A simple node.js wrapper around a Java application that provides easy access to Sybase databases via jconn3. The main goal is to allow easy installation without the requirements of installing and configuring odbc or freetds. You do however have to have java 1.5 or newer installed.

requirements
------------

* java 1.5+

install
-------

### git

```bash
git clone git://github.com/rodhoward/node-sybase.git
cd node-sybase
node-gyp configure build
```
### npm

```bash
npm install sybase
```

quick example
-------------

```javascript
var Sybase = require('sybase'),
	db = new Sybase('host', port, 'dbName', 'username', 'pw');

db.connect(function (err) {
  if (err) return console.log(err);
  
  db.query('select * from user where user_id = 42', function (err, data) {
    if (err) console.log(err);
    
    console.log(data);

    db.disconnect();

  });
});
```

api
-------------

The api is super simple. It makes use of standard node callbacks so that it can be easily used with promises. here is the full list of arguments:

```
new Sybase(host: string, port: int, dbName: string, username: string, password: string, logTiming?: boolean, javaJarPath?: string, options?: SybaseOptions)
```
Where the SybaseOptions interface includes:
```
SybaseOptions {
  encoding: string, // Node.js IPC encoding, defaults to "utf8"
  javaEncoding: string, // Java database communication encoding, defaults to null (uses system default)
  extraLogs: boolean // defaults to false
}
```

There is an example manually setting the java jar path:
```javascript 
var logTiming = true,
	javaJarPath = './JavaSybaseLink/dist/JavaSybaseLink.jar',
	db = new Sybase('host', port, 'dbName', 'username', 'pw', logTiming, javaJarPath);
```

The java Bridge now optionally looks for a "sybaseConfig.properties" file in which you can configure jconnect properties to be included in the connection. This should allow setting properties like:
```properties
ENCRYPT_PASSWORD=true
```

### Character Encoding Support

For databases using legacy character encodings (like Windows-1252), you can specify separate encoding configurations:

```javascript
var Sybase = require('sybase'),
  db = new Sybase('host', port, 'dbName', 'username', 'pw', false, null, {
    encoding: 'latin1',     // Node.js IPC encoding 
    javaEncoding: 'Cp1252', // Java database communication encoding
    extraLogs: false
  });

db.connect(function (err) {
  if (err) return console.log(err);
  
  // Now queries with special characters (accents, cedillas, etc.) should work correctly
  db.query('SELECT * FROM usuarios WHERE nome = "José"', function (err, data) {
    if (err) console.log(err);
    console.log(data);
    db.disconnect();
  });
});
```

**Encoding Parameters:**
- `encoding`: Controls Node.js stdin/stdout encoding for communication with the Java process
- `javaEncoding`: Sets the Java system encoding (`-Dfile.encoding`) for database communication

Common encoding combinations:
- **Windows-1252 databases**: `encoding: 'latin1', javaEncoding: 'Cp1252'`  
- **ISO-8859-1 databases**: `encoding: 'latin1', javaEncoding: 'ISO-8859-1'`
- **UTF-8 databases** (default): `encoding: 'utf8'` (javaEncoding not needed)