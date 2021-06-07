<?php

require('../config/header_config.php');

require_once('../controller/login.php');
$route     = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // http_response_code(405);
        // echo badRequest();
        echo json_encode(array(
            "message" => "Rest API login",
            "endpoint" => "/login get",
        ));
        break;

    case 'POST':
        try {
            $data = json_decode(file_get_contents("php://input"));
            $login = new LoginController($data);
            echo $login->login();
        } catch (Exception $e) {
            $data = @unserialize($e->getMessage());

            if ($data !== false) {
                http_response_code(401);
                echo json_encode(array(
                    "error" => true,
                    "validationError" => true,
                    "message" => $data
                ));
            } else {
                http_response_code(400);
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
