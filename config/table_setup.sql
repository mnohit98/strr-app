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
DROP TABLE IF EXISTS `Location`;


CREATE TABLE `Location` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `state` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `area_code` varchar(6) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `area_code` (`area_code`),
  KEY `state` (`state`),
  KEY `city` (`city`),
  KEY `area_code_2` (`area_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `whatsapp_number` varchar(15) DEFAULT NULL,
  `member_id` bigint(20) unsigned NOT NULL,
  `reputation` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Club` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `admin_ids` json NOT NULL,
  `member_ids` json NOT NULL,
  `reputation` int(11) DEFAULT '0',
  `meetup_places` text,
  `meetup_timings` text,
  `faqs` json DEFAULT NULL,
  `dp_url` text,
  `activity_tag_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_tag_id` (`activity_tag_id`),
  CONSTRAINT `club_ibfk_1` FOREIGN KEY (`activity_tag_id`) REFERENCES `activitytag` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Activity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location_id` bigint(20) unsigned NOT NULL,
  `activity_tag_id` bigint(20) unsigned NOT NULL,
  `club_id` bigint(20) unsigned NOT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `club_id` (`club_id`),
  KEY `location_id` (`location_id`),
  KEY `activity_tag_id` (`activity_tag_id`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`),
  CONSTRAINT `activity_ibfk_2` FOREIGN KEY (`activity_tag_id`) REFERENCES `activitytag` (`id`),
  CONSTRAINT `activity_ibfk_3` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
INSERT INTO `Location` VALUES (1,'Delhi','New Delhi','110001',28.6139,77.209);
INSERT INTO `Member` VALUES (1,'John Doe','johndoe@example.com','1234567890','{\"preferences\": {\"music\": \"rock\", \"sports\": \"cricket\"}}'),(2,'Jane Smith','janesmith@example.com','0987654321','{\"preferences\": {\"music\": \"pop\", \"sports\": \"swimming\"}}');
INSERT INTO `Admins` VALUES (1,'1122334455',1,1);
INSERT INTO `ActivityGroup` VALUES (1,'sporty'),(2,'cultural'),(3,'adventure');
INSERT INTO `ActivityTag` VALUES (1,'cricket',1,1),(2,'swimming',1,1);
INSERT INTO `Club` VALUES (1,'Cricket Club','[1]','[1, 2]',5,'Local Park','Evening','{}','http://example.com/dp.jpg',1);
INSERT INTO `Activity` VALUES (1,'Weekend Cricket Match',1,1,1,'2024-10-07 11:30:00','A friendly cricket match at the local park.');
INSERT INTO `Chat` VALUES (1,1,1,'Hello','2024-10-07 11:30:00');
