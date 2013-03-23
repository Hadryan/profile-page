<?php
defined('DBHOST') || define('DBHOST', 'localhost');
defined('DBUSER') || define('DBUSER', 'root');
defined('DBPASS') || define('DBPASS', 'root');
defined('DBNAME') || define('DBNAME', 'backbone');

defined('API_UPLOAD_DIR') || define('API_UPLOAD_DIR', dirname(__FILE__) . '/../contest/users/uploads');
defined('API_UPLOAD_URL') || define('API_UPLOAD_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/backbone/profile-page/contest/users/uploads');

defined('API_DOWNLOAD_DIR') || define('API_DOWNLOAD_DIR', dirname(__FILE__) . '/../contest/users/downloads');
defined('API_DOWNLOAD_URL') || define('API_DOWNLOAD_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/backbone/profile-page/contest/users/downloads');
