<?php
class Database extends Singleton
{
	protected static $dbh;
	
	protected function __construct()
	{
		self::$dbh = new PDO( 'mysql:dbname='.DBNAME.';host='.DBHOST, DBUSER, DBPASS );
		self::$dbh->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
	}
	
	public function all( $sql, $params = array() )
	{
		$stmt = self::$dbh->prepare( $sql );
		$stmt->execute( $params );
		return $stmt->fetchAll( PDO::FETCH_ASSOC );
	}
	
	public function one( $sql, $params = array() )
	{
		$stmt = self::$dbh->prepare( $sql );
		$stmt->execute( $params );
		return $stmt->fetch( PDO::FETCH_ASSOC );
	}
	
	public function execute( $sql, $params = array() )
	{
		$stmt = self::$dbh->prepare( $sql );
		$stmt->execute( $params );
		return ( preg_match('/insert/i', $sql) )  ? 
					self::$dbh->lastInsertId() : 
					$stmt->rowCount();
	}
}
?>