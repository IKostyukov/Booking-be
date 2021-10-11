CREATE TABLE IF NOT EXISTS public.users_roles
(
    user_id integer NOT NULL,
    role_id smallint NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT role_id FOREIGN KEY (role_id)
        REFERENCES public.roles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public.users_roles
    OWNER to sport;

-- // запрос простой  для проверки работы отношений MANY-TO-MANY таблиц users, roles, users_roles
-- // SELECT users.first_name, roles.* FROM users LEFT JOIN users_roles  ON users.id=users_roles.user_id LEFT JOIN roles ON users_roles.role_id=roles.id; 
