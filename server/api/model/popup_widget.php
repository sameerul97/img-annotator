<?php
require("../config/app_url.php");
require_once('../config/database.php');
require_once('../libs/php_image_magician.php');
// require_once('../functions/insert_default_data.php');
ini_set('display_errors', true);

class PopupWidget
{
    private $conn;
    private $table_name = "Popup_Contents";
    private $baseUrl;

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
        function getContent($widget_type_id)
        {
            switch ($widget_type_id) {
                case 'widget_id_1':
                    return '{"blocks":[{"key":"7pjmv","text":"Lorem empsum","type":"header-three","depth":0,"inlineStyleRanges":[{"offset":0,"length":14,"style":"color-rgb(52,58,64)"},{"offset":0,"length":14,"style":""},{"offset":0,"length":14,"style":"fontsize-1.5rem"},{"offset":0,"length":14,"style":"fontfamily--apple-system, BlinkMacSystemFont, \\"Segoe UI\\", Roboto, \\"Helvetica Neue\\", Arial, \\"Noto Sans\\", sans-serif, \\"Apple Color Emoji\\", \\"Segoe UI Emoji\\", \\"Segoe UI Symbol\\", \\"Noto Color Emoji"}],"entityRanges":[],"data":{"text-align":"left"}}],"entityMap":{}}';
                    break;
                case "widget_id_2":
                    // image widget
                    return "_popup_placeholder_image.png";
                    break;
                case "widget_id_3":
                    // VideoWidget
                    return  "https://www.youtube.com/embed/-pdVUsCqd2U";
                    break;
                case 'widget_id_4':
                    // ButtonWidget
                    return '{"buttonTextSrc":{"blocks":[{"key":"7pjmv","text":"Test button","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{"text-align":"center"}}],"entityMap":{}},"buttonUrlSrc":"https://www.google.com/"}';
                case 'widget_id_5':
                    // ParagraphWidget
                    return '{"blocks":[{"key":"7pjmv","text":"Lorem ipsum dolor sit amet consectetur ","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{"text-align":"left"}}],"entityMap":{}}';
                case 'widget_id_6':
                    // FreeTextWidget
                    return;
                case 'widget_id_7':
                    // Carousel Widget
                    return '[{"id":"1", "slide_type": "image", "src":"_popup_placeholder_image.png","order_no":1,"caption":"Carousel slide caption"},{"id":"2","slide_type": "image","src":"_popup_placeholder_image.png","order_no":2,"caption":"Carousel slide caption"}]';
            }
        }

        $thisImageId = intval($data->image_id);
        $thisMarkerId = intval($data->marker_id);
        $widget_type_id = $data->widget_type_id;
        $react_widget_id = $data->react_widget_id;
        $content = getContent($widget_type_id);
        $order_no = 2;



        $popupContentQuery = "INSERT INTO " . $this->table_name . "
            SET
                widget_type_id = :widget_type_id,
                react_widget_id = :react_widget_id,
                content = :content,
                Markers_id = :Markers_id,
                order_no = :order_no
            ";

        $stmt = $this->conn->prepare($popupContentQuery);

