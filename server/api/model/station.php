<?php

require_once('../config/database.php');

class Station
{
    private $conn;
    private $table_name = "Stations";

    public function __construct()
    {
        $database = new Database();
        $db = $database->getConnection();
        $this->conn = $db;
    }

    function get()
    {
        $sql = "SELECT *  FROM " . $this->table_name;
        $stmt = $this->conn->prepare($sql);

        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $myArray = [];

        foreach ($results as $row) {
            array_push($myArray, (object)[
                'id' => $row['id'],
                'name' => $row['name'],
                'value' => $row['name'],
                'label' => $row['name'],
            ]);
        }

        return json_encode($myArray);
    }

    function create($data)
    {
        $query = "INSERT INTO " . $this->table_name . "
        SET
            name = :name";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':name', $data->name);

        if ($stmt->execute()) {
            return true;
        } else {
            print_r($stmt->errorInfo());
            throw new Exception("error database");
        }
    }

    function update($data)
    {
    }

    function delete($data)
    {
    }
}
