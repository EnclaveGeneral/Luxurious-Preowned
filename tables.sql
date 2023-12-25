CREATE TABLE "cars" (
	"id"	INTEGER,
	"name"	TEXT,
	"datemade"	NUMERIC DEFAULT CURRENT_TIMESTAMP,
	"fuel"	TEXT,
	"type"	TEXT,
	"price"	INTEGER,
	"img"	TEXT,
	"descr"	TEXT,
	"selling"	TEXT DEFAULT 'yes',
	"userid"	INTEGER,
	FOREIGN KEY("userid") REFERENCES "users"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "transactions" (
	"id"	INTEGER,
	"date"	NUMERIC DEFAULT CURRENT_TIMESTAMP,
	"buyer"	INTEGER,
	"seller"	INTEGER,
	"car"	INTEGER,
	FOREIGN KEY("buyer") REFERENCES "users"("id"),
	FOREIGN KEY("seller") REFERENCES "users"("id"),
	FOREIGN KEY("car") REFERENCES "cars"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "users" (
	"id"	INTEGER,
	"username"	TEXT,
	"password"	TEXT,
	"email" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
)