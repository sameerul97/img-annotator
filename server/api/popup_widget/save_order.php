<?php
include('../config/header_config.php');
include_once '../config/core.php';
include_once '../controller/popup_widget.php';
include_once '../functions/jwt.php';
include_once '../functions/validateRequest.php';

$route     = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        http_response_code(405);
        echo badRequest();
        break;

    case 'POST':
        try {
            if (validRequest(getallheaders())) {
                // $data = json_decode(file_get_contents("php://input"), $_PUT);
                $data = json_decode(file_get_contents("php://input"));

                $a = new PopupWidgetController();
                // var_dump($_POST);
                // parse_str(file_get_contents('php://input'), $_PUT);
                // var_dump($_PUT);
                echo $a->saveWidgetOrder($data);
                break;
            }
        } catch (Exception $e) {
            $data = @unserialize($e->getMessage());

            if ($data !== false) {
                http_response_code(400);
                echo json_encode(array(
                    "error" => true,
                    "validationError" => true,
                    "message" => $data
                ));
            } else {
                http_response_code(401);
                echo json_encode(array(
                    "error" => true,
                    "validationError" => false,
                    "message" => $e->getMessage()
                ));
            }
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
