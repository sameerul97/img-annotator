<?php

include_once '../model/details.php';

include_once '../libs/vlucas_valitron/Valitron/Validator.php';

use Valitron\Validator as V;

V::langDir('../libs/vlucas_valitron/lang');
V::lang('en');

class DetailsController
{

    public function putDetails($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['image_id', 'header']);

        if ($v->validate()) {
            $tl = new Details();
            return $tl->update($data);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }
}
