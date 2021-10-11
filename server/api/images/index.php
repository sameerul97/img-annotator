<?php
include('../config/header_config.php');
include_once '../config/core.php';
include_once '../controller/image.php';
include_once '../functions/jwt.php';
include_once '../functions/validateRequest.php';

$route     = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            if (validRequest(getallheaders())) {
                $a = new ImageController();
                echo $a->getImages();
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
        http_response_code(405);
        echo badRequest();
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
