CREATE DATABASE IF NOT EXISTS `blockchain` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `blockchain`;
CREATE TABLE  IF NOT EXISTS `block` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `data` varchar(1024)  NOT NULL,
  `hash` varchar(256)  DEFAULT NULL,
  `previousHash` varchar(256)  DEFAULT NULL,
  `timestamp` varchar(13)  NOT NULL
);

INSERT INTO `block` (`id`, `data`, `hash`, `previousHash`, `timestamp`) VALUES
(1, 'Genesis block', '19fc257b6ebb19dee07f65d845e8e9101f1cece63b3607dab5e6808eea3aeac5', '0', '1513482756145');

