USE employee_tracker_db

INSERT INTO departments (name)
VALUES
('Administration'),
('Coaching'),
('Defense'),
('Offense'),
('Special Teams');

INSERT INTO roles (title, salary, department_id)
VALUES
('Chairman',2500000,1),
('President',2100000,1),
('General Manager',2000000,1),
('Head Coach',2000000,2),
('Offensive coordinator',1500000,2),
('Defensive coordinator',1500000,2),
('Special Teams coordinator ',1400000,2),
('Strength and conditioning',1000000,2),
('Director Video Analytics',750000,2),
('Quarterback',10000000,4),
('Running Back',6000000,4),
('Wide Receiver',6000000,4),
('Tight End',6500000,4),
('Offensive Guard',4000000,4),
('Offensive Tackle',4500000,4),
('Center',4500000,4),
('Defensive End',4000000,3),
('Defensive Tackle',4500000,3),
('Linebacker',4500000,3),
('Cornerback',4500000,3),
('Safety',4500000,3),
('Kicker',1500000,5),
('Punter',1000000,5),
('Long Snapper',800000,5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Clark','Hunt',1,NULL),
('Mark','Donovan',2,1),
('Brett','Veach',3,1),
('Andy','Reid',4,1),
('Eric','Bieniemy',5,4),
('Steve','Spagnuolo',6,4),
('Dave','Toub',7,4),
('Barry','Rubin',8,4),
('Pat','Brazil',9,3),
('Patrick','Mahomes II',10,4),
('Clyde','Edwards-Helaire',11,4),
('Darrell','Williams',11,4),
('Tyreek','Hill',12,4),
('Mecole ','Hardman',12,4),
('Travis','Kelce',13,4),
('Nick','Allegretti',14,5),
('Trey','Smith',14,5),
('Orlando','Brown Jr',15,5),
('Lucas','Niang',15,5),
('Creed','Humphrey',16,5),
('Frank','Clark',17,6),
('Chris','Jones',18,6),
('Jarran','Reed',18,6),
('Alex','Okafor',17,6),
('Anthony','Hitchens',19,6),
('Willie','Gay',19,6),
('Nick','Bolton',19,6),
("L'Jarius","Sneed",20,6),
('Charvarius','Ward',20,6),
('Tyrann','Mathieu',21,6),
('Daniel','Sorensen',21,6),
('Harrison','Butker',22,7),
('Tommy','Townsend',23,7);