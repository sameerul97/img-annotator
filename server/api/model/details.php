<?php
require("../config/app_url.php");
require_once('../config/database.php');
require_once('../libs/php_image_magician.php');
require_once('../functions/insert_default_data.php');
ini_set('display_errors', true);
ini_set('display_errors', 'On');
ini_set('html_errors', 0);

error_reporting(-1);

class Details
{
    private $conn;
    private $table_name = "Images";
    private $baseUrl;

    public function __construct()
    {
        $db = DB::getInstance();
        $this->conn = $db;
    }

    function update($data)
    {
        $query = "UPDATE " . $this->table_name . "
        SET
            page_header = :page_header,
            page_copy = :page_copy,
            last_modified = :last_modified
        WHERE id = :image_id";

        $stmt = $this->conn->prepare($query);
        $date = date("Y-m-d H:i:s");

        $stmt->bindParam(':page_header', $data->header);
        $stmt->bindParam(':page_copy', $data->copy);
        $stmt->bindParam(':image_id', $data->image_id);
        $stmt->bindParam(':last_modified', $date);

        if ($stmt->execute()) {
            return true;
        } else {
            print_r($stmt->errorInfo());
            throw new Exception("error database");
        }
    }
}
