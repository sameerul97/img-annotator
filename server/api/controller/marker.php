<?php

// include_once '../config/database.php';
include_once '../model/marker.php';
// include_once '../functions/jwt.php';

include_once '../libs/vlucas_valitron/Valitron/Validator.php';

use Valitron\Validator as V;

V::langDir('../libs/vlucas_valitron/lang');
V::lang('en');

class MarkerController
{

    public function getAllMarker()
    {
        $v = new Valitron\Validator($_GET);
        $v->rule('required', ['image_id']);

        if ($v->validate()) {
            // $tl = new Station();
            // return $tl->create($data);
        } else {
            throw new Exception(serialize($v->errors()));
        }
    }

    public function createMarker($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['image_id']);

        if ($v->validate()) {
            $tl = new Marker();
            return $tl->create($data);
        } else {
            throw new Exception(serialize($v->errors()));
        }
    }

    public function putMarker($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['image_id']);

        if ($v->validate()) {
            $tl = new Marker();
            return $tl->update($data);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }

    public function deleteMarker($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['marker_id', 'popup_id']);

        if ($v->validate()) {
            $tl = new Marker();
            return $tl->delete($data);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }
}
