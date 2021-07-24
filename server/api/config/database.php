<?php
class DB
{

    protected static $instance;

    protected function __construct()
    {
    }

    public static function getInstance()
    {

        if (empty(self::$instance)) {
            $username = getenv("MYSQL_USERNAME") ? getenv("MYSQL_USERNAME") : "root";
            $password = getenv("MYSQL_PASSWORD") ? getenv("MYSQL_PASSWORD") : "example";
            $host = getenv("MYSQL_HOST") ? getenv("MYSQL_HOST") : "localhost";
            $db_name = getenv("MYSQL_DBNAME") ? getenv("MYSQL_DBNAME") : "Img-annotator";

            try {
                self::$instance = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING));
            } catch (PDOException $exception) {
                echo "Connection error: " . $exception->getMessage();
            }
        }

        return self::$instance;
    }
}
