<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");  

$route     = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        echo  json_encode(array(
            "message" => "User.php get " . ceil(3.75),
            "param" => $_GET["param"],
            "param2" => $_GET["param2"],
        ));
        break;
    case 'POST':
        echo  json_encode(array(
            "message" => "User.php post",
            "response" => "Invalid method"
        ));

        break;
    case 'PUT':
        // http_response_code(405);

        echo  json_encode(array(
            "message" => "test_user.php put",
            // "response" => "Invalid method"
        ));
        break;
    case 'DELETE':
        echo  json_encode(array(
            "message" => "User.php delete",
            "response" => "Invalid method"
        ));
        break;
    default:
        echo  json_encode(array(
            "message" => "unknown method",
            "response" => "Invalid method"
        ));
        break;
}
