
$(document).ready(() => {
  cargarTareas();

  $("#form-tarea").submit(e => {
    e.preventDefault();
    const tarea = $("#tarea").val();
    $.post("index.php", { tarea: tarea }, function () {
      cargarTareas();
      $("#tarea").val("");
    });
  });

  function cargarTareas() {
    $.get("index.php", function (data) {
      const aux = JSON.stringify(data);
      const tareas = JSON.parse(aux);
      const tareasPendientes = tareas.filter(
        (tarea) => tarea.completada == 0
      );
      const tareasCompletadas = tareas.filter(
        (tarea) => tarea.completada == 1
      );

      actualizarListaTareas(tareasPendientes, "#tareas-pendientes");
      actualizarListaTareas(tareasCompletadas, "#tareas-completadas");
    });
  }

  function actualizarListaTareas(tareas, listaId) {
    $(listaId).empty();
    tareas.forEach((tarea) => {
      $(listaId).append(`
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                      ${tarea.tarea}
                      <span>
                          <button class="btn btn-sm btn-primary editar-tarea" data-id="${tarea.id}">
                              Modificar
                          </button>
                          <button class="btn btn-sm btn-danger eliminar-tarea" data-id="${tarea.id}">
                              Eliminar
                          </button>
                      </span>
                  </li>
              `);
    });

    $(".editar-tarea").click(function () {
      const id = $(this).data("id");
      const tarea = tareas.find((t) => parseInt(t.id) === id);
      abrirModalEditarTarea(tarea);
    });

    $(".eliminar-tarea").click(function () {
      const id = $(this).data("id");
      abrirModalEliminarTarea(id);
    });
  }

  function abrirModalEditarTarea(tarea) {
    $("#edit_id").val(tarea.id);
    $("#edit_tarea").val(tarea.tarea);
    $("#edit_completada").prop(
      "checked",
      tarea.completada == 1 ? true : false
    );
    $("#editarTareaModal").modal("show");
  }

  function abrirModalEliminarTarea(id) {
    $("#eliminar-tarea-confirmar").data("id", id);
    $("#eliminarTareaModal").modal("show");
  }

  $("#form-editar-tarea").submit(function (e) {
    e.preventDefault();
    const id = $("#edit_id").val();
    const tarea = $("#edit_tarea").val();
    const completada = $("#edit_completada").is(":checked") ? 1 : 0;
    $.post(
      "index.php",
      {
        update_id: id,
        update_tarea: tarea,
        update_completada: completada,
      },
      function () {
        cargarTareas();
        $("#editarTareaModal").modal("hide");
      }
    );
  });

  $("#eliminar-tarea-confirmar").click(function () {
    const id = $(this).data("id");
    $.post("index.php", { delete_id: id }, function () {
      cargarTareas();
      $("#eliminarTareaModal").modal("hide");
    });
  });
});
