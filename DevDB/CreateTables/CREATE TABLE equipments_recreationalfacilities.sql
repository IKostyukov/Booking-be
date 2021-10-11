CREATE TABLE IF NOT EXISTS public.equipments_recreationalfacilities
(
    id serial NOT NULL,
    active boolean DEFAULT false NOT NULL,
    recreationalfacility_id int NOT NULL,
    equipment_id smallint NOT NULL,
    quantity smallint NOT NULL,
    ctime timestamp without time zone NOT NULL,
    mtime timestamp without time zone,
    PRIMARY KEY (id)
);

ALTER TABLE public.equipments_recreationalfacilities
    OWNER to sport;