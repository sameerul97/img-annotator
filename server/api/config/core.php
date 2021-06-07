<?php
// show error reporting
error_reporting(E_ALL);

// set your default time-zone
date_default_timezone_set('Europe/London');

// variables used for jwt
// $key = "example_key";
$key = '5f2b5cdbe5194f10b3241568fe4e2b24';
$issued_at = time();
$expiration_time = $issued_at + (60 * 60); // valid for 1 hour
$expiration_time = strtotime("+60 minutes");
$issuer = "API";


function badRequest()
{
    return json_encode(array(
        "message" => "Access denied",
        "response" => "Invalid method"
    ));
}

function getKey()
{
    global $key;
    return $key;
}
