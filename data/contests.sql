-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 24, 2013 at 03:41 PM
-- Server version: 5.0.45-community-nt
-- PHP Version: 5.3.21

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `backbone`
--

-- --------------------------------------------------------

--
-- Table structure for table `contestants`
--

CREATE TABLE IF NOT EXISTS `contestants` (
  `ID` int(11) NOT NULL auto_increment,
  `contest_id` int(11) NOT NULL,
  `user_value` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `blog` varchar(255) default 'NA',
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `contestants`
--

INSERT INTO `contestants` (`ID`, `contest_id`, `user_value`, `name`, `email`, `country`, `address`, `blog`) VALUES
(1, 1, 'b', 'Kelvin', 'kelvin@example.com', 'singapore', '61 ubi Ave, Singapore', 'NA'),
(2, 1, 'b', 'John', 'john@example.com', 'singapore', 'Orchid Road, Singapore', 'http://johncooking.com'),
(3, 1, 'c', 'Derrick', 'derrick@example.com', 'singapore', '62 ubi Ave, Singapore', 'http://derrick.com'),
(4, 3, '3_purchase_img_4.png', 'John', 'john.doe@example.com', 'singapore', 'Orchid Road, Singapore', 'http://johndoe.com'),
(5, 3, '3_purchase_img_5.png', 'Kelvin', 'kelvin@example.com', 'singapore', '61 ubi Ave, Singapore', '');

-- --------------------------------------------------------

--
-- Table structure for table `contestmeta`
--

CREATE TABLE IF NOT EXISTS `contestmeta` (
  `ID` int(11) NOT NULL auto_increment,
  `contest_id` int(11) NOT NULL,
  `contest_key` text NOT NULL,
  `contest_value` text NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `contestmeta`
--

INSERT INTO `contestmeta` (`ID`, `contest_id`, `contest_key`, `contest_value`) VALUES
(1, 1, 'type', 'quiz'),
(2, 1, 'content', 'a:5:{s:8:"question";s:36:"What are Hello Kitty''s parent names?";s:9:"thumbnail";a:2:{s:4:"type";s:5:"video";s:5:"value";a:2:{s:3:"pic";a:2:{s:4:"name";s:15:"hello-kitty.jpg";s:3:"url";s:79:"http://localhost/backbone/profile-page/contest/users/uploads/1_quiz_pic_img.jpg";}s:5:"video";a:3:{s:3:"url";s:42:"http://www.youtube.com/watch?v=U0FkyYxOxQE";s:4:"name";s:22:"backbone-logo-back.png";s:3:"img";s:81:"http://localhost/backbone/profile-page/contest/users/uploads/1_quiz_video_img.png";}}}s:7:"choices";a:5:{s:1:"a";s:13:"Billy and Sue";s:1:"b";s:15:"George and Mary";s:1:"c";s:15:"Mark and Janice";s:1:"d";s:12:"Adam and Eve";s:1:"e";s:0:"";}s:6:"answer";s:1:"b";s:5:"force";a:2:{s:4:"type";s:1:"1";s:5:"value";s:28:"Force Correct Answer here...";}}'),
(3, 1, 'subscribes', 'a:4:{s:8:"facebook";a:2:{s:4:"type";s:1:"1";s:5:"value";s:19:"http://facebook.com";}s:7:"youtube";a:2:{s:4:"type";s:1:"1";s:5:"value";s:14:"asiafoodrecipe";}s:7:"twitter";a:2:{s:4:"type";s:1:"1";s:5:"value";s:14:"asiafoodrecipe";}s:11:"google_plus";a:2:{s:4:"type";s:1:"1";s:5:"value";s:25:"http://asiafoodrecipe.com";}}'),
(4, 1, 'fields', 'a:5:{i:0;s:4:"name";i:1;s:5:"email";i:2;s:4:"blog";i:3;s:7:"contact";i:4;s:7:"address";}'),
(5, 2, 'type', 'purchase'),
(6, 2, 'content', 'a:2:{s:4:"type";s:5:"image";s:4:"name";s:18:"Receipt Scan/Image";}'),
(7, 2, 'subscribes', 'a:4:{s:8:"facebook";a:2:{s:4:"type";s:1:"1";s:5:"value";s:19:"http://facebook.com";}s:7:"youtube";a:2:{s:4:"type";s:1:"1";s:5:"value";s:14:"asiafoodrecipe";}s:7:"twitter";a:2:{s:4:"type";s:1:"1";s:5:"value";s:14:"asiafoodrecipe";}s:11:"google_plus";a:2:{s:4:"type";s:1:"1";s:5:"value";s:25:"http://asiafoodrecipe.com";}}'),
(8, 2, 'fields', 'a:5:{i:0;s:4:"name";i:1;s:5:"email";i:2;s:4:"blog";i:3;s:7:"contact";i:4;s:7:"address";}'),
(9, 3, 'type', 'purchase'),
(10, 3, 'content', 'a:2:{s:4:"type";s:5:"image";s:4:"name";s:18:"Receipt Scan/Image";}'),
(11, 3, 'subscribes', 'a:4:{s:8:"facebook";a:2:{s:4:"type";s:1:"1";s:5:"value";s:19:"http://facebook.com";}s:7:"youtube";a:2:{s:4:"type";s:1:"1";s:5:"value";s:14:"asiafoodrecipe";}s:7:"twitter";a:2:{s:4:"type";s:1:"1";s:5:"value";s:14:"asiafoodrecipe";}s:11:"google_plus";a:2:{s:4:"type";s:1:"1";s:5:"value";s:25:"http://asiafoodrecipe.com";}}'),
(12, 3, 'fields', 'a:5:{i:0;s:4:"name";i:1;s:5:"email";i:2;s:4:"blog";i:3;s:7:"contact";i:4;s:7:"address";}');

-- --------------------------------------------------------

--
-- Table structure for table `contests`
--

CREATE TABLE IF NOT EXISTS `contests` (
  `ID` int(11) NOT NULL auto_increment,
  `user_id` bigint(20) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `title` varchar(100) NOT NULL,
  `prices` text NOT NULL,
  `description` text NOT NULL,
  `start` varchar(255) NOT NULL,
  `end` varchar(255) NOT NULL,
  `terms` text NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `contests`
--

INSERT INTO `contests` (`ID`, `user_id`, `logo`, `title`, `prices`, `description`, `start`, `end`, `terms`) VALUES
(1, 44, 'http://localhost/backbone/profile-page/contest/users/uploads/1_logo_img.jpg', 'Hello Kitty', 'a:6:{i:0;a:2:{s:5:"title";s:11:"Macbook Pro";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/1_price_img_1.jpg";}i:1;a:2:{s:5:"title";s:9:"iPad Mini";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/1_price_img_2.jpg";}i:2;a:2:{s:5:"title";s:12:"Beat Monster";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/1_price_img_3.jpg";}i:3;a:2:{s:5:"title";s:9:"iPod Nano";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/1_price_img_4.jpg";}i:4;a:2:{s:5:"title";s:16:"Canon Powershoot";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/1_price_img_5.jpg";}i:5;a:2:{s:5:"title";s:17:"Seagate FreeAgent";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/1_price_img_6.jpg";}}', 'Vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.', '02/20/2013', '02/23/2013', 'a:2:{s:4:"type";s:8:"standard";s:5:"value";s:748:"Terms & Conditions\\nSweepstakes is open to any individual in Singapore with a valid mailing address. Limit one entry and prize per person, household, or e-mail address. The organizers reserve the right to change or add to the prizes and substitute them with a comparable alternative due to unforeseen circumstances or circumstances beyond their control.\\n\\nPrizes are non-transferable and no cash equivalent will be offered. Odds of winning depend on the number of eligible entries received. All terms and conditions of Facebook apply. This Sweepstakes is in no way sponsored, endorsed, or administered by, or associated with, Facebook. By submitting an entry, you understand that you are submitting your information to Sponsor and not to Facebook.";}'),
(2, 44, 'http://localhost/backbone/profile-page/contest/users/uploads/2_logo_img.png', 'HTML5', 'a:3:{i:0;a:2:{s:5:"title";s:15:"HTML5 red shirt";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/2_price_img_1.jpg";}i:1;a:2:{s:5:"title";s:16:"HTML5 blue shirt";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/2_price_img_2.png";}i:2;a:2:{s:5:"title";s:17:"HTML5 white shirt";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/2_price_img_3.jpg";}}', 'Vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.', '03/21/2013', '03/23/2013', 'a:2:{s:4:"type";s:8:"standard";s:5:"value";s:748:"Terms & Conditions\\nSweepstakes is open to any individual in Singapore with a valid mailing address. Limit one entry and prize per person, household, or e-mail address. The organizers reserve the right to change or add to the prizes and substitute them with a comparable alternative due to unforeseen circumstances or circumstances beyond their control.\\n\\nPrizes are non-transferable and no cash equivalent will be offered. Odds of winning depend on the number of eligible entries received. All terms and conditions of Facebook apply. This Sweepstakes is in no way sponsored, endorsed, or administered by, or associated with, Facebook. By submitting an entry, you understand that you are submitting your information to Sponsor and not to Facebook.";}'),
(3, 44, 'http://localhost/backbone/profile-page/contest/users/uploads/2_logo_img.png', 'HTML5 New', 'a:5:{i:0;a:2:{s:5:"title";s:9:"HTML5 red";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/2_price_img_1.jpg";}i:1;a:2:{s:5:"title";s:10:"HTML5 blue";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/2_price_img_2.png";}i:2;a:2:{s:5:"title";s:11:"HTML5 white";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/2_price_img_3.jpg";}i:3;a:2:{s:5:"title";s:12:"jQuery Green";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/3_price_img_4.jpg";}i:4;a:2:{s:5:"title";s:14:"Backbone White";s:3:"img";s:78:"http://localhost/backbone/profile-page/contest/users/uploads/3_price_img_5.jpg";}}', 'Vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.', '03/23/2013', '03/25/2013', 'a:2:{s:4:"type";s:8:"standard";s:5:"value";s:748:"Terms & Conditions\\nSweepstakes is open to any individual in Singapore with a valid mailing address. Limit one entry and prize per person, household, or e-mail address. The organizers reserve the right to change or add to the prizes and substitute them with a comparable alternative due to unforeseen circumstances or circumstances beyond their control.\\n\\nPrizes are non-transferable and no cash equivalent will be offered. Odds of winning depend on the number of eligible entries received. All terms and conditions of Facebook apply. This Sweepstakes is in no way sponsored, endorsed, or administered by, or associated with, Facebook. By submitting an entry, you understand that you are submitting your information to Sponsor and not to Facebook.";}');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
