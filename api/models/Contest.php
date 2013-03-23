<?php
class Contests extends RestApiInterface
{
	private $table_contests = 'contests';
		
	private $table_contest_meta = 'contestmeta';
	
	private $table_contestants = 'contestants';
	
	// Dummy data
	private $contest_dummy = array(
		//'user_id' => 44,
		'logo' => 'http://localhost/backbone/profile-page/contest/images/uploads/backbone_logo.png',
		'title' => 'Backbone',
		'description' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		'start' => '03/19/2013',
		'end' => '03/20/2013',
		'prices' => array(
			array(
				'title' => 'price1',
				'img' => 'http://localhost/backbone/profile-page/contest/images/uploads/dummy-price-1.jpg'
			),
			array(
				'title' => 'price2',
				'img' => 'http://localhost/backbone/profile-page/contest/images/uploads/dummy-price-2.jpg'
			),
			array(
				'title' => 'price3',
				'img' => 'http://localhost/backbone/profile-page/contest/images/uploads/dummy-price-3.jpg'
			)
		),
		'terms' => 'standard',
		'meta' => array(
			'type' => 'quiz',
			'content' => array(
				'question' => 'What is brand X the best drink in the world ?',
				'thumbnail' => array(
					'type' => 'pic',
					'value'=> array(
						'video' => array(
							'url' => 'https://www.youtube.com/watch?v=PLpAMYubUeY',
							'name' => 'hello-kitty.jpg',
							'img' => 'http://localhost/backbone/profile-page/contest/images/uploads/hello-kitty.jpg'
						),
						'pic' => array(
							'name' => 'hello-kitty.jpg',
							'url' => 'http://localhost/backbone/profile-page/contest/images/uploads/hello-kitty.jpg'		
						)
					),
				),
				'choices' => array(
					'a' => 'Coca Cola',
					'b' => 'Pepsi',
					'c' => 'Extra Joss',
					'd' => 'Kratingdeng',
					'e' => 'Kiranti'
				),
				'answer' => 'C',
				'force' => array(
					'type' => true,
					'value' => 'loreem ipsum dolor sit amet'
				)
			),
			'subscribes' => array(
				// facebook URL
				'facebook' =>  array(
					'type' => true,
					'value' => 'http://www.facebook.com/pages/HTML5/487427067955903?rf=116846568325351'
				),
				// youtube account
				'youtube' =>  array(
					'type' => true,
					'value' => 'asiafoodrecipe'
				),
				// twitter account
				'twitter' =>  array(
					'type' => true,
					'value' => 'twitterapi'
				),
				// Goggle+ URL
				'google_plus' =>  array(
					'type' => true,
					'value' => 'http://www.asiafoodrecipe.com'
				)
			),
			'fields' => array('name', 'email', 'blog', 'contact', 'address')
		),
	);
	
	public function all()
	{
		$user_id = 44;
		
		$contests = $this->db->all(
			"SELECT c.*
			 FROM {$this->table_contests} c
			 WHERE c.user_id = :user_id",
			array('user_id' => $user_id)
		);
		
		$results = array();
		foreach( $contests as $item )
		{
			$data = array_map(function($item){
				$data = @unserialize($item);
				return ($data !== false) ? $data : $item ;
			}, $item);
			$data['hash'] = strtotime('+1 day') . $data['ID'];
			array_push($results, $data);
		}
		return $results;
	}
	
	public function one( $id )
	{
		// get contests by id
		$result = $this->db->one("SELECT * FROM {$this->table_contests} WHERE ID = :id", array('id' => $id));	
		// mapping serialize value if is an array
		$contests = array_map(function($item){
			$data = @unserialize($item);
			return ($data !== false) ? $data : $item ;
		}, $result);
		
		// get all contestmeta by contest id
		$meta = $this->db->all("SELECT * FROM {$this->table_contest_meta} WHERE contest_id = :contest_id", array('contest_id' => $id));
		if( $meta )
		{
			// looping meta, then merge into contests array
			foreach($meta as $item)
			{
				$data = @unserialize($item['contest_value']);
				$contests['meta'][$item['contest_key']] = ($data !== false) ? $data : $item['contest_value'] ;
			}
		}
		
		return $contests;
	}

