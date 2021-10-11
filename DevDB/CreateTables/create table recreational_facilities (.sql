create table recreational_facilities (
	id SERIAL NOT NULL PRIMARY KEY,
	active BOOLEAN NOT NULL DEFAULT false,
	recreationalfacility_name VARCHAR(50) NOT NULL,
	user_id INT NOT NULL,
	timetable_id INT NOT NULL,
	type VARCHAR(17) NOT NULL,
	geolocation_latitude VARCHAR(50),
	geolocation_longitude VARCHAR(50),
	location VARCHAR(30),
	adress VARCHAR(200) NOT NULL,
	post_index VARCHAR(5),
	rating DECIMAL(4,2),
	ctime TIMESTAMP without time zone NOT NULL,
	mtime TIMESTAMP without time zone,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (timetable_id) REFERENCES timetables(id) ON DELETE CASCADE
);