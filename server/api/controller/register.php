<?php

// include_once $_SERVER['DOCUMENT_ROOT'] .  '/api/config/database.php';
// include_once $_SERVER['DOCUMENT_ROOT'] .  '/api/model/user.php';
// include_once '../functions/jwt.php';

// include_once $_SERVER['DOCUMENT_ROOT'] . '/api/functions/jwt.php';
require_once('../config/database.php');
require_once('../model/user.php');
require_once('../functions/jwt.php');

class RegisterController extends User
{
    private $RegistrationValidationError = "Email, Username and password required";
    private $EmailAlreadyTakenError = "Email taken";
    private $UnableToCreateUserError = "Unable to create user.";


    public function __construct($data)
    {
        if (!isset($data->email) || empty($data->email) || !isset($data->password) || empty($data->password) || !isset($data->username) || empty($data->username)) {
            throw new Exception($this->RegistrationValidationError);
        } else {
            $this->username = $data->username;
            $this->email = $data->email;
            $this->password = $data->password;
            $database = new Database();
            $db = $database->getConnection();
            parent::__construct($db);
        }
    }

    public function register()
    {
        if ($this->emailExists()) {
            http_response_code(400);
            throw new Exception($this->EmailAlreadyTakenError);
        }

        if (
            $this->create()
        ) {
            http_response_code(200);
            return json_encode(array("message" => "User was created."));
        } else {
            http_response_code(400);
            throw new Exception($this->UnableToCreateUserError);
        }
    }
}
