<?php

include_once '../config/core.php';

include_once '../libs/php-jwt/src/BeforeValidException.php';
include_once '../libs/php-jwt/src/ExpiredException.php';
include_once '../libs/php-jwt/src/SignatureInvalidException.php';
include_once '../libs/php-jwt/src/JWT.php';


function generateToken($payload, $key)
{
    $token = JWT::encode($payload, $key);
    return $token;
}

function validateToken($token)
{
    // return getKey();
    try {
        // decode jwt
        $decoded = JWT::decode($token, getKey(), array('HS256'));

        // return json_encode(array(
        //     "success" => true,
        // ));
        return json_encode(array(
            "success" => true,
        ));
    }
    // if decode fails, it means jwt is invalid
    catch (Exception $e) {
        return json_encode(array(
            "success" => false,
            "message" => $e->getMessage()
        ));
    }
}
