<?php

class App_Url
{
    private $baseUrl;

    public function getAppUrl()
    {

        if (isset($_ENV['APP_ENV'])) {
            if ($_ENV['APP_ENV'] === 'production') {
                $this->baseUrl = "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v4/api/user_images/";
            }
        } else {
            $this->baseUrl = "http://localhost/api/user_images/";
        }

        return $this->baseUrl;
    }

    public function getPopupImageBaseUrl()
    {

        if (isset($_ENV['APP_ENV'])) {
            if ($_ENV['APP_ENV'] === 'production') {
                $this->baseUrl = "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v4/api/popup_images/";
            }
        } else {
            $this->baseUrl = "http://localhost/api/popup_images/";
        }

        return $this->baseUrl;
    }
}
