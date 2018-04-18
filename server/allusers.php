<?php 

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!isset($_POST)) die();

$response = [];

$con = mysqli_connect('localhost', 'root', '', 'tmd');

$username = mysqli_real_escape_string($con, $_POST['username']);

$query = "SELECT * FROM tblusers WHERE username='$username'";

$result = mysqli_query($con, $query);

if(mysqli_num_rows($result) > 0) {
    $response['status'] = 'userfound';
} else if(mysqli_num_rows($result) == 0) {
    $response['status'] = 'usernotfound';
}

echo json_encode($response);

?>