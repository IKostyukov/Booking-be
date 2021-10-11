CREATE TABLE IF NOT EXISTS public.equipments_recreationalfacilities
(
    id integer NOT NULL DEFAULT nextval('equipments_recreationalfacilities_id_seq'::regclass),
    active boolean NOT NULL DEFAULT false,
    recreationalfacility_id integer NOT NULL,
    equipment_id smallint NOT NULL,
    quantity smallint NOT NULL,
    ctime timestamp without time zone NOT NULL,
    mtime timestamp without time zone,
    CONSTRAINT equipments_recreationalfacilities_pkey PRIMARY KEY (id),
    FOREIGN KEY (recreationalfacility_id) REFERENCES recreational_facilities(id) ON DELETE CASCADE,
	FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.equipments_recreationalfacilities
    OWNER to sport;