CREATE DATABASE IF NOT EXISTS strr_app;
USE `strr_app`;

-- Generate and run the DROP TABLE command for all tables in the database
-- Replace `your_database_name` with the actual database name
DROP TABLE IF EXISTS `Chat`;
DROP TABLE IF EXISTS `Activity`;
DROP TABLE IF EXISTS `Club`;
DROP TABLE IF EXISTS `ActivityTag`;
DROP TABLE IF EXISTS `ActivityGroup`;
DROP TABLE IF EXISTS `Admins`;
DROP TABLE IF EXISTS `Member`;
DROP TABLE IF EXISTS `Activity_Member`;
DROP TABLE IF EXISTS `Club_Member`;
DROP TABLE IF EXISTS `Location`;

CREATE TABLE `Location` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `state` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `area` varchar(100) DEFAULT NULL,
  `area_code` varchar(6) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `area_code` (`area_code`),
  KEY `state` (`state`),
  KEY `city` (`city`),
  KEY `area_code_2` (`area_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Member` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `meta` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Admins` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `whatsapp_number` varchar(15) DEFAULT NULL,
  `reputation` int(11) DEFAULT '0',
  `meta` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ActivityGroup` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` enum('sporty','cultural','adventure') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ActivityTag` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `group_id` bigint(20) unsigned NOT NULL,
  `location_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `activitytag_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `activitygroup` (`id`),
  CONSTRAINT `activitytag_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Club` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `admin_ids` json NOT NULL,
  `reputation` int(11) DEFAULT '0',
  `faqs` json DEFAULT NULL,
  `dp_url` text,
  `activity_tag_id` bigint(20) unsigned NOT NULL,
  `meetup_info` json DEFAULT NULL,
  `about` text,
  `location_id` bigint(20) unsigned DEFAULT NULL,
  `m_count` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `activity_tag_id` (`activity_tag_id`),
  KEY `fk_club_location` (`location_id`),
  CONSTRAINT `club_ibfk_1` FOREIGN KEY (`activity_tag_id`) REFERENCES `activitytag` (`id`),
  CONSTRAINT `fk_club_location` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Activity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location_id` bigint(20) unsigned NOT NULL,
  `activity_tag_id` bigint(20) unsigned NOT NULL,
  `club_id` bigint(20) unsigned NOT NULL,
  `description` text,
  `start_datetime` timestamp NULL DEFAULT NULL,
  `end_datetime` timestamp NULL DEFAULT NULL,
  `filled_seats` int(11) DEFAULT NULL,
  `total_seats` int(11) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `about` text,
  `fee` decimal(10,2) DEFAULT NULL,
  `payment_type` tinyint(1) DEFAULT NULL,
  `activity_photo_url` varchar(255) DEFAULT NULL,
  `venue_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `club_id` (`club_id`),
  KEY `location_id` (`location_id`),
  KEY `activity_tag_id` (`activity_tag_id`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`),
  CONSTRAINT `activity_ibfk_2` FOREIGN KEY (`activity_tag_id`) REFERENCES `activitytag` (`id`),
  CONSTRAINT `activity_ibfk_3` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Club_Member` (
  `club_id` bigint(20) unsigned NOT NULL,
  `member_id` bigint(20) unsigned NOT NULL,
  `joined_on` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`club_id`,`member_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `club_member_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE,
  CONSTRAINT `club_member_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Activity_Member` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` bigint(20) unsigned NOT NULL,
  `member_id` bigint(20) unsigned NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `activity_id` (`activity_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `activity_member_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`),
  CONSTRAINT `activity_member_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Chat` (
  `message_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
   `member_id` bigint(20) unsigned NOT NULL,
  `club_id` bigint(20) unsigned NOT NULL,
  `message_text` TEXT NOT NULL,
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sent_at (sent_at),
  PRIMARY KEY (`message_id`),
  KEY `club_id` (`club_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
  CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/* Dummy data*/
INSERT INTO `Location` VALUES (1,'Maharashtra','Mumbai','Goregaon','400001',19.076,72.8777),(2,'Karnataka','Bangalore','Kormanagle','560001',12.9716,77.5946),(3,'Delhi','New Delhi','Rajiv Chowk','110001',28.6139,77.209);
INSERT INTO `Member` VALUES (1,'Alice Johnson','alice@example.com','9876543220','{}'),(2,'Bob Lee','bob@example.com','9876543221','{}');
INSERT INTO `Admins` VALUES (1,'John Doe','john@example.com','9876543210','9876543210',5,'{}'),(2,'Jane Smith','jane@example.com','9876543211','9876543211',3,'{}');
INSERT INTO `ActivityGroup` VALUES (1,'sporty'),(2,'cultural'),(3,'adventure');
INSERT INTO `ActivityTag` VALUES (1,'Cricket',1,1),(2,'Swimming',1,2),(3,'Music Concert',2,3),(4,'Trekking',3,2);
INSERT INTO `Club` VALUES (1,'Sports Club','[1, 2]',5,'[{\"answer\": \"The fee is 500 INR per session.\", \"question\": \"What is the fee?\"}, {\"answer\": \"Please bring your own sports gear and water bottle.\", \"question\": \"What should I bring?\"}, {\"answer\": \"Yes, changing rooms are available.\", \"question\": \"Are there changing facilities?\"}]','http://example.com/sportsclubdp',1,'[{\"meetup_dp\": \"http://example.com/dp1\", \"meetup_days\": \"[6]\", \"meetup_place\": \"Cricket Ground\", \"meetup_timing\": \"10:00 AM - 12:00 PM\", \"meetup_location_url\": \"http://example.com/location1\"}, {\"meetup_dp\": \"http://example.com/dp2\", \"meetup_days\": \"[5]\", \"meetup_place\": \"Swimming Pool\", \"meetup_timing\": \"2:00 PM - 4:00 PM\", \"meetup_location_url\": \"http://example.com/location2\"}]','Cricket and Swimming',1,2),(2,'Gurgaon Swim Club','[1]',4,'[{\"answer\": \"Yes, pre-booking is required for the session.\", \"question\": \"Do I need to book?\"}, {\"answer\": \"Yes, parking is available at the venue.\", \"question\": \"Is parking available?\"}, {\"answer\": \"Non-members pay 300 INR per session.\", \"question\": \"What is the fee for non-members?\"}]','http://example.com/swimclubdp',2,'[{\"meetup_dp\": \"http://example.com/dp3\", \"meetup_days\": \"[1]\", \"meetup_place\": \"Community Pool\", \"meetup_timing\": \"5:00 PM - 7:00 PM\", \"meetup_location_url\": \"http://example.com/location3\"}, {\"meetup_dp\": \"http://example.com/dp4\", \"meetup_days\": \"[6]\", \"meetup_place\": \"Gurgaon Sports Center\", \"meetup_timing\": \"6:00 AM - 8:00 AM\", \"meetup_location_url\": \"http://example.com/location4\"}]','Swimming Gurgaon',2,1),(3,'Adventure Club','[1, 2]',3,'[{\"answer\": \"Yes, safety gear is provided and mandatory.\", \"question\": \"Is safety gear provided?\"}, {\"answer\": \"Yes, beginners are welcome.\", \"question\": \"Can beginners join?\"}, {\"answer\": \"Yes, light refreshments are included.\", \"question\": \"Is food included?\"}]','http://example.com/adventureclubdp',3,'[{\"meetup_dp\": \"http://example.com/dp5\", \"meetup_days\": \"[7]\", \"meetup_place\": \"Mountain Hike Start Point\", \"meetup_timing\": \"6:00 AM - 10:00 AM\", \"meetup_location_url\": \"http://example.com/location5\"}, {\"meetup_dp\": \"http://example.com/dp6\", \"meetup_days\": \"[6]\", \"meetup_place\": \"River Rafting Base\", \"meetup_timing\": \"9:00 AM - 12:00 PM\", \"meetup_location_url\": \"http://example.com/location6\"}]','Hiking and Rafting',3,0),(4,'Fitness Club','[1, 3]',4,'[{\"answer\": \"The fee is 600 INR per session.\", \"question\": \"What is the fee?\"}, {\"answer\": \"Please wear comfortable attire.\", \"question\": \"What should I wear?\"}]','http://example.com/fitnessclubdp',2,'[{\"meetup_dp\": \"http://example.com/dp7\", \"meetup_days\": \"[6, 7, 4]\", \"meetup_place\": \"City Gym\", \"meetup_timing\": \"6:00 PM - 8:00 PM\", \"meetup_location_url\": \"http://example.com/location7\"}]','Join us for fitness activities!',3,0);
INSERT INTO `Activity` VALUES (1,'Weekend Cricket Match',1,1,1,'Cricket match for enthusiasts','2024-10-05 03:30:00','2024-10-05 06:30:00',10,20,'Oval Maidan','A friendly match with local teams.',100.00,2,'http://example.com/activity1.jpg','http://example.com/activity1'),(2,'Morning Swimming Session',2,2,2,'Early morning swimming training','2024-10-06 01:30:00','2024-10-06 03:30:00',5,15,'Koramangala Pool','Focus on freestyle swimming.',150.00,1,'http://example.com/activity2.jpg','http://example.com/activity2');
INSERT INTO `Club_Member` VALUES (1,1,'2024-10-03 18:32:57'),(1,2,'2024-10-03 18:32:57'),(2,1,'2024-10-03 18:32:57');
INSERT INTO `Activity_Member` VALUES (1,1,1,'2024-10-02 23:00:00'),(2,1,2,'2024-10-02 23:15:00'),(3,2,1,'2024-10-03 00:00:00'),(4,2,2,'2024-10-03 00:00:00');
INSERT INTO `Chat` VALUES (1,1,1,'Hello','2024-10-07 11:30:00');
