<?php
require("../config/app_url.php");
require_once('../config/database.php');
require_once('../libs/php_image_magician.php');
// require_once('../functions/insert_default_data.php');
ini_set('display_errors', true);

class Marker
{
    private $conn;
    private $table_name = "Markers";


    public function __construct()
    {
        $database = new Database();
        $appUrl = new App_Url();
        $db = $database->getConnection();

        $this->conn = $db;
        $this->baseUrl = $appUrl->getAppUrl();
        $this->popup_image_base_url = $appUrl->getPopupImageBaseUrl();
    }

    function get()
    {
    }

    function create($data)
    {
        $thisImageId = intval($data->image_id);

        function insertTemporaryMarkersInDatabase($thisImageId, $conn, $popup_image_base_url)
        {
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
                    )
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
                    $thisMarkerId = intval($conn->lastInsertId());
                    $thisPopupId = insertTemporaryPopup_Contents($thisMarkerId, $conn, $thisImageId);
                } else {
                    // http_response_code(401);
                    // print_r($stmt2->errorInfo());
                    throw new Exception("Some database error! Try again");
                }
            }

            $sql = "SELECT *  FROM " . $markerTableName . " WHERE id = :marker_id ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':marker_id', $thisMarkerId);
            $stmt->execute();

            $new_marker = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $popups = array("id" => $thisMarkerId, "popup_content" => []);

            $popupContentTable = 'Popup_Contents';
            $popup_query = "SELECT *  FROM " . $popupContentTable . " WHERE id = :popup_id ";

            foreach ($thisPopupId as $popup_id) {
                $stmt = $conn->prepare($popup_query);
                $this_popup_id = intval($popup_id);
                $stmt->bindParam(':popup_id', $this_popup_id);
                $stmt->execute();
                $results = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($results['widget_type_id'] === 'widget_id_2') {
                    $results['content'] = $popup_image_base_url . $results['content'];
                }
                array_push($popups['popup_content'], $results);
            }


            http_response_code(201);
            return json_encode(array(
                "marker_id" => $thisMarkerId,
                "new_marker" => $new_marker,
                "new_popup" => $popups,
                "popup_id2" => $thisPopupId
            ));
        }

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
                        'src' => '{"blocks":[{"key":"7pjmv","text":"Lorem empsum ,newly added","type":"header-three","depth":0,"inlineStyleRanges":[{"offset":0,"length":14,"style":"color-rgb(52,58,64)"},{"offset":0,"length":14,"style":""},{"offset":0,"length":14,"style":"fontsize-1.5rem"},{"offset":0,"length":14,"style":"fontfamily--apple-system, BlinkMacSystemFont, \\"Segoe UI\\", Roboto, \\"Helvetica Neue\\", Arial, \\"Noto Sans\\", sans-serif, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\", \\"Segoe UI Symbol\\", \\"Noto Color Emoji"}],"entityRanges":[],"data":{"text-align":"left"}}],"entityMap":{}}',
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

            $popup_ids = [];


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
                    array_push($popup_ids, $conn2->lastInsertId());
                } else {
                    // http_response_code(401);
                    // print_r($stmt2->errorInfo());
                    throw new Exception("Some database error! Try again");
                }
            }

            return $popup_ids;
            // return $conn2->lastInsertId();
        }

        return insertTemporaryMarkersInDatabase($thisImageId, $this->conn, $this->popup_image_base_url);
    }

    function update($data)
    {
        // var_dump($data->markers->marker_positions);
        $success = false;
        foreach ($data->markers->marker_positions as $value) {
            //    var_dump( $value) ;
            // echo $value->top;
            $query = "UPDATE " . $this->table_name . "
            SET
            markerTop = :markerTop,
            markerLeft = :markerLeft
             WHERE id = :marker_id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':markerTop', $value->top);
            $stmt->bindParam(':markerLeft', $value->left);
            $stmt->bindParam(':marker_id', $value->m_id);

            if ($stmt->execute()) {
                $success = true;
                // return true;
            } else {
                // print_r($stmt->errorInfo());
                $success = false;
                throw new Exception("Some database error! Try again");
            }
        }

        if ($success) {
            return json_encode(array(
                "message" => "Updated"
            ));
        }
    }

    function delete($data)
    {
        $popupContentTable = 'Popup_Contents';
        $queryToDeletePopupContents = "DELETE FROM " . $popupContentTable . " WHERE Markers_id = :marker_id";

        $stmt = $this->conn->prepare($queryToDeletePopupContents);
        $popup_contents_fk_marker_id = intval($data->marker_id);
        $stmt->bindParam(':marker_id', $popup_contents_fk_marker_id);

        if ($stmt->execute()) {
            $query = "DELETE FROM " . $this->table_name . " WHERE id = :marker_id";

            $stmt = $this->conn->prepare($query);
            $marker_id = intval($data->marker_id);
            $stmt->bindParam(':marker_id', $marker_id);

            if ($stmt->execute()) {
                return true;
            } else {
                throw new Exception("Some database error! Try again");
            }
        } else {
            throw new Exception("Some database error! Try again");
        }
    }
}
