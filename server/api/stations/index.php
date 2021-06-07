<?php
include('../config/header_config.php');
include('../config/core.php');
include('../controller/station.php');
include_once('../functions/jwt.php');
include_once('../functions/validateRequest.php');
// header("Access-Control-Allow-Origin: *");
$route     = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            if (validRequest(getallheaders())) {
                $a = new StationController();

                http_response_code(200);
                echo $a->getAllStation();
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo  json_encode(array(
                "error" => true,
                "message" => $e->getMessage()
            ));
        }
        break;

    case 'POST':
        try {
            if (validRequest(getallheaders())) {

                $data = json_decode(file_get_contents("php://input"));
                $a = new StationController();
                echo $a->createStation($data);
                break;
            }
        } catch (Exception $e) {
            echo  json_encode(array(
                "error" => true,
                "message" => $e->getMessage()
            ));
        }
        break;

    case 'PUT':
        http_response_code(405);
        echo badRequest();
        break;

    case 'DELETE':
        http_response_code(405);
        echo badRequest();
        break;

    case 'OPTIONS':
        // http_response_code(405);
        // echo badRequest();
        return 0;
        break;

    default:
        http_response_code(405);
        echo badRequest();
        break;
}
