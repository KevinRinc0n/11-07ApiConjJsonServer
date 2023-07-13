const url = "http://localhost:3000/productos";
let productos = [];

window.addEventListener("DOMContentLoaded", () => {
    getProductos();
});

const getProductos = () =>{
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

const renderProductos = (productos) =>{
    let listar = "";
    productos.forEach(producto => {
        listar += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalEditar">EDITAR</button></td>
                <td><button class="btn btn-danger">ELIMINAR</button></td>
            </tr>`
    });
    contenedorProductos.innerHTML = listar;
};

const crearProducto = () => {
    const formulario = new Formulario(document.getElementById('crear'));
    if (!formulario.getElementById('inputNombre').lenght || formulario.getElementById('inputDescripcion').lenght || formulario.getElementById('inputPrecio').lenght){
        document.getElementById('llenarTodo').innerHTML = "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    };
    document.getElementById("llenarTodo").innerHTML = "";

    const producto = {
        nombre: formulario.getElementById("inputNombre"),
        precio: formulario.getElementById("inputPrecio"),
        descripcion: formulario.getElementById("inputDescripcion")
    };
    console.log(producto);

    fetch(url,{
        method: "POST",
        body: JSON.stringify(producto),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(respuesta => respuesta.json())
    .then(respuestaa => {
        alertManager("success", respuestaa,mensaje);
        getProdcuto();
    })
    .catch(error =>{
        alertManager("error", error);
        document.getElementById("contenedor").reset();
    });
};

const editarProducto = (id) =>{
    let producto = {};
    productos.filter(product => {
        if(product.Id == id){
            producto = product;
        };
    });

    document.getElementById("crear id").value = producto.id;
    document.getElementById("crear inputNombre").value = producto.nombre;
    document.getElementById("crear inputDescripcion").value = producto.descripcion;
    document.getElementById("crear inputPrecio").value = producto.precio;

    console.log(producto)
    modalEdit();
};

const subirProducto = () =>{
    const producto = {
        nombre: document.getElementById("formulario id").value,
        precio: document.getElementById("formulario id").value,
        descripcion: document.getElementById("formulario id").value,
        id: document.getElementById("formulario id").value
    };

    if (!producto.nombre || producto.descripcion || producto.precio){
        document.getElementById('').innerHTML = "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    };
    document.getElementById("").innerHTML = "";

    fetch(url,{
        method: "PUT",
        body: JSON.stringify(producto),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(respuesta => respuesta.json())
    .then(respuestaa => {
        alertManager("success", respuestaa,mensaje);
        getProdcuto();
    })
    .catch(error =>{
        alertManager("error", error);
    });
    document.getElementById("").reset();
};

const eliminarProducto = (id) =>{
    fetch(`${url}/${id}`,{
        method : "DELETE"
    })

    .then(respuesta => respuesta.json())
    .then(respuestaa =>{
        alertManager("success", respuestaa.mensaje);
        getProdcuto();
    })
    .catch(error =>{
        alertManager("error", error);
    });
};





const alertManager = (tipoMnesaje, mensaje) => {
    const alerta = document.getElementById("");

    alerta.innerHTML = mensaje || "SE HICIERON CAMBIOS";
    alerta.classList.add(tipoMnesaje);
    alerta.style.display = "block";

    setTimeout(() =>{
        alerta.style.display = "none";
        alerta.classList.remove(tipoMnesaje);
    }, 3500);
};