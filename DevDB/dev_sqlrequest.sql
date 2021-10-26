

              
--- Получить список пользователей ---

SELECT
users.id as userid, 
active, 
email, 
phone,
first_name, 
last_name, 
patronymic, 
users_roles.role_id as roles  
FROM
users  LEFT JOIN users_roles ON users.id = users_roles.user_id
WHERE
first_name LIKE '%Ivan%' 
OR 
last_name LIKE '%Ivanov%' 
OR 
email LIKE '%@%' 
OR
phone LIKE '%+375331543345%';


--###### Services ############

-- SELECT  r.id, recreationalfacility_name, 
-- location, address, distance_from_center, rating
-- FROM recreationalfacilities r 
-- LEFT JOIN services_recreationalfacilities s_r 
--         ON r.id = s_r.recreationalfacility_id 
-- WHERE rating > 20  AND distance_from_center < 4000 
-- AND location != 'Monywa' AND s_r.service_id != 2;

-- ################# FeedBack  ###########

-- SELECT  r.id, recreationalfacility_name, 
-- location, address, distance_from_center, rating, 
-- COUNT(f.id) as feedbacks 
-- FROM recreationalfacilities r 
-- LEFT  JOIN feedbacks f
--         ON  r.id = f.recreationalfacility_id
-- WHERE rating > 20  AND distance_from_center < 4000 
-- AND location != 'Monywa' 
-- GROUP BY r.id;

-- ############# FeedBack plus  Services ###########

-- SELECT  r.id, recreationalfacility_name, 
-- location, address, distance_from_center, rating, 
-- (SELECT COUNT(f.id) as feedbacks FROM feedbacks f
-- WHERE r.id = f.recreationalfacility_id)
-- FROM recreationalfacilities r 
-- LEFT JOIN services_recreationalfacilities s_r 
--         ON r.id = s_r.recreationalfacility_id 
-- WHERE rating > 20  AND distance_from_center < 4000 
-- AND location != 'Monywa' AND s_r.service_id != 2
-- GROUP BY r.id;




-- ################# Equipments, price, feedback (no services) ############

-- SELECT  r.id, recreationalfacility_name,
-- location, address, distance_from_center, rating, 
-- eq.id as equipment_id, eqr.id as eqr_id, eq.equipment_name,  eqr.quantity,
-- eqr.quantity - (SELECT  COUNT(bk.equipment_recreationalfacility_id)   FROM bookings bk 
--     WHERE (bk.booking_start,  bk.booking_end)  OVERLAPS 
--     (DATE '2021-05-23' + TIME '10:05:50+03', DATE '2022-05-23' + TIME '14:05:50+03')
--     AND  bk.equipment_recreationalfacility_id = 22)  as avaliable, 
-- MIN(fs.fare) as start_price
-- FROM recreationalfacilities r 
-- LEFT JOIN equipments_recreationalfacilities eqr 
--     ON  r.id = eqr.recreationalfacility_id 
-- LEFT JOIN equipments eq  
--     ON eqr.equipment_id = eq.id
-- LEFT JOIN fares fs
--     ON eqr.id = fs.equipment_recreationalfacility_id
-- WHERE distance_from_center < 10000 
-- AND location != 'Monywa' AND eq.id in (1,2,3,4,7,9)
-- AND fs.fare = (SELECT MIN(f.fare) FROM fares f 
--     WHERE f.equipment_recreationalfacility_id = eqr.id )
-- AND eqr.id  not in
--     (SELECT bk.equipment_recreationalfacility_id FROM bookings bk 
--     WHERE (bk.booking_start,  bk.booking_end)  OVERLAPS 
--     (DATE '2021-05-23' + TIME '10:05:50+03', DATE '2022-05-23' + TIME '14:05:50+03')
--     AND  bk.equipment_recreationalfacility_id = 22
--     AND eqr.quantity <
--         (SELECT  COUNT(bk.equipment_recreationalfacility_id)   FROM bookings bk 
--         WHERE (bk.booking_start,  bk.booking_end)  OVERLAPS 
--         (DATE '2021-05-23' + TIME '10:05:50+03', DATE '2022-05-23' + TIME '14:05:50+03')
--         AND  bk.equipment_recreationalfacility_id = 22) 
--     ) 
-- GROUP BY r.id, eq.id, eq.equipment_name, eqr.id, eqr.quantity;



-- ######################################


