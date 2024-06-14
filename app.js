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

    let items = [];

    addItemButton.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('service-item');
        newItem.innerHTML = `
            <input type="text" name="description" placeholder="Descripción">
            <input type="file" name="photo" accept="image/*">
            <button class="remove-item">Eliminar</button>
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
        const serviceData = items.map(item => {
            const description = item.querySelector('input[name="description"]').value;
            const photo = item.querySelector('input[name="photo"]').files[0];
            return { description, photo };
        });

        if (serviceData.every(item => validatePhoto(item.photo))) {
            addDataToTable(product, quantity, pruebas, mediciones, limpiezas, extraccionOil, serviceData);
            // Aquí se puede implementar la lógica para enviar los datos al servidor
            console.log('Datos enviados:', { product, quantity, pruebas, mediciones, limpiezas, extraccionOil, serviceData });
        } else {
            errorElement.textContent = 'Por favor, asegúrese de que todas las fotos sean válidas.';
        }
    });

    const validatePhoto = (file) => {
        return file && file.size > 0; // Ejemplo básico: asegúrate de que el archivo no esté vacío
    };

    const addDataToTable = (product, quantity, pruebas, mediciones, limpiezas, extraccionOil, serviceData) => {
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

            const actionsCell = row.insertCell(8);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => {
                dataTableBody.removeChild(row);
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
