<?php

    // Attempt to force the browser to not cache
    header("Cache-Control: no-cache, no-store, must-revalidate");

    $error = '';

    // Check the file was uploaded successfully (using $_FILES superglobal)
    if (!$_FILES["file"]["error"] == UPLOAD_ERR_OK) {
        // File upload failed
        $error = 'File Upload Failed';
        echo $error;
    }

    // Get the temp location 
    $tmp_file = $_FILES["file"]["tmp_name"];
    // Check to make sure this is an mp3 (mp3's only)
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $_FILES["file"]["tmp_name"]);

    if(!in_array($mime, array("audio/mpeg"))) {
        // File is not an mp3
        $error = 'File is not an mp3';
        echo $error;
    } else {
        // Move to permanent location
        $target_file = "./music/".basename($_FILES["file"]["name"]);
        move_uploaded_file($tmp_file, $target_file);
    }

?>