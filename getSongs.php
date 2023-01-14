<?php
    $dir  = './music';
    $files = scandir($dir);
    $music_files = preg_grep('/\.mp3$/', $files);
    $music = [];
    foreach ($music_files as $path) {
        array_push($music, explode('.',$path)[0]);
    }
        
    echo json_encode($music);
?>