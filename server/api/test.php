<?php


$myObj->name = "Cors test";
$myObj->version = "0.0.1";
// $_POST = json_decode(file_get_contents('php://input'), true);


// if (isset($_POST['request_p1'])) {
//     // echo "sam" . $_POST['request_p1'];
//     $myObj->p1 = $_POST['request_p1'];
// }
echo json_encode($myObj);
