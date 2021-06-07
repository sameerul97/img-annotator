<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include_once '../config/core.php';
// include_once '../controller/register.php';
require_once('../controller/register.php');
require_once('../config/core.php');

$route     = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        http_response_code(405);
        echo badRequest();
        break;

    case 'POST':
        try {
            $data = json_decode(file_get_contents("php://input"));
            $register = new RegisterController($data);
            echo $register->register();
            // echo  json_encode(array(
            //     // "error" => true,
            //     "message" => "register post"
            // ));
        } catch (Exception $e) {
            http_response_code(400);
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
    default:
        http_response_code(405);
        echo badRequest();
        break;
}
