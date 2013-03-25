<?php
defined('DBHOST') || define('DBHOST', 'localhost');
defined('DBUSER') || define('DBUSER', 'root');
defined('DBPASS') || define('DBPASS', 'root');
defined('DBNAME') || define('DBNAME', 'backbone');

defined('ABSPATH') || define('ABSPATH', dirname(__FILE__));
$base_url = 'http://localhost/';
if(isset($_SERVER['HTTP_HOST']))
{
    $base_url = isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) == 'on' ? 'https' : 'http';
    $base_url .= '://'. $_SERVER['HTTP_HOST'];
    $base_url .= str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']);
}
defined('BASE_URL') || define('BASE_URL', $base_url);

defined('API_UPLOAD_DIR') || define('API_UPLOAD_DIR', ABSPATH . '/contest/users/uploads');
defined('API_UPLOAD_URL') || define('API_UPLOAD_URL', BASE_URL . 'contest/users/uploads');

defined('API_DOWNLOAD_DIR') || define('API_DOWNLOAD_DIR', ABSPATH . '/contest/users/downloads');
defined('API_DOWNLOAD_URL') || define('API_DOWNLOAD_URL', BASE_URL . '/contest/users/downloads');