        $stmt->bindParam(':widget_type_id', $widget_type_id);
        $stmt->bindParam(':react_widget_id', $react_widget_id);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':Markers_id', $thisMarkerId);
        $stmt->bindParam(':order_no', $order_no);

        if ($stmt->execute()) {

            if ($widget_type_id === 'widget_id_2') {
                $content = $this->baseUrl . $content;
            }

            if ($widget_type_id === 'widget_id_7') {
                $content = json_decode($content);

                foreach ($content as $i => $i_value) {
                    $i_value->src = $this->baseUrl . $i_value->src;
                }

                $content = json_encode($content);
            }

            return json_encode(array(
                'new_widget_id' => $this->conn->lastInsertId(),
                'react_widget_id' => $react_widget_id,
                "src" => $content,
                "widget_type_id" => $widget_type_id,
            ));
        } else {
            // print_r($stmt->errorInfo());
            throw new Exception("Some database error! Try again");
        }
    }

    // Param [$updating_image] Only used for image widget update if it's true then download image 
    function update($data, $updating_image)
    {
        // var_dump($data->markers->marker_positions);
        $success = false;
        $target_dir = "../popup_images/";
        $filename = "";
        // foreach ($data->markers->marker_positions as $value) {
        //    var_dump( $value) ;
        // echo $value->top;
        $query = "UPDATE " . $this->table_name . "
            SET
            content = :new_content
             WHERE id = :popup_widget_id";

        $stmt = $this->conn->prepare($query);

        if ($updating_image) {
            if ($data["widget_type_id"] == "widget_id_2") {

                // $data['image_url'] checks if user sent a image URL
                if ($data['image_url'] === "true") {
                    // echo "Get image from url" . $data["image"];
                    // var_dump(intval($data['image_url']));
                    $imageUrl = $data["image"];
                    $target_file =  str_replace(' ', '', time() . rand(11, 99) . 'popup_image' . uniqid());
                    $filename = pathinfo($target_file, PATHINFO_FILENAME);
                    $size = getimagesize($imageUrl);
                    $extension = image_type_to_extension($size[2]);

                    $filename = $filename . $extension;
                    @$rawImage = file_get_contents($imageUrl);

                    if ($rawImage) {
                        file_put_contents($target_dir . $filename, $rawImage);
                        // echo 'Image Saved';
                    } else {
                        echo 'Error Occured';
                    }
                } else {
                    // $data['image_url'] == false, since user uploaded a image

                    if (empty($_FILES['image']['tmp_name']) || !isset($_FILES['image']['tmp_name'])) {
                        throw new Exception("No image");
                    }

                    // echo "Image";
                    $target_file =  str_replace(' ', '', time() . rand(11, 99) . basename($_FILES["image"]["name"]));
                    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
                    $filename = pathinfo($target_file, PATHINFO_FILENAME) . '.' . $imageFileType;

                    $image = new Imagick($_FILES['image']['tmp_name']);
                    // $image->setImageFormat('jpeg');
                    // $image->setImageCompression(Imagick::COMPRESSION_JPEG);
                    // $image->setImageCompressionQuality(100);
                    $image->writeImages($target_dir . $filename, true);
                    $image->clear();
                }


                $popup_widget_id = intval($data["popup_widget_id"]);
                // $newImage = $data['image'];
                $stmt->bindParam(':new_content', $filename);
                $stmt->bindParam(':popup_widget_id', $popup_widget_id);

                if ($stmt->execute()) {
                    $success = true;
                    $image =  $this->popup_image_base_url . $filename;
                    return  $image;
                } else {
                    // print_r($stmt->errorInfo());
                    $success = false;
                    throw new Exception("Some database error! Try again");
                }
            }
            // else
            // if ($data["widget_type_id"] == "widget_id_7") {   // carousel widget
            //     if ($data['image_url'] === "true") {

        } else {
            $popup_widget_id = intval($data->popup_widget_id);
            $stmt->bindParam(':new_content', $data->content);
            $stmt->bindParam(':popup_widget_id', $popup_widget_id);

            if ($stmt->execute()) {
                $success = true;
                $image =  $this->popup_image_base_url . $filename;
                http_response_code(204);
                return  true;
            } else {
                // print_r($stmt->errorInfo());
                $success = false;
                throw new Exception("Some database error! Try again");
            }
        }
    }

    function updateWidgetOrder($data)
    {

        // foreach ($data as $key => $popup_widget) {
        //     var_dump($popup_widget);
        // }
        $query = "UPDATE " . $this->table_name . "
        SET
         order_no = :order_no
         WHERE id = :popup_widget_id AND Markers_id = :fk_marker_id";

        foreach ($data->popup_content as $key => $popup_widget) {
            //    var_dump( $value) ;
            // echo $value->top;

            $stmt = $this->conn->prepare($query);

            $order_no = intval($popup_widget->order_no);
            $popup_widget_id = intval($popup_widget->id);
            $fk_marker_id = intval($data->marker_id);

            $stmt->bindParam(':order_no', $order_no);
            $stmt->bindParam(':popup_widget_id', $popup_widget_id);
            $stmt->bindParam(':fk_marker_id', $fk_marker_id);

            if ($stmt->execute()) {
                $success = true;
                // return true;
            } else {
                // print_r($stmt->errorInfo());
                $success = false;
                throw new Exception("Some database error! Try again");
            }
        }

        return true;
    }

    function delete($data)
    {
        $queryToDeletePopupContents = "DELETE FROM " . $this->table_name . " WHERE id = :popup_widget_id AND Markers_id = :marker_id";

        $stmt = $this->conn->prepare($queryToDeletePopupContents);
        $popup_widget_id = intval($data->popup_widget_id);
        $marker_id = intval($data->marker_id);
        $stmt->bindParam(':popup_widget_id', $popup_widget_id);
        $stmt->bindParam(':marker_id', $marker_id);

        if ($stmt->execute()) {
            return true;
        } else {
            throw new Exception("Some database error! Try again");
        }
    }


    // Carousel
    function addNewSlideInCarousel($popup_widget_id, $marker_id, $imageSlide)
    {

        // if $imageSlide (adding carousel slide as image)
        if ($imageSlide === "true") {
            return $this->addNewImageSlideInCarousel($popup_widget_id, $marker_id);
        } else {

            // TODO:Add video slide in carousel
            return $this->addNewVideoSlideInCarousel($popup_widget_id, $marker_id);
        }
    }

    function addNewVideoSlideInCarousel($popup_widget_id, $marker_id)
    {
        $sql = "SELECT *  FROM " .  $this->table_name  . " WHERE id = :popup_widget_id AND Markers_id = :marker_id";
        $stmt = $this->conn->prepare($sql);

        $popup_widget_id = intval($popup_widget_id);
        $marker_id = intval($marker_id);

        $stmt->bindParam(':popup_widget_id', $popup_widget_id);
        $stmt->bindParam(':marker_id', $marker_id);
        $stmt->execute();

        $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
        $content  = json_decode($results[0]['content']);

        $lastCarouselSlideId = 0;
        $lastOrderNo = 0;
        $newCarouselContent = [];

        foreach ($content as $i => $i_value) {
            $lastCarouselSlideId = intval($i_value->id);
            $lastOrderNo = $i_value->order_no;

            array_push(
                $newCarouselContent,
                (object)[
                    'id' =>  (string)$i_value->id,
                    'slide_type' =>  $i_value->slide_type,
                    'src' =>  $i_value->src,
                    'order_no' =>  $i_value->order_no,
                    'caption' =>  $i_value->caption
                ]
            );
        }

        $lastCarouselSlideId = $lastCarouselSlideId + 1;

        array_push(
            $newCarouselContent,
            (object)[
                'id' => (string)$lastCarouselSlideId,
                'slide_type' =>  "video",
                'src' =>  "https://www.youtube.com/embed/-pdVUsCqd2U",
                'order_no' => $lastOrderNo + 1,
                'caption' =>  "carousel video slide caption"
            ]
        );

        $query = "UPDATE " . $this->table_name . "
        SET
        content = :new_content
         WHERE id = :popup_widget_id AND Markers_id = :marker_id";

        $content = json_encode($newCarouselContent);

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':popup_widget_id', $popup_widget_id);
        $stmt->bindParam(':marker_id', $marker_id);
        $stmt->bindParam(':new_content', $content);

        if ($stmt->execute()) {
            $content  = json_decode($content);

            foreach ($content as $i => $i_value) {

                if ($i_value->slide_type == "image") {
                    $i_value->src = $this->baseUrl . $i_value->src;
                }
            }

            $content  = json_encode($content);

            return   $content;
        } else {
            throw new Exception("Some database error! Try again");
        }
    }


    function addNewImageSlideInCarousel($popup_widget_id, $marker_id)
    {
        $sql = "SELECT *  FROM " .  $this->table_name  . " WHERE id = :popup_widget_id AND Markers_id = :marker_id";
        $stmt = $this->conn->prepare($sql);

        $popup_widget_id = intval($popup_widget_id);
        $marker_id = intval($marker_id);

        $stmt->bindParam(':popup_widget_id', $popup_widget_id);
        $stmt->bindParam(':marker_id', $marker_id);
        $stmt->execute();

        $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
        $content  = json_decode($results[0]['content']);

        $lastCarouselSlideId = 0;
        $lastOrderNo = 0;
        $newCarouselContent = [];

        foreach ($content as $i => $i_value) {
            $lastCarouselSlideId = intval($i_value->id);
            $lastOrderNo = $i_value->order_no;

            array_push(
                $newCarouselContent,
                (object)[
                    'id' =>  (string)$i_value->id,
                    'slide_type' =>  $i_value->slide_type,
                    'src' =>  $i_value->src,
                    'order_no' =>  $i_value->order_no,
                    'caption' =>  $i_value->caption
                ]
            );
        }

        $lastCarouselSlideId = $lastCarouselSlideId + 1;

        array_push(
            $newCarouselContent,
            (object)[
                'id' => (string)$lastCarouselSlideId,
                'slide_type' =>  "image",
                'src' =>  "_popup_placeholder_image.png",
                'order_no' => $lastOrderNo + 1,
                'caption' =>  "carousel slide caption"
            ]
        );

        $query = "UPDATE " . $this->table_name . "
        SET
        content = :new_content
         WHERE id = :popup_widget_id AND Markers_id = :marker_id";

        $content = json_encode($newCarouselContent);

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':popup_widget_id', $popup_widget_id);
        $stmt->bindParam(':marker_id', $marker_id);
        $stmt->bindParam(':new_content', $content);

        if ($stmt->execute()) {
            $content  = json_decode($content);

            foreach ($content as $i => $i_value) {

                if ($i_value->slide_type == "image") {
                    $i_value->src = $this->baseUrl . $i_value->src;
                }
            }

            $content  = json_encode($content);

            return   $content;
        } else {
            throw new Exception("Some database error! Try again");
        }
    }

    // delete a slide in carousel
    function deleteSlideInCarousel($data)
    {
        $sql = "SELECT *  FROM " .  $this->table_name  . " WHERE id = :popup_widget_id AND Markers_id = :marker_id";
        $stmt = $this->conn->prepare($sql);

        $popup_widget_id = intval($data->popup_widget_id);
        $marker_id = intval($data->marker_id);
        $slide_id = intval($data->slide_id);

        $stmt->bindParam(':popup_widget_id', $popup_widget_id);
        $stmt->bindParam(':marker_id', $marker_id);
        $stmt->execute();

        $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
        $content  = json_decode($results[0]['content']);

        $newCarouselContent = [];

        foreach ($content as $i => $i_value) {
            $thisSlideId = intval($i_value->id);
            if ($thisSlideId !== $slide_id) {
                array_push(
                    $newCarouselContent,
                    (object)[
                        'id' =>  (string)$i_value->id,
                        'slide_type' =>  $i_value->slide_type,
                        'src' =>  $i_value->src,
                        'order_no' =>  $i_value->order_no,
                        'caption' =>  $i_value->caption
                    ]
                );
            }
        }

        $query = "UPDATE " . $this->table_name . "
        SET
        content = :new_content
         WHERE id = :popup_widget_id AND Markers_id = :marker_id";

        $content = json_encode($newCarouselContent);

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':popup_widget_id', $popup_widget_id);
        $stmt->bindParam(':marker_id', $marker_id);
        $stmt->bindParam(':new_content', $content);

        if ($stmt->execute()) {
            $content  = json_decode($content);

            foreach ($content as $i => $i_value) {

                if ($i_value->slide_type == "image") {
                    $i_value->src = $this->baseUrl . $i_value->src;
                }
            }

            $content  = json_encode($content);

            return   $content;
        } else {
            throw new Exception("Some database error! Try again");
        }
    }

    // update image src in carousel
    function updateSlideInCarousel($data)
    {
        $target_dir = "../popup_images/";
        $filename = "";

        // Check if image src changed, else jus caption changed
        if ($data["slide_type"] === "image") {
            if ($data["image_src_changed"] === "true") {
                // // $data['image_url'] checks if user sent a image URL
                if ($data['image_url'] === "true") {
                    // echo "Get image from url" . $data["image"];
                    // var_dump(intval($data['image_url']));
                    $imageUrl = $data["image"];
                    $target_file =  str_replace(' ', '', time() . rand(11, 99) . 'popup_image' . uniqid());
                    $filename = pathinfo($target_file, PATHINFO_FILENAME);
                    $size = getimagesize($imageUrl);
                    $extension = image_type_to_extension($size[2]);

                    $filename = $filename . $extension;
                    @$rawImage = file_get_contents($imageUrl);

                    if ($rawImage) {
                        file_put_contents($target_dir . $filename, $rawImage);
                        // echo 'Image Saved';
                    } else {
                        echo 'Error Occured';
                    }
                } else {
                    // $data['image_url'] == false, since user uploaded a image
                    // echo "Image uploaded";
                    if (empty($_FILES['image']['tmp_name']) || !isset($_FILES['image']['tmp_name'])) {
                        throw new Exception("No image");
                    }

                    // echo "Image";
                    $target_file =  str_replace(' ', '', time() . rand(11, 99) . basename($_FILES["image"]["name"]));
                    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
                    $filename = pathinfo($target_file, PATHINFO_FILENAME) . '.' . $imageFileType;

                    $image = new Imagick($_FILES['image']['tmp_name']);
                    // $image->setImageFormat('jpeg');
                    // $image->setImageCompression(Imagick::COMPRESSION_JPEG);
                    // $image->setImageCompressionQuality(100);
                    $image->writeImages($target_dir . $filename, true);
                    $image->clear();
                }
            }
        }
        // if ($data["src_type"] === "video") {
        // }

        $sql = "SELECT *  FROM " .  $this->table_name  . " WHERE id = :popup_widget_id AND Markers_id = :marker_id";
        $stmt = $this->conn->prepare($sql);

        $popup_widget_id = intval($data["popup_widget_id"]);
        $marker_id = intval($data["marker_id"]);
        $slide_id = intval($data["slide_id"]);
        $slide_caption = $data["slide_caption"];

        $stmt->bindParam(':popup_widget_id', $popup_widget_id);
        $stmt->bindParam(':marker_id', $marker_id);
        $stmt->execute();

        $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);

        $content  = json_decode($results[0]['content']);

        $newCarouselContent = [];

        foreach ($content as $i => $i_value) {
            $thisSlideId = intval($i_value->id);
            if ($thisSlideId !== $slide_id) {
                array_push(
                    $newCarouselContent,
                    (object)[
                        'id' =>  (string)$i_value->id,
                        'slide_type' =>  $i_value->slide_type,
                        'src' =>  $i_value->src,
                        'order_no' =>  $i_value->order_no,
                        'caption' =>  $i_value->caption
                    ]
                );
            } else {
                if ($data["slide_type"] === "image") {
                    if ($data["image_src_changed"] === "true") {
                        array_push(
                            $newCarouselContent,
                            (object)[
                                'id' =>  (string)$i_value->id,
                                'slide_type' =>  $i_value->slide_type,
                                'src' =>  $filename,
                                'order_no' =>  $i_value->order_no,
                                'caption' =>  $slide_caption
                            ]
                        );
                    } else {
                        array_push(
                            $newCarouselContent,
                            (object)[
                                'id' =>  (string)$i_value->id,
                                'slide_type' =>  $i_value->slide_type,
                                'src' =>  $i_value->src,
                                'order_no' =>  $i_value->order_no,
                                'caption' =>  $slide_caption
                            ]
                        );
                    }
                }
                if ($data["slide_type"] === "video") {
                    if ($data["video_src_changed"] === "true") {
                        array_push(
                            $newCarouselContent,
                            (object)[
                                'id' =>  (string)$i_value->id,
                                'slide_type' =>  $i_value->slide_type,
                                'src' => $data["video_src"],
                                'order_no' =>  $i_value->order_no,
                                'caption' =>  $slide_caption
                            ]
                        );
                    } else {
                        array_push(
                            $newCarouselContent,
                            (object)[
                                'id' =>  (string)$i_value->id,
                                'slide_type' =>  $i_value->slide_type,
                                'src' =>  $i_value->src,
                                'order_no' =>  $i_value->order_no,
                                'caption' =>  $slide_caption
                            ]
                        );
                    }
                }
            }
        }

        $query = "UPDATE " . $this->table_name . "
        SET
        content = :new_content
         WHERE id = :popup_widget_id AND Markers_id = :marker_id";

        $stmt = $this->conn->prepare($query);

        // $popup_widget_id = intval($data["popup_widget_id"]);
        $content = json_encode($newCarouselContent);

        // // $newImage = $data['image'];
        $stmt->bindParam(':new_content', $content);
        $stmt->bindParam(':popup_widget_id', $popup_widget_id);
        $stmt->bindParam(':marker_id', $marker_id);

        if ($stmt->execute()) {
            $success = true;
            $image =   $this->popup_image_base_url . $filename;
            $newCarouselContent = [];

            $content  = json_decode($content);

            foreach ($content as $i => $i_value) {
                $thisSlideId = intval($i_value->id);
                if ($i_value->slide_type == "image") {
                    array_push(
                        $newCarouselContent,
                        (object)[
                            'id' =>  (string)$i_value->id,
                            'slide_type' =>  $i_value->slide_type,
                            'src' =>  $this->popup_image_base_url . $i_value->src,
                            'order_no' =>  $i_value->order_no,
                            'caption' =>  $i_value->caption
                        ]
                    );
                } else {
                    array_push(
                        $newCarouselContent,
                        (object)[
                            'id' =>  (string)$i_value->id,
                            'slide_type' =>  $i_value->slide_type,
                            'src' =>    $i_value->src,
                            'order_no' =>  $i_value->order_no,
                            'caption' =>  $i_value->caption
                        ]
                    );
                }
            }

            return  json_encode($newCarouselContent);
        } else {
            // print_r($stmt->errorInfo());
            $success = false;
            throw new Exception("Some database error! Try again");
        }
    }

    // Update Carousel slide order [ only used to save carousel slide order ]
    function updateSlideOrderInCarousel($data)
    {

        $sql = "SELECT *  FROM " .  $this->table_name  . " WHERE id = :popup_widget_id";
        $stmt = $this->conn->prepare($sql);

        $popup_widget_id = intval($data->popup_widget_id);
        $marker_id = intval($data->marker_id);
        $new_content = json_decode($data->content);

        $stmt->bindParam(':popup_widget_id', $popup_widget_id);
        // $stmt->bindParam(':marker_id', $marker_id);
        $stmt->execute();

        $results =  $stmt->fetchAll(PDO::FETCH_ASSOC);
        $fetched_content  = json_decode($results[0]['content']);
        $newCarouselContent = [];
        $newCarouselContentForReact = [];
        foreach ($fetched_content as $i => $fetched_content_value) {

            foreach ($new_content as $j => $new_content_value) {

                $fetched_content_id = intval($fetched_content_value->id);
                $new_content_id = intval($new_content_value->id);

                if ($new_content_id == $fetched_content_id) {
                    array_push(
                        $newCarouselContent,
                        (object)[
                            'id' =>  (string)$fetched_content_id,
                            'slide_type' =>  $new_content_value->slide_type,
                            'src' =>  $fetched_content_value->src,
                            'order_no' =>  $new_content_value->order_no,
                            'caption' =>  $fetched_content_value->caption
                        ]
                    );
                }

                if ($new_content_id == $fetched_content_id) {
                    array_push(
                        $newCarouselContentForReact,
                        (object)[
                            'id' =>  (string)$fetched_content_id,
                            'slide_type' =>  $new_content_value->slide_type,
                            'src' =>  $new_content_value->src,
                            'order_no' =>  $new_content_value->order_no,
                            'caption' =>  $fetched_content_value->caption
                        ]
                    );
                }
            }
        }


        $newCarouselContent = json_encode($newCarouselContent);
        $newCarouselContentForReact = json_encode($newCarouselContentForReact);

        $query = "UPDATE " . $this->table_name . "
        SET
        content = :new_content
         WHERE id = :popup_widget_id";

        $stmt = $this->conn->prepare($query);
        $popup_widget_id = intval($data->popup_widget_id);
        $stmt->bindParam(':new_content', $newCarouselContent);
        $stmt->bindParam(':popup_widget_id', $popup_widget_id);

        if ($stmt->execute()) {
            $success = true;
            // $image =  $this->popup_image_base_url . $filename;
            return   $newCarouselContentForReact;
            http_response_code(200);
        } else {
            // print_r($stmt->errorInfo());
            $success = false;
            throw new Exception("Some database error! Try again");
        }
    }
}
