<?php
// used to get mysql database connection
class Database
{

    // specify your own database credentials
    // private $host = "db";
    private $host = "localhost";
    private $db_name = "Img-annotator";
    private $username = "root";
    // private $password = "example";
    private $password = "root";
    public $conn;

    // get the database connection
    public function getConnection()
    {
        $production = getenv("APP_ENV") ? true : false;

        $this->conn = null;

        try {
            if ($production) {
                // Replace with production credentials
                $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING));
            } else {
                $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING));

                // $this->conn = new PDO('mysql:host=localhost;dbname=Talent_Platform', 'root', 'root');
            }
            // $this->conn = new mysqli("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            // $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
