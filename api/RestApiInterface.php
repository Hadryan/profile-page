<?php
include_once 'models/db/Database.php';

abstract class RestApiInterface extends Singleton
{
	protected $db;
	protected $app;
	
	protected function __construct()
	{
		$this->db = Database::getInstance();
		$this->app = Slim\Slim::getInstance();
	}
	
	abstract public function all();
	abstract public function one( $id );
	abstract public function post( $data );
	abstract public function put( $id, $data );
	abstract public function delete( $id );
    abstract public function validate( $data );
	
	protected function _objectToArray($obj) 
	{
        $arrObj = is_object($obj) ? get_object_vars($obj) : $obj;
        foreach ($arrObj as $key => $val) {
            $val = (is_array($val) || is_object($val)) ? $this->_objectToArray($val) : $val;
            $arr[$key] = $val;
        }
        return $arr;
	}   
}

?>