<?php

class App_Url
{
    private $baseUrl;

    public function getAppUrl()
    {

        if (isset($_ENV['APP_ENV'])) {
            if ($_ENV['APP_ENV'] === 'production') {
                $this->baseUrl = "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v5/api/user_images/";
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
                $this->baseUrl = "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v5/api/popup_images/";
            }
        } else {
            $this->baseUrl = "http://localhost/api/popup_images/";
        }

        return $this->baseUrl;
    }

    public function getAppIframeResizerBaseUrl()
    {
        $this->baseUrl = "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v5/embed/";

        return $this->baseUrl;
    }

    public function getEmbedBaseUrl()
    {

        if (isset($_ENV['APP_ENV'])) {
            if ($_ENV['APP_ENV'] === 'production') {
                $this->baseUrl = "https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v5/#/embed/";
            }
        } else {
            $this->baseUrl = "http://localhost:3000/#/embed/";
        }

        return $this->baseUrl;
    }
}
