<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "sisma";

$conexion = new mysqli($host, $user, $pass, $db);

if ($conexion->connect_error) {
  die("Error de conexión: " . $conexion->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['tarea'])) {
  $tarea = $_POST['tarea'];
  $completada = false;

  $stmt = $conexion->prepare("INSERT INTO tasks (tarea, completada) VALUES (?, ?)");
  $stmt->bind_param("si", $tarea, $completada);
  $stmt->execute();
  $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_id'])) {
  $update_id = $_POST['update_id'];
  $tarea = $_POST['update_tarea'];
  $completada = $_POST['update_completada'];

  $stmt = $conexion->prepare("UPDATE tasks SET tarea = ?, completada = ? WHERE id = ?");
  $stmt->bind_param("sii", $tarea, $completada, $update_id);
  $stmt->execute();
  $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {
  $delete_id = $_POST['delete_id'];

  $stmt = $conexion->prepare("DELETE FROM tasks WHERE id = ?");
  $stmt->bind_param("i", $delete_id);
  $stmt->execute();
  $stmt->close();
}

$result = $conexion->query("SELECT * FROM tasks");
$tareas = $result->fetch_all(MYSQLI_ASSOC);

header('Content-Type: application/json');
echo json_encode($tareas);

$conexion->close();
?>