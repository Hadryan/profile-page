<?php
// DB Config
include '../Config.php';
// Core
include 'vendor/autoload.php';
include 'Exception.php';
include 'Singleton.php';
include 'RestApiInterface.php';
// Models
include 'models/Contest.php';
include 'models/Contestant.php';
// Upload
include 'classes/class.upload.php';

// define SLIM REST API
Slim\Slim::registerAutoLoader();
$app = new Slim\Slim();

/*
 * REST API Config
 * 
 * @param (String)name
 * 
 * @return JSON
 */
$app->get('/config', function(){
	$app = Slim\Slim::getInstance();
	
	$debug = array(
		'PATH' => array(
			'ABSPATH' => ABSPATH,
			'API_UPLOAD_DIR' => API_UPLOAD_DIR,
			'API_UPLOAD_URL' => API_UPLOAD_URL,
			'API_DOWNLOAD_DIR' => API_DOWNLOAD_DIR,
			'API_DOWNLOAD_URL' => API_DOWNLOAD_URL,
		),
		'DB' => array(
			'DBNAME' => DBNAME,
			'DBUSER' => DBUSER,
			'DBPASS' => DBPASS,
			'DBHOST' => DBHOST
		)
	);
	
	$json = json_encode($debug);
    $cb = isset($_GET['callback']) ? $_GET['callback'] : false;
    if($cb) $json = "$cb($json)";
	
	$app->response()->header('Content-Type', 'application/json');
    echo $json;
});

/*
 * REST API Test
 * 
 * @param (String)name
 * 
 * @return JSON
 */
$app->get('/test/:hash', function($hash){
	$app = Slim\Slim::getInstance();
	
	//$res = date('d-m-Y', strtotime('03/17/2013'));
	//$name = str_replace('-', '_', $_REQUEST['name']);
	/*
	$ID = substr($hash, -1);
	$tommorrow = (int) substr($hash, 0, -1);
	$now = strtotime('now');
	$res = array($ID, date('d m H:i:s', $now), date('d m H:i:s', $tommorrow), $tommorrow > $now);
	*/

	$res = array(
		'now' => date('m/d/Y', strtotime('now')),
		'tomorrow' => date('m/d/Y', strtotime('tomorrow'))
	);
	
	$json = json_encode($res);
    $cb = isset($_GET['callback']) ? $_GET['callback'] : false;
    if($cb) $json = "$cb($json)";
	
	$app->response()->header('Content-Type', 'application/json');
    echo $json;
});

/*
 * REST API PROFILE
 * 
 * @param
 * 	entity : (String) class name
 *  arg1   : (Int) ID
 * 			 (String) Method name
 *  arg2   : (Int) ID
 * ------------------------------------------------
 * Example :
 * ------------------------------------------------
 * GET/READ	=> http://{HOST}/api/profile/contests
 * 			=> http://{HOST}/api/profile/contests/recent
 * POST 	=> http://{HOST}/api/profile/contests
 * PUT		=> http://{HOST}/api/profile/contests/{id}
 * DELETE	=> http://{HOST}/api/profile/contests/{id}
 * ------------------------------------------------
 * 
 * @return JSON
 */
$app->map('/profile/:entity(/:arg1)(/:arg2)', function($entity, $arg1 = null, $arg2 = null) {
	// get SLIM (Singleton)
	$app = Slim\Slim::getInstance();
	try
	{
		// create Class Name
		$className = ucfirst($entity);
		// validate Class Name
		if( !class_exists($className) ) throw new NotFoundException("Class $className not found");
		if( !is_subclass_of($className, 'RestApiInterface')) throw new NotFoundException();
		
		// get object of Class (Singleton)
		$class = $className::getInstance();
		// get method of REST
		$method = $app->request()->getMethod();
		switch ( $method ) 
		{
			// method POST
			case 'POST':
				$res = $class->post(json_decode($app->request()->getBody()));
				break;
			// method PUT	
			case 'PUT':
				$res = $class->put($arg1, json_decode($app->request()->getBody()));
				//$res = json_decode($app->request()->getBody());
				break;
			// method DELETE
			case 'DELETE':
				$res = $class->delete($arg1);
				break;
			// method GET
			default:
				if( $arg1 == null )
					$res = $class->all();
				elseif( preg_match('/\d/', $arg1) && $arg2 == null )
					$res = $class->one( $arg1 );
				elseif( preg_match('/[a-z]/', $arg1) )
				{
					// get Method name with 'get' prefix
					$method = 'get' . ucfirst($arg1);
					// check callable method (exists and public)
					if( is_callable($className, $method) )
						$res = $class->$method( $arg2 );
					else
						throw new ForbiddenException("Method $method is not callable");
				}
				break;
		}
		// return array, if response is empty
		if( empty($res) ) $res = array();
		
		// create JSON
		// and set callback of JSON if exists
        $json = json_encode($res);
        $cb = isset($_GET['callback']) ? $_GET['callback'] : false;
        if($cb) $json = "$cb($json)";
		
		// set JSON header for response
		$app->response()->header('Content-Type', 'application/json');
        echo $json;
	}
	catch (NotFoundException $e){
		$app->halt(404, $e->getMessage());
	}
	catch (ValidationException $e){
		$app->halt(400, $e->getMessage());
	}
	catch (ForbiddenException $e){
		$app->halt(403, $e->getMessage());
	}
	catch (Exception $e){
		$app->halt(500, $e->getMessage());
	}
})->via('GET', 'POST', 'PUT', 'DELETE');


