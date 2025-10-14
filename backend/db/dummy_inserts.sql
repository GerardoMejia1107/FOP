/*Insertion in enums catalogs*/

insert into sex_catalog (type)
values ('male'),
       ('female');

insert into death_catalog (type)
values ('homicide'),
       ('suicide'),
       ('accident'),
       ('natural'),
       ('undetermined'),
       ('pending investigation');

/*Insertion into users*/
insert into users (role, name, user_name, password, email, birth_date)
values ('sudo', 'Gerardo', 'ger', 'hashed_pw_1', 'miguelmr1107@gmail.com', '2004-11-7'),
       ('doctor', 'Dr. Alice Brown', 'abrown', 'hashed_pw_2', 'abrown@forensicslab.gov', '1985-09-23'),
       ('investigator', 'Detective Mark Lee', 'mlee', 'hashed_pw_3', 'mlee@investigationunit.gov', '1980-02-15'),
       ('investigator', 'Detective Laura Kim', 'lkim', 'hashed_pw_4', 'lkim@investigationunit.gov', '1988-11-02'),
       ('doctor', 'Dr. Peter White', 'pwhite', 'hashed_pw_5', 'pwhite@forensicslab.gov', '1990-06-30');

/*In investigators profile*/
insert into investigators_profile (investigator_id, badge_number)
values (3, 'INV-001'),
       (4, 'INV-002');

/*In doctors profile*/
insert into doctors_profile (doctor_id, badge_number, specialization)
values (2, 'DOC-002', 'Toxicology'),
       (5, 'DOC-003', 'General Pathology');

insert into cases (location, description, type_death_id, investigator_id)
values ('Los Angeles', 'Victim found in apartment, signs of struggle.', 1, 3),     -- Homicide
       ('San Diego', 'Overdose suspected, evidence of drug paraphernalia.', 2, 4), -- Suicide
       ('Sacramento', 'Traffic collision at intersection.', 3, 3),                 -- Accident
       ('San Francisco', 'Elderly man died at home of natural causes.', 4, 4); -- Natural

insert into autopsy (case_origin_id, doctor_id, description, type_death_id, current_version)
values (2, 2, 'Toxicology positive for opioids; suicide confirmed.', 2, 1),
       (3, 5, 'Multiple fractures and internal bleeding; accident confirmed.', 3, 1);

insert into victim_record (case_id, autopsy_id, victim_name, victim_death_date, victim_age, victim_identity_badge,
                           victim_sex)
values (1, 1, 'Michael Johnson', '2025-09-10 14:00:00', 34, 10001, 1),
       (2, 2, 'Sarah Miller', '2025-08-22 22:30:00', 28, 10002, 2),
       (3, 3, 'David Brown', '2025-07-01 17:15:00', 41, 10003, 1),
       (4, 4, 'Robert White', '2025-06-18 09:20:00', 78, 10004, 1);


