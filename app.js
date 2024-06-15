document.addEventListener('DOMContentLoaded', () => {
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    const pruebasInput = document.getElementById('pruebas');
    const medicionesInput = document.getElementById('mediciones');
    const limpiezasInput = document.getElementById('limpiezas');
    const extraccionOilInput = document.getElementById('extraccion_oil');
    const serviceItems = document.getElementById('service-items');
    const addItemButton = document.getElementById('add-item');
    const submitButton = document.getElementById('submit');
    const errorElement = document.getElementById('error');
    const dataTableBody = document.getElementById('data-table').querySelector('tbody');

    const signaturePad = new SignaturePad(document.getElementById('signature-pad'));
    const clearSignatureButton = document.getElementById('clear-signature');

    let items = [];

    clearSignatureButton.addEventListener('click', () => {
        signaturePad.clear();
    });

    addItemButton.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('service-item');
        newItem.innerHTML = `
            <input type="text" name="description" placeholder="Descripción">
            <input type="file" name="photo" accept="image/*">
            <button class="remove-item btn">Eliminar</button>
        `;
        newItem.querySelector('.remove-item').addEventListener('click', () => {
            serviceItems.removeChild(newItem);
            items = items.filter(item => item !== newItem);
        });
        serviceItems.appendChild(newItem);
        items.push(newItem);
    });

    submitButton.addEventListener('click', () => {
        errorElement.textContent = '';
        const product = productSelect.value;
        const quantity = quantityInput.value;
        const pruebas = pruebasInput.value;
        const mediciones = medicionesInput.value;
        const limpiezas = limpiezasInput.value;
        const extraccionOil = extraccionOilInput.value;
        const signatureData = signaturePad.toDataURL();
        const serviceData = items.map(item => {
            const description = item.querySelector('input[name="description"]').value;
            const photo = item.querySelector('input[name="photo"]').files[0];
            return { description, photo };
        });

        if (serviceData.every(item => validatePhoto(item.photo))) {
            addDataToTable(product, quantity, pruebas, mediciones, limpiezas, extraccionOil, serviceData, signatureData);
            // Enviar datos al servidor
            fetch('http://localhost:3000/api/mantenimientos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cliente_id: 1, // Usar el ID correspondiente
                    tecnico_id: 1, // Usar el ID correspondiente
                    equipo_id: 1, // Usar el ID correspondiente
                    fecha: new Date().toISOString().split('T')[0],
                    firma: signatureData,
                    ultimo_mantenimiento: '2024-01-01', // Cambiar según sea necesario
                    marca: 'Marca X', // Cambiar según sea necesario
                    año_de_fabricacion: '2020', // Cambiar según sea necesario
                    normativa: 'Norma XYZ', // Cambiar según sea necesario
                    tipo_de_enfriamiento: 'Enfriamiento por aire', // Cambiar según sea necesario
                    dimensiones: '200x100x50 cm', // Cambiar según sea necesario
                    peso: '500 kg', // Cambiar según sea necesario
                    oil: 'Mineral', // Cambiar según sea necesario
                    presion: '100 PSI', // Cambiar según sea necesario
                    temperatura: '75°C', // Cambiar según sea necesario
                    pruebas: pruebas,
                    mediciones: mediciones,
                    limpiezas: limpiezas,
                    extraccion_oil: extraccionOil
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Datos enviados:', data);
                loadMantenimientos(); // Recargar los mantenimientos después de agregar uno nuevo
            })
            .catch(error => console.error('Error:', error));
        } else {
            errorElement.textContent = 'Por favor, asegúrese de que todas las fotos sean válidas.';
        }
    });

    const validatePhoto = (file) => {
        return file && file.size > 0; // Ejemplo básico: asegúrate de que el archivo no esté vacío
    };

    const addDataToTable = (product, quantity, pruebas, mediciones, limpiezas, extraccionOil, serviceData, signatureData) => {
        serviceData.forEach(data => {
            const row = dataTableBody.insertRow();
            row.insertCell(0).textContent = product;
            row.insertCell(1).textContent = quantity;
            row.insertCell(2).textContent = data.description;

            const photoCell = row.insertCell(3);
            if (data.photo) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(data.photo);
                img.style.width = '50px';
                img.style.height = '50px';
                photoCell.appendChild(img);
            }

            row.insertCell(4).textContent = pruebas;
            row.insertCell(5).textContent = mediciones;
            row.insertCell(6).textContent = limpiezas;
            row.insertCell(7).textContent = extraccionOil;

            const signatureCell = row.insertCell(8);
            const imgSignature = document.createElement('img');
            imgSignature.src = signatureData;
            imgSignature.style.width = '150px';
            imgSignature.style.height = '50px';
            signatureCell.appendChild(imgSignature);

            const actionsCell = row.insertCell(9);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => {
                fetch(`http://localhost:3000/api/mantenimientos/${data.mantenimiento_id}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Mantenimiento eliminado:', data);
                    dataTableBody.removeChild(row);
                })
                .catch(error => console.error('Error:', error));
            });
            actionsCell.appendChild(deleteButton);
        });

        // Limpiar campos después de enviar
        productSelect.value = '';
        quantityInput.value = '';
        pruebasInput.value = '';
        medicionesInput.value = '';
        limpiezasInput.value = '';
        extraccionOilInput.value = '';
        serviceItems.innerHTML = '';
        items = [];
    };

    const loadMantenimientos = () => {
        fetch('http://localhost:3000/api/mantenimientos')
            .then(response => response.json())
            .then(data => {
                dataTableBody.innerHTML = '';
                data.forEach(mantenimiento => {
                    const row = dataTableBody.insertRow();
                    row.insertCell(0).textContent = mantenimiento.product;
                    row.insertCell(1).textContent = mantenimiento.quantity;
                    row.insertCell(2).textContent = mantenimiento.description;
                    row.insertCell(3).textContent = mantenimiento.pruebas;
                    row.insertCell(4).textContent = mantenimiento.mediciones;
                    row.insertCell(5).textContent = mantenimiento.limpiezas;
                    row.insertCell(6).textContent = mantenimiento.extraccion_oil;

                    const signatureCell = row.insertCell(7);
                    const imgSignature = document.createElement('img');
                    imgSignature.src = mantenimiento.firma;
                    imgSignature.style.width = '150px';
                    imgSignature.style.height = '50px';
                    signatureCell.appendChild(imgSignature);

                    const actionsCell = row.insertCell(8);
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.addEventListener('click', () => {
                        fetch(`http://localhost:3000/api/mantenimientos/${mantenimiento.mantenimiento_id}`, {
                            method: 'DELETE'
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Mantenimiento eliminado:', data);
                            dataTableBody.removeChild(row);
                        })
                        .catch(error => console.error('Error:', error));
                    });
                    actionsCell.appendChild(deleteButton);
                });
            })
            .catch(error => console.error('Error:', error));
    };

    loadMantenimientos(); // Cargar los mantenimientos cuando se cargue la página
});

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('Service Worker registrado:', registration);
        }).catch(error => {
            console.log('Error en el registro del Service Worker:', error);
        });
    });
}
