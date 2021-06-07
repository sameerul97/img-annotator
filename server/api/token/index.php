<?php

require_once('../config/header_config.php');

require_once('../functions/jwt.php');
include_once '../functions/validateRequest.php';

$route     = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

ini_set('display_errors', 'On');
ini_set('html_errors', 0);

error_reporting(-1);

switch ($method) {
    case 'GET':
        echo json_encode(array(
            "message" => "Rest API Token validation",
            "endpoint" => "/token get",
        ));
        break;

    case 'POST':
        try {

            if (validRequest(getallheaders())) {
                http_response_code(200);
                echo  json_encode(array(
                    "okay" => true,
                ));
            }
        } catch (Exception $e) {
            http_response_code(401);
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
