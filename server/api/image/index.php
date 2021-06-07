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
            // if (validRequest(getallheaders())) {
            $a = new ImageController();
            echo $a->getImage();
            // }
        } catch (Exception $e) {
            echo  json_encode(array(
                "error" => true,
                "message" => $e->getMessage()
            ));
        }
        break;

    case 'POST':
        try {
            if (validRequest(getallheaders())) {

                // $data = json_decode(file_get_contents("php://input"));
                $a = new ImageController();
                // var_dump($_POST)
                echo $a->postImage($_POST);
                break;
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
        try {
            // foreach (getallheaders() as $name => $value) {
            //     $var = "Authorization";
            //     $b = $name == $var;
            //     if ($b) {
            if (validRequest(getallheaders())) {
                $data = json_decode(file_get_contents("php://input"));
                $a = new ImageController();
                echo $a->putImage($data);
                break;
            }
            //     }
            // }
        } catch (Exception $e) {
            echo  json_encode(array(
                "error" => true,
                "message" => $e->getMessage()
            ));
        }
        break;

    case 'DELETE':
        try {
            if (validRequest(getallheaders())) {
                $data = json_decode(file_get_contents("php://input"));
                $a = new ImageController();
                echo $a->deleteImage($data);
            }
        } catch (Exception $e) {
            echo  json_encode(array(
                "error" => true,
                "message" => $e->getMessage()
            ));
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
