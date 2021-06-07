<?php

// include_once '../config/database.php';
include_once '../model/station.php';
// include_once '../functions/jwt.php';

include_once '../libs/vlucas_valitron/Valitron/Validator.php';

use Valitron\Validator as V;

V::langDir('../libs/vlucas_valitron/lang');
V::lang('en');

class StationController
{

    public function getAllStation()
    {
        $tl = new Station();
        return $tl->get();
    }

    public function createStation($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['name']);

        if ($v->validate()) {
            $tl = new Station();
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
    }

    public function deleteImage($data)
    {
    }
}
