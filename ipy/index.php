<?php
header("Content-Type: application/json");

$request = $_POST;
$response = array('html' => array(), 'png' => array(), 'params' => array());
if(!empty($request['__A__'])){
	$name = $request['__A__'];
	$jsonFile = $request['__L__'] . '.json';
	$ipynb = $request['__L__'] . '/' . $name . ".ipynb";
	unset($request['__A__']);
	unset($request['__L__']);

	$params = null;
	if(!empty($request)){
		$response['params'] = $request;
		foreach($request as $key=>$value) $params = (!empty($params) ? $params . " " : "") . $key . (is_string($value) ? "='" . $value . "'" : "=" . $value);
	}

	if(is_file($ipynb)){
		if(is_readable($ipynb))
		{
			$command = escapeshellcmd($params . " runipy --stdout " . $ipynb);
			$output = shell_exec($command);
			$results = json_decode($output, true);
			if(!empty($results['worksheets'])){
				foreach($results['worksheets'] as $result){
					if(empty($result['cells'])) continue;
					foreach($result['cells'] as $cells){
						if(empty($cells['outputs'])) continue;
						foreach($cells['outputs'] as $outputs){
							if(!empty($outputs['html'])) $response['html'][] = implode($outputs['html']);
							if(!empty($outputs['png'])) $response['png'][] = $outputs['png'];
						}
					}
				}
			}

			$contents = array();
			$json_file = './result/' . $jsonFile;
			if(is_file($json_file)){
				$json_contents = file_get_contents($json_file);
				$contents = json_decode($json_contents, true);
			}
			$contents[$name] = $response;

			file_put_contents($json_file, json_encode($contents));
		}else{
			$response = array('result' => false, 'msg' => 'The file[' . $ipynb . '] is not readable.');
		}
	}else{
		$response = array('result' => false, 'msg' => 'The file[' . $ipynb . '] is not find.');
	}
}elseif(!empty($request['name'])){
	$response = array('result' => true);
	$json_file = './result/' . $request['name'] . '.json';
	if(!is_file($json_file)){
		$response = array('result' => false);
	}
}
	
die(json_encode($response));
