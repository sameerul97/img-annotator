<?php
require_once('../config/app_url.php');

$image_id = $_GET["id"];

$App = new App_Url();

$iframed_page_js = $App->getAppIframeResizerBaseUrl() . 'iframeresize.js';
$iframed_init_js = $App->getAppIframeResizerBaseUrl() . 'iframeinit.js';
$iframe_src = $App->getEmbedBaseUrl(). $image_id;
?>
document.write('<scri'+'pt type="text/javascript" src="https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v5/embed/iframeresize.js"></scr'+'ipt>');document.write('<iframe src="<?php echo $iframe_src; ?>" frameborder="0" scrolling="no" width="100%" height="250" id="img_annotator_iframe_<?php echo $_GET["id"]; ?>" class="img_annotator_iframe"  allowTransparency="true"></iframe>');
    document.write('<scri'+'pt type="text/javascript" src="https://creative.bauermedia.co.uk/scrollmagic/img-annotator-v5/embed/iframeinit.js"></scr'+'ipt>');