<?php
// inserted when a new image is created
function insertTemporaryMarkersInDatabase($thisImageId, $conn)
{
    // 0 =>
    // array(
    //     'markerTop' => '550.0404203718675',
    //     'markerLeft' => '176.07113985448',
    //     'color' => '#e91e63',
    //     'order_no' => 0,
    //     'markerAnimationType' =>  '',
    //     'markerType' =>  '',
    //     'markerImage' =>  '',
    //     'backgroundColor' =>  '',
    //     'borderRadius' =>  '',
    // ),
    $markerTableName = 'Markers';

    $tempMarker =
        array(
            0 =>
            array(
                'markerTop' => '67.62436005195998',
                'markerLeft' => '100.9540765645297',
                'color' => '#e91e63',
                'animation_type' =>  '',
                'marker_type' =>  '',
                'marker_image' =>  '',
                'background_color' =>  '',
                'border_radius' =>  '',
            ),
            1 =>
            array(
                'markerTop' => '191.43879826311465',
                'markerLeft' => '125.9712475061613',
                'color' => '#e91e63',
                'animation_type' =>  '',
                'marker_type' =>  '',
                'marker_image' =>  '',
                'background_color' =>  '',
                'border_radius' =>  '',
            ),
        );

    foreach ($tempMarker as $value) {
        $markerTop = $value['markerTop'];
        $markerLeft = $value['markerLeft'];
        $markerColor = $value['color'];
        $markerAnimationType = '';
        $markerType = '';
        $markerImage = '';
        $backgroundColor = '';
        $borderRadius = '';

        $markerQuery = "INSERT INTO " . $markerTableName . "
        SET
            markerTop = :markerTop,
            markerLeft = :markerLeft,
            color = :color,
            animation_type = :animation_type,
            marker_type = :marker_type,
            Images_id = :Images_id,
            marker_image = :marker_image,
            background_color = :background_color,
            border_radius = :border_radius
            ";

        $stmt2 = $conn->prepare($markerQuery);

        $stmt2->bindParam(':markerTop', $markerTop);
        $stmt2->bindParam(':markerLeft', $markerLeft);
        $stmt2->bindParam(':color', $markerColor);
        $stmt2->bindParam(':animation_type', $markerAnimationType);
        $stmt2->bindParam(':marker_type', $markerType);
        $stmt2->bindParam(':Images_id', $thisImageId);
        $stmt2->bindParam(':marker_image', $markerImage);
        $stmt2->bindParam(':background_color', $backgroundColor);
        $stmt2->bindParam(':border_radius', $borderRadius);

        if ($stmt2->execute()) {
            $thisMarkerId = $conn->lastInsertId();
            insertTemporaryPopup_Contents($thisMarkerId, $conn, $thisImageId);
        } else {
            http_response_code(401);
            print_r($stmt2->errorInfo());
            throw new Exception("error database");
        }
    }

    http_response_code(201);
    return json_encode(array(
        "image_id" => $thisImageId,
        "created" => true
    ));
}
//  +++++++++++++++
//  Try with transaction, so it gets rolled back if anything fails
//  https://stackoverflow.com/questions/47473603/insert-data-to-two-tables-using-last-id-pdo-php-mysql
// +++++++++++++++=

// Inserts when a new marker is created by the user
function insertTemporaryPopup_Contents($thisMarkerId, $conn2, $thisImageId)
{
    $popupContentTable = 'Popup_Contents';
    $popupContentQuery = "INSERT INTO " . $popupContentTable . "
    SET
        widget_type_id = :widget_type_id,
        react_widget_id = :react_widget_id,
        content = :content,
        Markers_id = :Markers_id,
        order_no = :order_no         
        ";

    $tempPopupContent =
        array(
            0 =>
            array(
                'widgetType' => 'image',
                'widget_type_id' => 'widget_id_2',
                'react_widget_id' => 'widget_id_2',
                'src' => '_popup_placeholder_image.png',
                'order_no' => 0,
            ),
            1 =>
            array(
                'id' => 'widget_id_1_khugb355kxfw40w1v4d',
                'widget_type_id' => 'widget_id_1',
                'react_widget_id' => 'widget_id_1',
                'src' => '{"blocks":[{"key":"7pjmv","text":"Lorem empsum 2","type":"header-three","depth":0,"inlineStyleRanges":[{"offset":0,"length":14,"style":"color-rgb(52,58,64)"},{"offset":0,"length":14,"style":""},{"offset":0,"length":14,"style":"fontsize-1.5rem"},{"offset":0,"length":14,"style":"fontfamily--apple-system, BlinkMacSystemFont, \\"Segoe UI\\", Roboto, \\"Helvetica Neue\\", Arial, \\"Noto Sans\\", sans-serif, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\", \\"Segoe UI Symbol\\", \\"Noto Color Emoji"}],"entityRanges":[],"data":{"text-align":"left"}}],"entityMap":{}}',
                'order_no' => 1,
            ),
            2 =>
            array(
                'id' => 'widget_id_5_khugb5pbju9px2w2pem',
                'widget_type_id' => 'widget_id_5',
                'react_widget_id' => 'widget_id_5',
                'src' => '{"blocks":[{"key":"7pjmv","text":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, assumenda illo, vitae maiores itaque aliquid ad voluptates sit hic beatae, non tempora rerum ipsa? Maxime? 2","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{"text-align":"left"}}],"entityMap":{}}',
                'order_no' => 2,
            ),
            3 =>
            array(
                'widgetType' => 'button',
                'widget_type_id' => 'widget_id_4',
                'react_widget_id' => 'widget_id_4',
                'src' => '{"buttonTextSrc":{"blocks":[{"key":"7pjmv","text":"Some test button","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{"text-align":"center"}}],"entityMap":{}},"buttonUrlSrc":"https://unsplash.com/photos/hNSKX6sKWfk"}',
                'order_no' => 3,
            ),
        );

    foreach ($tempPopupContent as $value) {
        $stmt2 = $conn2->prepare($popupContentQuery);

        $widget_type_id = $value['widget_type_id'];
        $content = $value['src'];
        $react_widget_id = $value['react_widget_id'];
        $order_no = $value['order_no'];

        $stmt2->bindParam(':widget_type_id', $widget_type_id);
        $stmt2->bindParam(':react_widget_id', $react_widget_id);
        $stmt2->bindParam(':content', $content);
        $stmt2->bindParam(':Markers_id', $thisMarkerId);
        $stmt2->bindParam(':order_no', $order_no);

        if ($stmt2->execute()) {
        } else {
            http_response_code(401);
            print_r($stmt2->errorInfo());
            throw new Exception("error database");
        }
    }
}
