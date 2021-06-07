<?php
include('../config/header_config.php');
include_once '../config/core.php';
include_once '../controller/popup_widget.php';
include_once '../functions/jwt.php';
include_once '../functions/validateRequest.php';

$route     = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

ini_set('display_errors', true);
ini_set('display_errors', 'On');
ini_set('html_errors', 0);

error_reporting(-1);

switch ($method) {
    case 'GET':
        http_response_code(405);
        echo badRequest();
        break;

    case 'POST':
        try {
            if (validRequest(getallheaders())) {
                $data = json_decode(file_get_contents("php://input"));
                $a = new PopupWidgetController();
                echo $a->creatWidget($data);
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
        try {
            if (validRequest(getallheaders())) {
                $data = json_decode(file_get_contents("php://input"));
                $a = new PopupWidgetController();
                echo $a->putWidget($data);
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

    case 'DELETE':
        try {
            if (validRequest(getallheaders())) {
                $data = json_decode(file_get_contents("php://input"));
                $a = new PopupWidgetController();
                echo $a->deleteWidget($data);
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
