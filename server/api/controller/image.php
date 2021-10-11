<?php

// include_once '../config/database.php';
include_once '../model/image.php';
include_once '../functions/jwt.php';

include_once '../libs/vlucas_valitron/Valitron/Validator.php';

use Valitron\Validator as V;

V::langDir('../libs/vlucas_valitron/lang');
V::lang('en');

class ImageController
{
    public $id;

    public function getImages()
    {
        $v = new Valitron\Validator($_GET);
        $v->rule('required', ['page_no']);
        $v->rule('integer', 'page_no');

        if ($v->validate()) {
            $tl = new Image();
    
            return $tl->getImages($_GET);
        } else {
            return json_encode(array(
                "error" => $v->errors(),
                "message" => null,
            ));
        }
    }

    public function getImage()
    {
        $v = new Valitron\Validator($_GET);
        $v->rule('required', ['image_id']);
        $v->rule('integer', 'image_id');

        if ($v->validate()) {
            $tl = new Image();
            $imageId = $_GET['image_id'];

            return $tl->getImage($imageId);
        } else {
            return json_encode(array(
                "error" => $v->errors(),
                "message" => null,
            ));
        }
    }

    public function getAllImages()
    {
        $tl = new Image();
        return $tl->getAllImages();
    }

    public function postImage($data)
    {
        $v = new Valitron\Validator($data);

        $v->rule('required', ['name', 'Stations_id', 'Users_id']);
        // $v->rule('integer', 'Stations_id');
        // $v->rule('integer', 'Users_id');

        if ($v->validate()) {
            $tl = new Image();
            // var_dump($data);
            return $tl->create($data);
        } else {
            return json_encode(array(
                "error" => $v->errors(),
                "message" => null,
            ));
        }
    }

    public function putImage($data)
    {
        $v = new Valitron\Validator((array) $data);

        $v->rule('required', ['url', 'name', 'Stations_id', 'Users_id', 'image_id']);
        $v->rule('integer', 'Stations_id');
        $v->rule('integer', 'Users_id');
        $v->rule('integer', 'image_id');

        if ($v->validate()) {
            $tl = new Image();
            return $tl->update($data);
        } else {
            return json_encode(array(
                "error" => $v->errors(),
                "message" => null,
            ));
        }
    }

    public function deleteImage($data)
    {
        $v = new Valitron\Validator((array) $data);

        $v->rule('required', ['image_id']);

        $v->rule('integer', 'image_id');
        // $data = json_decode(file_get_contents("php://input"));

        if ($v->validate()) {
            $tl = new Image();
            return $tl->delete($data);
            // return json_encode(array(
            //     "message" =>  $data->url,
            //     "message" =>  $data->name
            // ));
        } else {
            return json_encode(array(
                "error" => $v->errors(),
                "message" => null,
            ));
        }
        // $tokenValidate = json_decode(validateToken($token));

        // if (!$tokenValidate->success) {
        //     throw new Exception($tokenValidate->message);;
        // }

        // return json_encode(array(
        //     "message" => "delete image"
        // ));
    }
}