-- рабочий вариант поиска иевентаря /searchEquipment 
-- SELECT  r.id, recreationalfacility_name, 
-- location, address, distance_from_center as to_center, rating, 
-- (SELECT COUNT(f.id) as feedbacks FROM feedbacks f
-- WHERE r.id = f.recreationalfacility_id), 
-- eq.id as equipment_id, eqr.id as eqr_id, eq.equipment_name,  eqr.quantity,
-- eqr.quantity - (SELECT  COUNT(bk.equipment_recreationalfacility_id) as taken   FROM bookings bk 
--     WHERE (bk.booking_start,  bk.booking_end)  OVERLAPS 
--     (DATE '2021-05-23' + TIME '10:05:50+03', DATE '2021-05-23' + TIME '14:05:50+03')
--     AND  bk.equipment_recreationalfacility_id = eqr.id)  as avaliable, 
-- MIN(fs.fare) as start_price
-- FROM recreationalfacilities r
-- LEFT JOIN services_recreationalfacilities s_r 
--         ON r.id = s_r.recreationalfacility_id  
-- LEFT JOIN equipments_recreationalfacilities eqr 
--     ON  r.id = eqr.recreationalfacility_id 
-- LEFT JOIN equipments eq  
--     ON eqr.equipment_id = eq.id
-- LEFT JOIN fares fs
--     ON eqr.id = fs.equipment_recreationalfacility_id
-- WHERE 
-- distance_from_center < 10000 
-- AND location != 'Monywa' AND eq.id in (1,2,3,4,7,9)
-- AND fs.fare = (SELECT MIN(f.fare) FROM fares f 
--     WHERE f.equipment_recreationalfacility_id = eqr.id AND  f.fare >= 1500  AND f.fare <= 3000)
-- AND eqr.id  not in
--     (SELECT bk.equipment_recreationalfacility_id FROM bookings bk 
--     WHERE (bk.booking_start,  bk.booking_end)  OVERLAPS 
--     (DATE '2021-05-23' + TIME '10:05:50+03', DATE '2021-05-23' + TIME '14:05:50+03')
--     AND  bk.equipment_recreationalfacility_id = eqr.id
--     AND eqr.quantity <
--         (SELECT  COUNT(bk.equipment_recreationalfacility_id)   FROM bookings bk 
--         WHERE (bk.booking_start,  bk.booking_end)  OVERLAPS 
--         (DATE '2021-05-23' + TIME '10:05:50+03', DATE '2022-05-23' + TIME '14:05:50+03')
--         AND  bk.equipment_recreationalfacility_id = eqr.id) 
--     )
-- -- AND s_r.service_id  in (7) 
-- GROUP BY r.id, eq.id, eq.equipment_name, eqr.id, eqr.quantity;


--- Для теста обект №55 имеет 2 и 3 местные байдарки. Но какиих-то часть забронирована
--- Далее. Надо сделать отдельно запрос если не выбраны никакие удобства и такой же запрос с LEFT JOIN
--- если удобства выбраны, иначе отрезает те объекты, где хозяин не указал из при создании (cervices это NULLABLE)





-- ##############################



-- Рабочий вариант: Популярные виды отдыха и минимальная цена
-- SELECT  COUNT(b.id) as orders, activity_name, MIN(f.fare) as start_price
-- FROM activities a 
-- LEFT JOIN equipments e ON a.id = e.activity_id 
-- LEFT JOIN equipments_recreationalfacilities r ON e.id = r.equipment_id 
-- LEFT JOIN bookings b ON r.id = b.equipment_recreationalfacility_id 
-- LEFT JOIN fares  ON fares.equipment_recreationalfacility_id = b.equipment_recreationalfacility_id 
-- WHERE fares.fare = (SELECT MIN(f.fare) FROM fares f 
--         WHERE f.equipment_recreationalfacility_id = b.equipment_recreationalfacility_id )
-- GROUP BY activity_name
-- ORDER BY orders DESC LIMIT 3;

-- --  Для наглядности:  Все активности и инвентарь с ценой
-- SELECT  a.id as activity_id , activity_name, equipment_name, recreationalfacility_id, b.id as booking_number
-- FROM activities a 
-- LEFT JOIN equipments e ON a.id = e.activity_id 
-- LEFT JOIN equipments_recreationalfacilities r ON e.id = r.equipment_id 
-- LEFT JOIN bookings b ON r.id = b.equipment_recreationalfacility_id
-- LIMIT 100;


-- -- Популярные виды отдыха без цены
-- SELECT COUNT(a.id) as most_popular, activity_name  
-- FROM activities a 
-- LEFT JOIN equipments e ON a.id = e.activity_id 
-- LEFT JOIN equipments_recreationalfacilities r ON e.id = r.equipment_id 
-- LEFT JOIN bookings b ON r.id = b.equipment_recreationalfacility_id 
-- WHERE b.id IS NOT NULL
-- GROUP BY activity_name 
-- ORDER BY most_popular DESC LIMIT 3;

-- --Лучшие места отдыха  /bestRecreationalFacilities
-- SELECT r.id, recreationalfacility_name, 
-- location, address, distance_from_center, rating, 
-- COUNT(f.id) as feedbacks  
-- FROM recreationalfacilities r 
-- INNER  JOIN feedbacks f
--         ON  r.id = f.recreationalfacility_id 
-- WHERE rating > 90  
-- GROUP BY r.id;