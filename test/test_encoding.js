var expect = require("chai").expect;
var Sybase = require("../src/SybaseDB.js");

describe("Character Encoding Support", function() {
	
	describe("Constructor Compatibility", function() {
		
		it("Should support backward compatibility without encoding parameters", function() {
			var db = new Sybase('localhost', 5000, 'test', 'user', 'password');
			
			expect(db.encoding).to.equal('utf8');
			expect(db.javaEncoding).to.equal(null);
			expect(db.extraLogs).to.equal(false);
		});

		it("Should support legacy constructor with logTiming", function() {
			var db = new Sybase('localhost', 5000, 'test', 'user', 'password', true);
			
			expect(db.logTiming).to.equal(true);
			expect(db.encoding).to.equal('utf8');
			expect(db.javaEncoding).to.equal(null);
		});

		it("Should accept encoding parameter only", function() {
			var db = new Sybase('localhost', 5000, 'test', 'user', 'password', false, null, {
				encoding: 'latin1'
			});
			
			expect(db.encoding).to.equal('latin1');
			expect(db.javaEncoding).to.equal(null);
			expect(db.extraLogs).to.equal(false);
		});

		it("Should accept javaEncoding parameter only", function() {
			var db = new Sybase('localhost', 5000, 'test', 'user', 'password', false, null, {
				javaEncoding: 'Cp1252'
			});
			
			expect(db.encoding).to.equal('utf8'); // default
			expect(db.javaEncoding).to.equal('Cp1252');
			expect(db.extraLogs).to.equal(false);
		});

		it("Should accept both encoding parameters (main feature)", function() {
			var db = new Sybase('localhost', 5000, 'test', 'user', 'password', false, null, {
				encoding: 'latin1',
				javaEncoding: 'Cp1252',
				extraLogs: true
			});
			
			expect(db.encoding).to.equal('latin1');
			expect(db.javaEncoding).to.equal('Cp1252');
			expect(db.extraLogs).to.equal(true);
		});

		it("Should preserve all other constructor parameters", function() {
			var customJarPath = './custom/path/JavaSybaseLink.jar';
			var db = new Sybase('testhost', 9999, 'testdb', 'testuser', 'testpass', true, customJarPath, {
				encoding: 'latin1',
				javaEncoding: 'Cp1252'
			});
			
			expect(db.host).to.equal('testhost');
			expect(db.port).to.equal(9999);
			expect(db.dbname).to.equal('testdb');
			expect(db.username).to.equal('testuser');
			expect(db.password).to.equal('testpass');
			expect(db.logTiming).to.equal(true);
			expect(db.pathToJavaBridge).to.equal(customJarPath);
			expect(db.encoding).to.equal('latin1');
			expect(db.javaEncoding).to.equal('Cp1252');
		});
	});

	describe("Java Arguments Generation", function() {
		
		it("Should not modify Java args when javaEncoding is null", function() {
			var db = new Sybase('localhost', 5000, 'test', 'user', 'password');
			
			// We can't easily test the exact spawn arguments without mocking,
			// but we can verify the object properties are set correctly
			expect(db.javaEncoding).to.equal(null);
		});

		it("Should prepare for Java encoding when javaEncoding is set", function() {
			var db = new Sybase('localhost', 5000, 'test', 'user', 'password', false, null, {
				javaEncoding: 'Cp1252'
			});
			
			expect(db.javaEncoding).to.equal('Cp1252');
			// The actual spawn args modification happens in connect() method
			// and would require a real database connection to test fully
		});
	});

	// Note: Actual database connection tests would require a real Sybase instance
	// and are not included here to keep tests runnable without external dependencies
});