<?php

$data = substr($_POST['imageData'], strpos($_POST['imageData'], ",") + 1);
$decodedData = base64_decode($data);
$fp = fopen("sprites/".$_POST['folder']."/".$_POST['fileName'].".png", 'wb');
fwrite($fp, $decodedData);
fclose();

?>
