<?php
require("../config/app_url.php");
require_once('../config/database.php');
require_once('../libs/php_image_magician.php');
require_once('../functions/insert_default_data.php');
ini_set('display_errors', true);
ini_set('display_errors', 'On');
ini_set('html_errors', 0);

error_reporting(-1);

class Image
{
    private $conn;
    private $table_name = "Images";
    private $baseUrl;

    public function __construct()
    {
        $appUrl = new App_Url();
        $db = DB::getInstance();
        $this->conn = $db;
        $this->baseUrl = $appUrl->getAppUrl();

        $this->popup_image_base_url = $appUrl->getPopupImageBaseUrl();
    }

    function getImage($imageId)
    {
        // $query = "SELECT *  FROM  " . $this->table_name . " WHERE id = :image_id";
        $query = "SELECT Images.id AS Image_Id,
                    Images.url,
                    Images.page_header,
                    Images.page_copy,
                    Images.page_script,
                    Images.name,
                    Images.time,
                    Images.Stations_id,
                    Images.Users_id,
                    Images.last_modified, 
                    Markers.id AS Marker_id,
                    Markers.markerTop,
                    Markers.markerLeft,
                    Markers.color,
                    Markers.animation_type,
                    Markers.marker_type,
                    Markers.marker_image,
                    Markers.background_color,
                    Markers.border_radius,
                    Popup_Contents.id AS Popup_Contents_id,
                    Popup_Contents.widget_type_id,
                    Popup_Contents.content,
                    Popup_Contents.Markers_id,
                    Popup_Contents.order_no
                    FROM " . $this->table_name . " 
                        JOIN `Markers` ON Images.id = Markers.Images_id 
                        JOIN `Popup_Contents` ON Popup_Contents.Markers_id = Markers.id 
                        WHERE Images.id = :image_id;";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':image_id', $imageId);

        if ($stmt->execute()) {

            if ($stmt->rowCount() > 0) {
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Update first image url
                $results[0]['url'] = $this->baseUrl . $results[0]['url'];
                $myArray = [];

                foreach ($results as $row => $data) {
                    // array_push($myArray, (object)[
                    //     'id' => $row['id'],
                    //     'url' => $this->baseUrl . $row['url'],
                    //     'name' => $row['name']
                    if ($data['widget_type_id'] === 'widget_id_2') {
                        $results[$row]['content'] = $this->popup_image_base_url . $data['content'];
                    }

                    if ($data['widget_type_id'] === 'widget_id_7') {
                        $content  = json_decode($results[$row]['content']);

                        foreach ($content as $i => $i_value) {
                            if ($i_value->slide_type == "image") {
                                $i_value->src = $this->popup_image_base_url . $i_value->src;
                            }
                            $i_value->src =   $i_value->src;
                        }

                        $content = json_encode($content);
                        $results[$row]['content'] = $content;
                    }

                    // ]);
                    // var_dump(get_object_vars((object)$row));
                }

                return json_encode($results);
            } else {
                http_response_code(404);
                throw new Exception("Image Not found");
            }
        } else {
            http_response_code(401);
            print_r($stmt->errorInfo());
            throw new Exception("error database");
        }
    }

    function getImagesBySearch($data)
    {
        $page_no = intval($data['page_no']);

        $images_per_page = 5;
        $offset = ($page_no * $images_per_page) - $images_per_page;

        $sql = "SELECT COUNT(*) FROM " . $this->table_name;
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $number_of_rows = $stmt->fetchColumn();

        $images = [];
        $images["total_pages"] =  ceil($number_of_rows / $images_per_page);
        $images["images"] = [];

        $sql = "SELECT *  FROM " . $this->table_name . " WHERE deleted = 0  LIMIT " . $images_per_page . " OFFSET " . $offset;
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($results as $row) {
            array_push($images["images"], (object)[
                'id' => $row['id'],
                'url' => $this->baseUrl . $row['url'],
                'name' => $row['name']
            ]);
        }

        echo json_encode($images);
    }

