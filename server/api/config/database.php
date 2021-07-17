<?php
// used to get mysql database connection
class Database
{
    private $host = "localhost";
    private $db_name = "Img-annotator";
    private $username = "root";
    private $password = "root";

    public $conn;

    public function getConnection()
    {
        $production = getenv("APP_ENV") ? true : false;

        $this->username = getenv("MYSQL_USERNAME") ? getenv("MYSQL_USERNAME") : "root";
        $this->password = getenv("MYSQL_PASSWORD") ? getenv("MYSQL_PASSWORD") : "example";
        $this->host = getenv("MYSQL_HOST") ? getenv("MYSQL_HOST") : "localhost";
        $this->db_name = getenv("MYSQL_DBNAME") ? getenv("MYSQL_DBNAME") : "Img-annotator";
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING));
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
 
