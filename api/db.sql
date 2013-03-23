CREATE TABLE IF NOT EXISTS `contests` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `dates` text NOT NULL,
  `terms` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
);
CREATE TABLE IF NOT EXISTS `contestmeta` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `contest_id` int(11) NOT NULL,
  `contest_key` text NOT NULL,
  `contest_value` text NOT NULL,
  PRIMARY KEY (`ID`)
);
CREATE TABLE IF NOT EXISTS `contestants` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `contest_id` int(11) NOT NULL,
  `profiles` text NOT NULL,
  PRIMARY KEY (`ID`)
);