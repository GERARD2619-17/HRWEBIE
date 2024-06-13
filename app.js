// app.js
document.addEventListener('DOMContentLoaded', () => {
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    const serviceSheet = document.getElementById('service-sheet');
    const serviceItems = document.getElementById('service-items');
    const addItemButton = document.getElementById('add-item');
    const submitButton = document.getElementById('submit');
    const errorElement = document.getElementById('error');

    let items = [];

    addItemButton.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('service-item');
        newItem.innerHTML = `
            <input type="text" name="description" placeholder="Descripción">
            <input type="file" name="photo" accept="image/*">
        `;
        serviceItems.appendChild(newItem);
        items.push(newItem);
    });

    submitButton.addEventListener('click', () => {
        errorElement.textContent = '';
        const product = productSelect.value;
        const quantity = quantityInput.value;
        const serviceData = items.map(item => {
            const description = item.querySelector('input[name="description"]').value;
            const photo = item.querySelector('input[name="photo"]').files[0];
            return { description, photo };
        });

        if (serviceData.every(item => validatePhoto(item.photo))) {
            // Aquí se puede implementar la lógica para enviar los datos al servidor
            console.log('Datos enviados:', { product, quantity, serviceData });
        } else {
            errorElement.textContent = 'Por favor, asegúrese de que todas las fotos sean válidas.';
        }
    });

    const validatePhoto = (file) => {
        // Implementar la validación de la foto aquí
        return file && file.size > 0; // Ejemplo básico: asegúrate de que el archivo no esté vacío
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
