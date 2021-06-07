<?php
include_once './config/header_config.php';
echo json_encode(array(
    "message" => "Resst API home",
    "endpoint" => "/home",
    // "origin" => $_SERVER['HTTP_ORIGIN']
));
