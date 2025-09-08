
/*
 * The idea is to recive json messages in containing
 * { "msgId" : 1, "sql" : "select * from blar"}   on standard in.
 *
 * Then on standard out send
 * { "msgId" : 1, "rows" : [{},{}]}  back on standard out where the msgId matches the sent message.
 */

public class Main implements SQLRequestListener {

	String host;
	Integer port;
	String dbname;
	String username;
	String password;
	SybaseDB db;
	StdInputReader input;

    public static void main(String[] args) {

		Main m;
		String pw = "";
		String encoding = null;
		if (args.length < 4 || args.length > 6)
		{
			System.err.println("Expecting the arguments: host, port, dbname, username, [password], [encoding]");
			System.exit(1);
		}
		if (args.length >= 5)
			pw = args[4];
		if (args.length == 6)
			encoding = args[5];

		m = new Main(args[0], Integer.parseInt(args[1]), args[2], args[3], pw, encoding);
    }

	public Main(String host, Integer port, String dbname, String username, String password) {
		this(host, port, dbname, username, password, null);
	}

	public Main(String host, Integer port, String dbname, String username, String password, String encoding) {
		this.host = host;
		this.port = port;
		this.dbname = dbname;
		this.username = username;
		this.password = password;

		input = new StdInputReader(encoding);
		input.addListener(this);

		MyProperties props = new MyProperties("sybaseConfig.properties");
		db = new SybaseDB(host, port, dbname, username, password, props.properties);
		if (!db.connect())
			System.exit(1);

		// send the connected message.
		System.out.println("connected");

		// blocking call don't do anything under here.
		input.startReadLoop();
	}

	public void sqlRequest(SQLRequest request)
	{
		db.execSQL(request);
		//System.out.println(result);
	}


}