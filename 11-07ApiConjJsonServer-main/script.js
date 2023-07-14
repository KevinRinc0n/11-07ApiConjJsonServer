const url = "http://localhost:3000/productos";
let productos = [];

window.addEventListener("DOMContentLoaded", () => {
    getProductos();
});

const getProductos = () => {
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(data => {
        productos = data;
        console.log(productos);
        renderProductos(productos);
    })
    .catch(error => {
        alertManager("error", "Ha ocurrido un problema");
    });
};

const contenedorProductos = document.getElementById('contenedor');

const renderProductos = (productos) => {
    let listar = "";
    productos.forEach(producto => {
        listar += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>${producto.categoriaId}</td>
                <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalEditar" onclick="editarProducto(${producto.id})">EDITAR</button></td>
                <td><button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">ELIMINAR</button></td>
            </tr>`;
    });
    contenedorProductos.innerHTML = listar;
};

const crearProducto = () => {
    const inputNombre = document.getElementById('inputNombre').value;
    const inputDescripcion = document.getElementById('inputDescripcion').value;
    const inputPrecio = document.getElementById('inputPrecio').value;
    const selectCategoria = document.getElementById('selector').value;

    if (!inputNombre || !inputDescripcion || !inputPrecio || !selectCategoria) {
        document.getElementById('llenarTodo').innerHTML = "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodo").innerHTML = "";

    const producto = {
        nombre: inputNombre,
        precio: inputPrecio,
        descripcion: inputDescripcion,
        categoriaId: parseInt(selectCategoria)
    };
    console.log(producto);

    fetch(url, {
        method: "POST",
        body: JSON.stringify(producto),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(respuesta => respuesta.json())
    .then(respuesta => {
        alertManager("success", respuesta.mensaje);
        getProductos();
    })
    .catch(error => {
        alertManager("error", error);
        document.getElementById("crear").reset();
    });
};

const editarProducto = (id) => {
    let producto = productos.find(product => product.id == id);

    document.getElementById("editarNombre").value = producto.nombre;
    document.getElementById("editarDescripcion").value = producto.descripcion;
    document.getElementById("editarPrecio").value = producto.precio;
    document.getElementById("editarSelector").value = producto.categoria;

    document.getElementById("modalEditar").setAttribute("data-id", id);
};

const subirProducto = () => {
    const editarNombre = document.getElementById("editarNombre").value;
    const editarDescripcion = document.getElementById("editarDescripcion").value;
    const editarPrecio = document.getElementById("editarPrecio").value;
    const editarCategoria = document.getElementById("editarSelector").value;

    if (!editarNombre || !editarDescripcion || !editarPrecio || !editarCategoria) {
        document.getElementById('llenarTodoEditar').innerHTML = "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodoEditar").innerHTML = "";

    const id = document.getElementById("modalEditar").getAttribute("data-id"); 

    const producto = {
        nombre: editarNombre,
        precio: editarPrecio,
        descripcion: editarDescripcion,
        categoriaId: parseInt(editarCategoria),
        id: id
    };

    fetch(`${url}/${id}`, {
        method: "PUT",
        body: JSON.stringify(producto),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(respuesta => respuesta.json())
    .then(respuesta => {
        alertManager("success", respuesta.mensaje);
        getProductos();
    })
    .catch(error => {
        alertManager("error", error);
    });

    document.getElementById("modalEditar").reset();
};

const eliminarProducto = (id) => {
    fetch(`${url}/${id}`, {
        method: "DELETE"
    })
    .then(respuesta => respuesta.json())
    .then(respuesta => {
        alertManager("success", respuesta.mensaje);
        getProductos();
    })
    .catch(error => {
        alertManager("error", error);
    });
};

const alertManager = (tipoMensaje, mensaje) => {
    const alerta = document.getElementById("alerta");

    alerta.innerHTML = mensaje || "SE HICIERON CAMBIOS";
    alerta.classList.add(tipoMensaje);
    alerta.style.display = "block";

    setTimeout(() => {
        alerta.style.display = "none";
        alerta.classList.remove(tipoMensaje);
    }, 3500);
};