/*
 * Image Dimensions
 */
$imgDimensions = array(
	'logo' => array(
		'x' => 124,
		'y' => 98
	),
	'price' => array(
		'x' => 89,
		'y' => 78
	),
	'quiz' => array(
		'x' => 483,
		'y' => 269
	),
	'purchase' => array(
		'x' => 300,
		'y' => 200
	)
);
/*
 * REST API UPLOAD
 * 
 * @return JSON
 */
$app->post('/upload', function() use ($imgDimensions) {
	$app = Slim\Slim::getInstance();
	$app->response()->header('Content-Type', 'application/json');
	// for img purchase
	$showImgNameOnly = false;
	try
	{
		// define files
		$fileImg  = $_FILES['file']['tmp_name'];
		$fileName = $_FILES['file']['name'];
		$fileType = $_FILES['file']['type'];
		$ext  = pathinfo($fileName, PATHINFO_EXTENSION);
		
		// create new picture name
		$name = str_replace('-', '_', $_REQUEST['name']);
		// set image size
		$size = array();
		if(preg_match('/logo/i', $name))
			$size = $imgDimensions['logo'];
		elseif(preg_match('/price/i', $name))
			$size = $imgDimensions['price'];
		elseif(preg_match('/quiz/i', $name))
			$size = $imgDimensions['quiz'];
		elseif(preg_match('/purchase/i', $name)){
			$size = $imgDimensions['purchase'];
			$showImgNameOnly = true;
		}
		else
			throw new ForbiddenException("Unknown image file");
		
		// create a unique prefix name of the image
		// Add: constest ID 
		// Update: REQUEST ID
		if( isset($_REQUEST['id']) ){
			$ID = $_REQUEST['id'];
		} 
		else {
			$ID = Contests::getInstance()->getNextID();
		}
		
		// create image name
		$newName = $ID . '_' . $name;
		if( $showImgNameOnly ){
			$uniqueID = Contestants::getInstance()->getNextID();
			$newName .= '_' . $uniqueID;
		}
		$picName = $newName . '.' . $ext;
		// remove old image
		$oldPic = API_UPLOAD_DIR . '/' . $picName;
		if ( file_exists($oldPic) ) { 
			unlink($oldPic);
		}
		
		// do upload n resize
		$imagehand = new upload( $fileImg );
		$imagehand->file_dst_name_ext = $ext;
		$imagehand->file_new_name_body = $newName;
		$imagehand->image_resize = true;
		$imagehand->image_ratio_crop  = true;
		$imagehand->image_x = $size['x'];
		$imagehand->image_y = $size['y'];
		$imagehand->image_convert = $ext;
		$imagehand->Process(API_UPLOAD_DIR);
		if( !$imagehand->processed ) throw new ForbiddenException("Error upload $fileName");
		
		$fileURL = ($showImgNameOnly) ? $picName : API_UPLOAD_URL . '/' . $picName;
		$json = json_encode(array(
			'url'  => $fileURL,
			'size' => $_FILES['file']['size']
		));
        $cb = isset($_GET['callback']) ? $_GET['callback'] : false;
        if($cb) $json = "$cb($json)";
		
		sleep(1);
		
        echo $json;
		
	}
	catch(Exception $e){
		$app->halt(500, $e->getMessage());
	}
});


