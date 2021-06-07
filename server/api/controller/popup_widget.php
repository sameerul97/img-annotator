
<?php

// include_once '../config/database.php';
include_once '../model/popup_widget.php';
// include_once '../functions/jwt.php';

include_once '../libs/vlucas_valitron/Valitron/Validator.php';

use Valitron\Validator as V;

V::langDir('../libs/vlucas_valitron/lang');
V::lang('en');

class PopupWidgetController
{

    public function getAllMarker()
    {
        // $v = new Valitron\Validator($_GET);
        // $v->rule('required', ['image_id']);

        // if ($v->validate()) {
        //     // $tl = new Station();
        //     // return $tl->create($data);
        // } else {
        //     throw new Exception(serialize($v->errors()));
        // }
    }

    public function creatWidget($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['image_id', 'marker_id',  "widget_type_id", 'react_widget_id']);

        if ($v->validate()) {
            $tl = new PopupWidget();
            return $tl->create($data);
        } else {
            throw new Exception(serialize($v->errors()));
        }
    }

    public function putWidget($data)
    {
        // $v = new Valitron\Validator( $data);
        $v = new Valitron\Validator((array) $data);
        // _POST
        $v->rule('required', ['marker_id', 'popup_widget_id', 'content']);

        if ($v->validate()) {
            $tl = new PopupWidget();
            return $tl->update($data, false);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }

    // Only used for image widget update (cant use put request to send image)
    public function putImageWidget($data)
    {
        $v = new Valitron\Validator($data);
        // $v = new Valitron\Validator((array) $data);
        // _POST
        $v->rule('required', ['marker_id', 'popup_widget_id']);

        if ($v->validate()) {
            $tl = new PopupWidget();
            return $tl->update($data, true);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }

    public function saveWidgetOrder($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['marker_id', 'popup_content']);

        if ($v->validate()) {
            $tl = new PopupWidget();
            return $tl->updateWidgetOrder($data, true);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }

    public function deleteWidget($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['marker_id', 'popup_widget_id']);

        if ($v->validate()) {
            $tl = new PopupWidget();
            return $tl->delete($data);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }

    // Carousel widget CRUD functions [ since each carousel slide has CRUD functionality ]
    public function addNewSlideInCarousel()
    {
        $v = new Valitron\Validator($_GET);
        $v->rule('required', ['marker_id', 'popup_widget_id', 'imageSlide']);

        if ($v->validate()) {
            $tl = new PopupWidget();
            $popup_widget_id = $_GET['popup_widget_id'];
            $marker_id = $_GET['marker_id'];
            $imageSlide = $_GET['imageSlide'];
            return $tl->addNewSlideInCarousel($popup_widget_id, $marker_id, $imageSlide);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }

    public function deleteSlideInCarousel($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['marker_id', 'popup_widget_id', 'slide_id']);

        if ($v->validate()) {
            $tl = new PopupWidget();
            return $tl->deleteSlideInCarousel($data);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }

    public function updateSlideInCarousel($data)
    {
        $v = new Valitron\Validator($data);
        // $v = new Valitron\Validator((array) $data);
        // _POST
        $v->rule('required', ['marker_id', 'popup_widget_id']);

        if ($v->validate()) {
            $tl = new PopupWidget();
            return $tl->updateSlideInCarousel($data, true);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }

    public function updateSlideOrderInCarousel($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['marker_id', 'popup_widget_id', 'content']);

        if ($v->validate()) {
            $tl = new PopupWidget();
            return $tl->updateSlideOrderInCarousel($data);
        } else {
            http_response_code(401);
            throw new Exception(serialize($v->errors()));
        }
    }
}
