<?php
class Contestants extends RestApiInterface
{
	private $table_contestants = 'contestants';
	
	private $table_contests = 'contests';
	
	public function all()
	{
		$contestants = $this->db->all(
			"SELECT ID, name, email, country, address, blog 
			 FROM {$this->table_contestants}
			 WHERE contest_id = :ID",
			array('ID' => $id)
		);
			
		$results = array();
		if( $contestants )
		{
			foreach( $contestants as $item )
			{
				array_push($results, $item);
			}
		}
				
		return $results;
	}
	
	public function one( $id )
	{
		$contestants = $this->db->one(
			"SELECT *
			 FROM {$this->table_contestants}
			 WHERE contest_id = :ID",
			array('ID' => $id)
		);
				
		return $contestants;
	}
	
	public function getAll( $id )
	{
		$contestants = $this->db->all(
			"SELECT ID, name, email, contact, country, address, blog 
			 FROM {$this->table_contestants}
			 WHERE contest_id = :ID",
			array('ID' => $id)
		);
			
		$results = array();
		if( $contestants )
		{
			foreach( $contestants as $item )
			{
				array_push($results, $item);
			}
		}
				
		return $results;
	}
	
	public function post( $data )
	{
		$this->validate($data);
		
		$placeholders = $this->_objectToArray($data);
		
		$this->db->execute("
			INSERT INTO {$this->table_contestants} (contest_id, user_value, name, email, contact, country, address, blog) 
			VALUES (:contest_id, :user_value, :name, :email, :contact, :country, :address, :blog)", 
			$placeholders);
		
		return $data;
	}
	
	public function put( $id, $data ){}
	
	public function delete( $id )
	{
		$contest = $this->db->one("SELECT user_value FROM {$this->table_contestants} WHERE ID = :id", array('id' => $id));
		$file = API_UPLOAD_DIR . '/' . $contest['user_value'];
		// delete image user (purchase), if exists
		if( file_exists($file) ){
			unlink($file);
		}
		
		$this->db->execute("DELETE FROM {$this->table_contestants} WHERE ID = :id", array('id' => $id));
		return true;
	}
	
	public function validate( $data )
	{
		if( empty($data->contest_id) ) throw new ValidationException('Contest id is required');
		if( empty($data->user_value) ) throw new ValidationException('User value is required');
		/*
		if( empty($data->name) ) throw new ValidationException('Name of contestant is required');
		if( empty($data->email) ) throw new ValidationException('Email of contestant is required');
		*/
	}
	
	public function getNextID()
	{
		$result = $this->db->one("SHOW TABLE STATUS LIKE '{$this->table_contestants}'");  
		return $result['Auto_increment'];
	}   
}
?>