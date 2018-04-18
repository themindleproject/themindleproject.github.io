<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!isset($_POST)) die();

session_start();

$response = [];

$con = mysqli_connect('localhost', 'root', '', 'tmd');

$loginemail = mysqli_real_escape_string($con, $_POST['email']);
$loginpassword = mysqli_real_escape_string($con, $_POST['password']);

// $query = "SELECT * FROM tblusers WHERE email='$loginemail' AND password='$loginpassword'";

$query = "SELECT * FROM tblusers WHERE email='$loginemail'";

$result = mysqli_query($con, $query);

if(mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_array($result)) {

        $currentUsr = $row['username'];
        $hashed_password = $row['password'];

        if(password_verify($loginpassword, $hashed_password)) {

            $response['status'] = 'loggedin';
            $response['user'] = $currentUsr;
            $response['id'] = md5(uniqid());
            $_SESSION['id'] = $response['id'];
            $_SESSION['user'] = $currentUsr;

        } else {
            $response['status'] = 'pwdincorrect';
        }
    }  
} else {
    $response['status'] = 'error';
}

echo json_encode($response);

?>