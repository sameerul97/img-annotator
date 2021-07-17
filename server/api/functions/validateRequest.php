<?php

include_once '../config/core.php';
include_once  '../functions/jwt.php';

if (!function_exists('getallheaders')) {
    function getallheaders()
    {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

function validRequest($headers)
{
    $auth_header_found = false;

    foreach ($headers as $name => $value) {
        $auth = "Authorization";
        $b = $name == $auth;

        if ($b) {
            $auth_header_found = true;
            $tokenValidate = json_decode(validateToken($value));

            if (!$tokenValidate->success) {
                http_response_code(401);
                // throw new Exception($tokenValidate->message);
                throw new Exception("Auth fail");;
                // return true;
            } else {
                return true;
            }
        }
    }

    if (!$auth_header_found) {
        http_response_code(401);
        throw new Exception("No auth header");;
    }
}
