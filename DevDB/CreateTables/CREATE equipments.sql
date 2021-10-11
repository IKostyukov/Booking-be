CREATE TABLE IF NOT EXISTS public.equipments
(
    id smallint NOT NULL DEFAULT nextval('equipments_id_seq'::regclass),
    activity_id smallint NOT NULL,
    equipment_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    capacity character varying(2) COLLATE pg_catalog."default",
    CONSTRAINT equipments_pkey PRIMARY KEY (id),
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.equipments
    OWNER to sport;