$app->get('/download/:hash', function($hash){
	$app = Slim\Slim::getInstance();
	
	// include class PHPExcel 
	include 'classes/PHPExcel.php';
	$cells = array('name' => 'C', 'email' => 'D', 'country' => 'E', 'address' => 'F', 'blog' => 'G');
	try{
		$id = substr($hash, -1);
		$tommorrow = (int) substr($hash, 0, -1);
		$now = strtotime('now');
		/*
		$json = json_encode(array(
			'id' => $id,
			'now' => $now,
			'tommorrow' => $tommorrow
		));
		$cb = isset($_GET['callback']) ? $_GET['callback'] : false;
        if($cb) $json = "$cb($json)";
        echo $json;
		exit;
		*/
		if( $now > $tommorrow ) throw new ForbiddenException('Invalid request file');
	
		$data = Contests::getInstance()->getRecent($id);
		$filename = sprintf('contest_%s_%s',$data['meta']['type'], strtolower(date('d_M', strtotime($data['start']))));
		
		$objPHPExcel = new PHPExcel();
		
		/* Contestants */
		
		$objPHPExcel->setActiveSheetIndex(0);
		
		// style column dimensions
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(13);
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);
		$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);
		$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
		$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);
		$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);
		
		// Title header value n styles
		$objPHPExcel->getActiveSheet()->setCellValue('C2', 'Contest Quiz');
		$objPHPExcel->getActiveSheet()->getStyle('C2')->getFont()->setName('Arial');
		$objPHPExcel->getActiveSheet()->getStyle('C2')->getFont()->setSize(20);
		$objPHPExcel->getActiveSheet()->getStyle('C2')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle('C2')->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		$objPHPExcel->getActiveSheet()->mergeCells('C2:E4');
		// Dates header values
		$objPHPExcel->getActiveSheet()->setCellValue('F3', 'Start');
		$objPHPExcel->getActiveSheet()->setCellValue('G3', $data['start']);
		$objPHPExcel->getActiveSheet()->setCellValue('F4', 'End');
		$objPHPExcel->getActiveSheet()->setCellValue('G4', $data['end']);
		// global styles : title and dates
		$objPHPExcel->getActiveSheet()->getStyle('C2:F4')->applyFromArray(array(
			'font'    => array(
				'bold' => true
			),
			'color' => array(
				'rgb' => '333333'
			)
		));
		
		// Table Header
		$objPHPExcel->getActiveSheet()->setCellValue('B6', 'No');
		$objPHPExcel->getActiveSheet()->setCellValue('C6', 'Name');
		$objPHPExcel->getActiveSheet()->setCellValue('D6', 'Email');
		$objPHPExcel->getActiveSheet()->setCellValue('E6', 'Country');
		$objPHPExcel->getActiveSheet()->setCellValue('F6', 'Mailling Address');
		$objPHPExcel->getActiveSheet()->setCellValue('G6', 'Blog URL');
		// content start in rows 7
		$no = 1; $row = 7;
		
		if( $contestants = $data['contestants'] )
		{
			foreach( $contestants as $_contestants )
			{
				// set increment number values in cell B
				$objPHPExcel->getActiveSheet()->setCellValue('B'.$row, $no);
				foreach( $_contestants as $k => $v )
				{
					if(array_key_exists($k, $cells)) 
					{
						$cell  = $cells[$k].$row;
						$objPHPExcel->getActiveSheet()->setCellValue($cell, $v);
						
						if( $k == 'blog' )
						{
							if( filter_var($v, FILTER_VALIDATE_URL) )
							{
								$objPHPExcel->getActiveSheet()->setCellValue($cell, $v);
								$objPHPExcel->getActiveSheet()->getCell($cell)->getHyperlink()->setUrl($v);
								$objPHPExcel->getActiveSheet()->getCell($cell)->getHyperlink()->setTooltip("View {$_contestants['name']}'s blog");
							}
							else
								$objPHPExcel->getActiveSheet()->setCellValue($cell, 'N/A');
						}
						else {
							$objPHPExcel->getActiveSheet()->setCellValue($cell, $v);
						}
					}
				}
				$no++;
				$row++;
			}
		}
		
		// style color dates 
		$objPHPExcel->getActiveSheet()->getStyle('F3:G4')->applyFromArray(array(
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
			),
			'color' => array(
				'rgb' => '333333'
			)
		));
		
		// styling header : background color (white)
		$objPHPExcel->getActiveSheet()->getStyle('B2:G5')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
		$objPHPExcel->getActiveSheet()->getStyle('B2:G5')->getFill()->getStartColor()->setRGB('FFFFFF');
		
		// styles content		
		$objPHPExcel->getActiveSheet()->getStyle('B6:G6')->applyFromArray(array(
			'font'    => array(
				'bold' => true
			),
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
			),
			'borders' => array(
				'top' => array(
 					'style' => PHPExcel_Style_Border::BORDER_THIN
 				),
				'bottom' => array(
 					'style' => PHPExcel_Style_Border::BORDER_THIN
 				)
			),
			'fill' => array(
	 			'type'       => PHPExcel_Style_Fill::FILL_SOLID,
	 			'startcolor' => array(
	 				'rgb' => 'EBEBEB'
	 			)
	 		)
		));
		
		$objPHPExcel->getActiveSheet()->getStyle('B6:G'.$row)->applyFromArray(array(
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
			)
		));
		
		$objPHPExcel->getActiveSheet()->getStyle('B2:G'.$row)->applyFromArray(array(
			'borders' => array(
				'outline' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
				)
			)
		));
		
		// drawing logo header
		$objDrawing = new PHPExcel_Worksheet_Drawing();
		$objDrawing->setName('Contest-Logo');
		$objDrawing->setDescription('Logo');
		$objDrawing->setCoordinates('B2');
		$objDrawing->setPath(API_UPLOAD_DIR . '/' . $id . '_logo_img.jpg');
		$objDrawing->setWidthAndHeight(100,65);
		$objDrawing->setOffsetX(3);
		$objDrawing->setOffsetY(5);
		$objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
		
		$objDrawing = new PHPExcel_Worksheet_Drawing();
		$objDrawing->setName('Conversion-hub-logo');
		$objDrawing->setDescription('Powered by Conversion Hub');
		$objDrawing->setPath('./../contest/images/masktoplogo.png');
		$objDrawing->setHeight(80);
		$objDrawing->setCoordinates('G'.($row + 2));
		$objDrawing->setOffsetX(70);
		$objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
		
		$cellLink = 'G'.($row + 6);
		$objPHPExcel->getActiveSheet()->setCellValue($cellLink, 'Powered by asiafoodrecipe');
		$objPHPExcel->getActiveSheet()->getCell($cellLink)->getHyperlink()->setUrl('http://www.asiafoodrecipe.com');
		$objPHPExcel->getActiveSheet()->getCell($cellLink)->getHyperlink()->setTooltip('Visit asiafoodrecipe');
		$objPHPExcel->getActiveSheet()->getStyle($cellLink)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
		
		$objPHPExcel->getActiveSheet()->setTitle('Contestants');
		
		/* Terms */
		
		$objPHPExcel->createSheet();

		$tm1 = 'Sweepstakes is open to any individual in Singapore with a valid mailing address. Limit one entry and prize per person, household, or e-mail address. The organizers reserve the right to change or add to the prizes and substitute them with a comparable alternative due o unforeseen circumstances or circumstances beyond their control';
		$tm2 = 'Prizes are non-transferable and no cash equivalent will be offered. Odds of winning depend on the number of eligible entries received. All terms and conditions of Facebook apply. This Sweepstakes is in no way sponsored, endorsed, or administered by, or associated with, Facebook. By submitting an entry, you understand that you are submitting your information to Sponsor and not to Facebook.';
		
		// Add some data to the second sheet, resembling some different data types
		$objPHPExcel->setActiveSheetIndex(1);
		$objPHPExcel->getActiveSheet()->setCellValue('A1', 'Terms and conditions');
		$objPHPExcel->getActiveSheet()->setCellValue('A3', $tm1);
		$objPHPExcel->getActiveSheet()->setCellValue('A4', $tm2);
		
		// Set the worksheet tab color
		$objPHPExcel->getActiveSheet()->getTabColor()->setRGB('FEDFCD');
		// Set alignments
		$objPHPExcel->getActiveSheet()->getStyle('A3:A6')->getAlignment()->setWrapText(true);
		// Set column widths
		$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(80);
		// Set fonts
		$objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->setName('Arial');
		$objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->setSize(20);
		$objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->setBold(true);
		$objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->setUnderline(PHPExcel_Style_Font::UNDERLINE_SINGLE);
		
		$objPHPExcel->getActiveSheet()->getStyle('A3:A6')->getFont()->setSize(8);
		// Set page orientation and size
		$objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
		$objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
		// Rename second worksheet
		$objPHPExcel->getActiveSheet()->setTitle('Terms and conditions');
		
		// Set active sheet index to the first sheet, so Excel opens this as the first sheet
		$objPHPExcel->setActiveSheetIndex(0);
		
		/*
		 * Format Excel 2007 (recomended)
		 * .xlsx
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment;filename="'. $filename .'.xlsx"');
		header('Cache-Control: max-age=0');
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save('php://output');
		 */
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save(API_DOWNLOAD_DIR . "/{$filename}.xls");
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment;filename="'. $filename .'.xlsx"');
		header('Cache-Control: max-age=0');
		
		/*
		 * Format Excel5
		 * .xls
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
		$objWriter->save(API_DOWNLOAD_DIR . '/sample.xls');
		 */
	}
	catch (ForbiddenException $e){
		$app->halt(403, $e->getMessage());
	}
	catch(Exception $e){
		$app->halt(500, $e->getMessage());
	}
});

$app->run();

?>