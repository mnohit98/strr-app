CREATE DATABASE IF NOT EXISTS strr_app;
USE `strr_app`;

DROP TABLE IF EXISTS `Chat`;
DROP TABLE IF EXISTS `Activity`;
DROP TABLE IF EXISTS `Activity_Member`;
DROP TABLE IF EXISTS `Club_Member`;
DROP TABLE IF EXISTS `Club`;
DROP TABLE IF EXISTS `ActivityTag`;
DROP TABLE IF EXISTS `ActivityGroup`;
DROP TABLE IF EXISTS `Admins`;
DROP TABLE IF EXISTS `Member`;
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
  CONSTRAINT `activitytag_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `Location` (`id`)
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
  CONSTRAINT `club_ibfk_1` FOREIGN KEY (`activity_tag_id`) REFERENCES `ActivityTag` (`id`),
  CONSTRAINT `fk_club_location` FOREIGN KEY (`location_id`) REFERENCES `Location` (`id`) ON DELETE CASCADE
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
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `Location` (`id`),
  CONSTRAINT `activity_ibfk_2` FOREIGN KEY (`activity_tag_id`) REFERENCES `ActivityTag` (`id`),
  CONSTRAINT `activity_ibfk_3` FOREIGN KEY (`club_id`) REFERENCES `Club` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Activity_Member` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` bigint(20) unsigned NOT NULL,
  `member_id` bigint(20) unsigned NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `activity_id` (`activity_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `activity_member_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `Activity` (`id`),
  CONSTRAINT `activity_member_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `Member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Club_Member` (
  `club_id` bigint(20) unsigned NOT NULL,
  `member_id` bigint(20) unsigned NOT NULL,
  `joined_on` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`club_id`,`member_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `club_member_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `Club` (`id`) ON DELETE CASCADE,
  CONSTRAINT `club_member_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `Member` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `Member` (`id`),
  CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `Club` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/* Dummy data*/
INSERT INTO `Location` VALUES (1,'Maharashtra','Mumbai','Goregaon','400001',19.076,72.8777),(2,'Karnataka','Bangalore','Kormanagle','560001',12.9716,77.5946),(3,'Delhi','New Delhi','Rajiv Chowk','110001',28.6139,77.209);
INSERT INTO `Member` VALUES (1,'Alice Johnson','alice@example.com','9876543220','{}'),(2,'Bob Lee','bob@example.com','9876543221','{}');
INSERT INTO `Admins` VALUES (1,'John Doe','john@example.com','9876543210','9876543210',5,'{}'),(2,'Jane Smith','jane@example.com','9876543211','9876543211',3,'{}');
INSERT INTO `ActivityGroup` VALUES (1,'sporty'),(2,'cultural'),(3,'adventure');
INSERT INTO `ActivityTag` VALUES (1,'Cricket',1,1),(2,'Dance',2,1),(3,'Photography',3,1),(4,'Painting',2,1);
INSERT INTO `Club` VALUES (1,'Cricket Club', '[]', 3, NULL, NULL, 1, NULL, NULL, NULL, 0), (2,'Dance Club', '[]', 3, NULL, NULL, 2, NULL, NULL, NULL, 0);
INSERT INTO `Activity` VALUES (1,'Cricket Match',1,3,1,'A thrilling match between teams.', '2024-10-01 10:00:00', '2024-10-01 12:00:00', NULL, 50, 'Stadium', 'An exciting match!', 200.00, 1, 'url_to_photo', 'url_to_venue'), (2,'Dance Performance',1,2,2,'A grand dance performance.', '2024-10-02 19:00:00', '2024-10-02 21:00:00', NULL, 100, 'Auditorium', 'An amazing dance show!', 150.00, 1, 'url_to_photo', 'url_to_venue');
INSERT INTO `Activity_Member` VALUES (1,1,1,'2024-10-01 09:30:00'),(2,1,2,'2024-10-01 09:30:00');
INSERT INTO `Club_Member` VALUES (1,1,'2024-10-01 09:00:00'),(1,2,'2024-10-01 09:30:00');
INSERT INTO `Chat` VALUES (1,1,1,'Looking forward to the match!', '2024-10-01 09:00:00');
