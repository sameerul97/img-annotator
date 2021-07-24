<?php

// include_once $_SERVER['DOCUMENT_ROOT'] .  '/api/config/database.php';
// include_once $_SERVER['DOCUMENT_ROOT'] .  '/api/model/user.php';
// include_once $_SERVER['DOCUMENT_ROOT'] . '/api/functions/jwt.php';

// include_once('../../config/database.php');
require_once('../model/user.php');
require_once('../config/database.php');
require_once('../functions/jwt.php');
// include_once('../../functions/jwt.php');

include_once '../libs/vlucas_valitron/Valitron/Validator.php';

use Valitron\Validator as V;

V::langDir('../libs/vlucas_valitron/lang');
V::lang('en');


class LoginController extends User
{
    private $userNotFoundError = "User not found";
    private $wrongCredential = "wrong credentials";
    private $key = '5f2b5cdbe5194f10b3241568fe4e2b24';

    // private $email;
    private $u_password;

    public function __construct($data)
    {
        $v = new Valitron\Validator((array) $data);
        $v->rule('required', ['email', 'password']);
        $v->rule('email', 'email');
        // $v->rule('lengthBetween', 'password', 3, 12);

        if ($v->validate()) {
            $this->email = $data->email;
            $this->password = $data->password;
            $this->u_password = $data->password;
            $db = DB::getInstance();
            parent::__construct($db);
        } else {
            throw new Exception(serialize($v->errors()));
        }
    }

    public function login()
    {
        $email_exists = $this->emailExists();

        if (!$email_exists) {
            http_response_code(400);
            throw new Exception($this->userNotFoundError);
        }

        if ($email_exists && password_verify($this->u_password, $this->password)) {
            // User found and password matched
            $issued_at = time();

            if (isset($_ENV['APP_ENV'])) {
                if ($_ENV['APP_ENV'] === 'production') {
                    $expiration_time = strtotime("+60 minutes");
                }
            } else {
                $expiration_time = strtotime("+1 week");
                // $expiration_time = strtotime("+10 second");
            }
            // if ($_ENV['ENVIRONMENT'] == 'local') {
            //     // $expiration_time = $issued_at + (60 * 60); // valid for 1 hour
            //     $expiration_time = strtotime("+1 week");
            // } else {
            //     $expiration_time = strtotime("+60 minutes");
            // }

            $issuer = "API";
            $payload = array(
                "iat" => $issued_at,
                "exp" => $expiration_time,
                "iss" => $issuer,
                "data" => array(
                    "id" => $this->id,
                    // "firstname" => $user->firstname,
                    // "lastname" => $user->lastname,
                    // "email" => $user->email
                )
            );

            $jwt = generateToken($payload, $this->key);

            http_response_code(200);
            return json_encode(
                array(
                    "error" => false,
                    "message" => "Successful login.",
                    "jwt" => $jwt
                )
            );
        } else {
            http_response_code(400);
            throw new Exception($this->wrongCredential);
        }
    }
}
