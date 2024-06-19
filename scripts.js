document.getElementById('agregar').addEventListener('click', () => {
    const equipo = document.getElementById('equipos').value;
    const cantidad = document.getElementById('cantidad').value;
    if (equipo && cantidad) {
        const lista = document.querySelector('.lista');
        const item = document.createElement('div');
        item.textContent = `${cantidad} - ${equipo}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => item.remove());
        item.appendChild(deleteButton);
        lista.appendChild(item);
    }
});

document.getElementById('enviar').addEventListener('click', () => {
    const hojaServicio = document.getElementById('hoja-servicio');
    // Lógica para enviar el reporte por correo o almacenar en base de datos
});