	public function getRecent( $id )
	{
		$user_id = 44;
		
		if( empty($id) )
		{
			// get contest id
			// start date between interval 7 day (1 week) AND
			// end date > today AND
			// user_id
			$recentContest = $this->db->one(
				"SELECT ID FROM {$this->table_contests} 
				 WHERE 
				 	STR_TO_DATE(`start`, '%m/%d/%Y') BETWEEN  CURDATE( ) AND DATE_ADD(CURDATE( ),INTERVAL 7 DAY) AND
 					STR_TO_DATE(`end`, '%m/%d/%Y') >= CURDATE( ) AND
				 	user_id = :user_id", 
				array('user_id' => $user_id));
				
			// not found, return null
			if( $recentContest === false ) return null;
			// contest id
			$id = $recentContest['ID'];
		}
		
		$contest = $this->one( $id );
		$contest['contestants'] = Contestants::getInstance()->getAll($id);
		$contest['started'] = ( 1363971600000 > strtotime('now 00:00:00') ) ? false : true ;
		// create download hash code
		// tommorow timestamp + contest id
		$contest['hash'] = strtotime('+1 day') . $id;
		
		return $contest;
	}
	
	public function post( $data )
	{
		$this->validate($data);
		
		// convert object to array
		$dataArr = $this->_objectToArray($data);
		// set allowed keys
		$keys = array(
			'contests' => array('logo', 'title', 'prices', 'description', 'start', 'end', 'terms'),
			'meta' => array('meta')
		);
		// data contests
		$contest = array_map(function ($item){
			return (is_array($item)) ? serialize($item) : $item ;
		}, array_intersect_key($dataArr, array_flip($keys['contests'])) );
		$contest['user_id'] = 44;
		
		// save contests
		$data->ID = $this->db->execute(
						"INSERT INTO {$this->table_contests} (user_id, title, logo, prices, description, start, end, terms) 
						VALUES (:user_id, :title, :logo, :prices, :description, :start, :end, :terms) ", 
						$contest
					);
					
		// convert META object to array
		$meta = $this->_objectToArray( $dataArr['meta'] );
		if( $meta )
		{
			// save contestmeta by contest id
			foreach ($meta as $key => $value) 
			{
				$this->db->execute(
						"INSERT INTO {$this->table_contest_meta} (contest_id, contest_key, contest_value)
						VALUES (:contest_id, :contest_key, :contest_value)",
						array(
							'contest_id' 	=> $data->ID,
							'contest_key' 	=> $key,
							'contest_value' => (is_array($value)) ? serialize($value) : $value
						));
			}
		}			
			
		return $data;
	}
	
	public function put( $id, $data )
	{
		$this->validate($data);
		
		// convert object to array
		$dataArr = $this->_objectToArray($data);
		// set allowed keys
		$keys = array(
			'contests' => array('logo', 'title', 'prices', 'description', 'start', 'end', 'terms'),
			'meta' => array('meta')
		);
		// data contests
		$contest = array_map(function ($item){
			return (is_array($item)) ? serialize($item) : $item ;
		}, array_intersect_key($dataArr, array_flip($keys['contests'])) );
		$contest['ID'] = $id;
		
		$this->db->execute("
			UPDATE {$this->table_contests} 
			SET 
				title = :title, 
				logo = :logo, 
				prices = :prices, 
				description = :description, 
				start = :start, 
				end = :end, 
				terms = :terms
			WHERE ID = :ID", $contest);
		
		// convert META object to array
		$meta = $this->_objectToArray( $dataArr['meta'] );
		if( $meta )
		{
			// save contestmeta by contest id
			foreach ($meta as $key => $value) 
			{
				$this->db->execute(
						"UPDATE {$this->table_contest_meta} SET contest_value = :contest_value
						 WHERE contest_key = :contest_key AND contest_id = :contest_id",
						array(
							'contest_id' 	=> $id,
							'contest_key' 	=> $key,
							'contest_value' => (is_array($value)) ? serialize($value) : $value
						));
			}
		}			
		
		return $data;
	}
	
	public function delete( $id )
	{
		$this->db->execute("DELETE FROM {$this->table_contest_meta} WHERE contest_id = :id", array('id' => $id));
		$this->db->execute("DELETE FROM {$this->table_contestants} WHERE contest_id = :id", array('id' => $id));
		$this->db->execute("DELETE FROM {$this->table_contests} WHERE ID = :ID", array('ID' => $id));
		// delete all images
		$uploadImgs = glob(API_UPLOAD_DIR . '/'. $id .'_*');
		if( $uploadImgs )	{
			foreach( $uploadImgs as $pic )
			{
				if ( file_exists($pic) ) { 
					unlink($pic);
				}
			}
		}
		
		return true;
	}
	
	public function validate( $data )
	{
		if( empty($data->title) ) throw new ValidationException('Title is required');
		if( empty($data->start) ) throw new ValidationException('Start date is required');
		if( empty($data->end) ) throw new ValidationException('End date is required');
		if( count($data->meta) == 0 ) throw new ValidationException('Contest is required');
		if( empty($data->description) ) throw new ValidationException('description is required');
	}
	
	public function getNextID()
	{
		$result = $this->db->one("SHOW TABLE STATUS LIKE '{$this->table_contests}'");  
		return $result['Auto_increment'];
	}                            
}

?>