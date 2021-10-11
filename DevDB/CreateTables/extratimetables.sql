CREATE TABLE IF NOT EXISTS public.extratimetables
   (
       id serial NOT NULL,
       recreationalfacility_id int NOT NULL,
       date timestamp with time zone NOT NULL,
       start_time timestamp with time zone NOT NULL,
       end_time timestamp with time zone NOT NULL,
       ctime timestamp without time zone NOT NULL,
       mtime timestamp without time zone,
       PRIMARY KEY (id),
       FOREIGN KEY (recreationalfacility_id) REFERENCES recreational_facilities(id) ON DELETE CASCADE
   );