    function getImages($data)
    {
        $page_no = intval($data['page_no']);

        if ($page_no <= 0) {
            $page_no = 1;
        }

        $search_query = $data['image_name'];
        $search_query = str_replace(['"', "'"], "", $search_query);
        $search_query = strtolower($search_query);

        $single_quote = '"\'"';
        $empty_string = '""';

        $images_per_page = 5;
        $offset = ($page_no * $images_per_page) - $images_per_page;

        $sql = "SELECT COUNT(*) FROM " . $this->table_name . " WHERE deleted = 0  AND lower(REPLACE(search_name,  {$single_quote} ,  {$empty_string})) LIKE '%" . $search_query . "%'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $number_of_rows = $stmt->fetchColumn();

        $images = [];
        $total_pages = ceil($number_of_rows / $images_per_page);

        if ($number_of_rows > 0 && $total_pages <= 0) {
            $images["total_pages"] =  1;
        } else {
            $images["total_pages"] =  $total_pages;
        }

        $images["images"] = [];

        $sql = "SELECT *  FROM " . $this->table_name . " WHERE deleted = 0  AND lower(REPLACE(search_name,  {$single_quote} ,  {$empty_string})) LIKE '%" . $search_query . "%' LIMIT " . $images_per_page . " OFFSET " . $offset;

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();


        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($results as $row) {
            array_push($images["images"], (object)[
                'id' => $row['id'],
                'url' => $this->baseUrl . $row['url'],
                'name' => $row['name']
            ]);
        }

        echo json_encode($images);
    }

    function getAllImages()
    {
        $sql = "SELECT *  FROM " . $this->table_name . " WHERE deleted = 0 ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // $baseUrl = '';
        $myArray = [];

        // if (isset($_ENV['APP_ENV'])) {
        //     if ($_ENV['APP_ENV'] === 'production') {
        //         $baseUrl = "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v3/api/user_images/";
        //     }
        // } else {
        //     $baseUrl = "http://localhost:8888/Project_2021/image-annotator/server/api/user_images/";
        // }

        foreach ($results as $row) {
            array_push($myArray, (object)[
                'id' => $row['id'],
                'url' => $this->baseUrl . $row['url'],
                'name' => $row['name']
            ]);
        }

        return json_encode($myArray);
        // return json_encode($results);
    }

    function create($data)
    {
        $query = "INSERT INTO " . $this->table_name . "
        SET
            url = :url,
            name = :name,
            search_name = :search_name,
            time = :time,
            deleted = 0,
            Stations_id = :Stations_id,
            Users_id = :Users_id";

        // $this->conn->beginTransaction();

        $stmt = $this->conn->prepare($query);

        $Stations_id = intval($data['Stations_id']);
        $Users_id = intval($data['Users_id']);
        $date = date("Y-m-d H:i:s");
        $search_name = strtolower($data['name']);

        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':time', $date);
        $stmt->bindParam(':Stations_id', $Stations_id);
        $stmt->bindParam(':Users_id', $Users_id);
        $stmt->bindParam(':search_name', $search_name);

        $target_dir = "../user_images/";
        $target_file =  str_replace(' ', '', time() . rand(11, 99) . basename($_FILES["image"]["name"]));
        $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
        $filename = pathinfo($target_file, PATHINFO_FILENAME) . '.' . $imageFileType;

        $image = new Imagick($_FILES['image']['tmp_name']);
        // $image->setImageFormat('jpeg');
        // $image->setImageCompression(Imagick::COMPRESSION_JPEG);
        // $image->setImageCompressionQuality(100);
        $image->writeImages($target_dir . $filename, true);
        $image->clear();

        $stmt->bindParam(':url', $filename);

        if ($stmt->execute()) {

            $thisImageId = $this->conn->lastInsertId();;

            // Add in temporary markers and popup contents in DB
            $thisImageId = intval($thisImageId);

            return insertTemporaryMarkersInDatabase($thisImageId, $this->conn);
        } else {
            http_response_code(401);
            print_r($stmt->errorInfo());
            throw new Exception("error database");
        }
    }

    function update($data)
    {
        $query = "UPDATE " . $this->table_name . "
        SET
            url = :url,
            name = :name,
            last_modified = :last_modified
        WHERE id = :image_id";

        $stmt = $this->conn->prepare($query);
        $date = date("Y-m-d H:i:s");

        $stmt->bindParam(':url', $data->url);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':image_id', $data->image_id);
        $stmt->bindParam(':last_modified', $date);

        if ($stmt->execute()) {
            return true;
        } else {
            print_r($stmt->errorInfo());
            throw new Exception("error database");
        }
    }

    function delete($data)
    {
        $query = "UPDATE " . $this->table_name . "
        SET
            deleted = 1
        WHERE id = :image_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':image_id', $data->image_id);

        if ($stmt->execute()) {
            return true;
        } else {
            print_r($stmt->errorInfo());
            throw new Exception("error database");
        }
    }
}
