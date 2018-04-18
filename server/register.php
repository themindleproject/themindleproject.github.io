<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!isset($_POST)) die();

$response = [];

$con = mysqli_connect('localhost', 'root', '', 'tmd');

$fullname = mysqli_real_escape_string($con, $_POST['fullname']);
$username = mysqli_real_escape_string($con, $_POST['username']);
$email = mysqli_real_escape_string($con, $_POST['email']);
$password = mysqli_real_escape_string($con, $_POST['password']);

$hashed_password = password_hash($password, PASSWORD_DEFAULT);


$query = "INSERT INTO `tblusers` (`email`, `fullnames`, `username`, `password`) VALUES ('$email','$fullname','$username','$hashed_password')";

if(mysqli_query($con, $query)) {
    $response['status'] = 'registered';
    $response['user'] = $username;
    $response['id'] = md5(uniqid());
    $_SESSION['id'] = $response['id'];
    $_SESSION['user'] = $username;
} else {
    $response['status'] = 'error';
}

echo json_encode($response);

?>