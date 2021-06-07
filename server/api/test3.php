<?php
//Enter your code here, enjoy!

$array = '[{"id":"1","src":"_popup_placeholder_image.png","order_no":1,"caption":"Carousel Image1"},{"id":"2","src":"_popup_placeholder_image.png","order_no":2,"caption":"Carousel Image2"}]';

// echo json_decode($array);

$e = json_decode($array);

foreach ($e as $i => $i_value) {
    $i_value->src = "saa" . $i_value->src;
}


echo json_encode($e);
