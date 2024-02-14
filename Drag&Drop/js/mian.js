// 1. Declara array bacia para los ficheros
let files = [];

// 2. Declarar los objetos que usaremos
let dropArea = document.querySelector('.drop-area');
let dragDropText = dropArea.querySelector('h2');
let button = dropArea.querySelector('button');
let input = document.getElementById('input-file');
let preview = document.getElementById('preview');

// 3. Invalidar la acción por defecto del drag & drop
['dragover', 'dragleave', 'drop'].forEach(event => {
    dropArea.addEventListener(event, function(e) {
        e.preventDefault();
    });
});

// 4. Acción dragover
dropArea.addEventListener('dragover', function() {
    dropArea.classList.add('active');
    dragDropText.textContent = 'Release to Upload Files';
});

// 5. Acción dragleave
dropArea.addEventListener('dragleave', function() {
    dropArea.classList.remove('active');
    dragDropText.textContent = 'Drag & Drop files';
});

// 6. Acción drop
dropArea.addEventListener('drop', function(e) {
    files = files.concat(Array.from(e.dataTransfer.files));
    showFiles();
    dropArea.classList.remove('active');
    dragDropText.textContent = 'Drag & Drop files';
});

// 7. Función showFiles
function showFiles() {
    if (files.length > 0) {
        preview.innerHTML = ''; // Clear previous content
        files.forEach(processFile);
    }
}


// 8. Función processFile
function processFile(file, index) {
    const validExtensions = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validExtensions.includes(file.type)) {
        console.log('Invalid file type:', file.name);
        files = files.filter((_, i) => i !== index); // Remove invalid file from array
    } else {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            const fileUrl = reader.result;
            const prev = `<div class="previewImage">
                <img src="${fileUrl}" />
                <span>${file.name}</span>
                <span onclick="removeFile(${index})" class="material-symbols-outlined removeBtn">close</span>
            </div>`;
            preview.innerHTML += prev;
        };
    }
}

// 9. Función removeFile
function removeFile(index) {
    files.splice(index, 1); // Remove file from array
    showFiles(); // Refresh the preview
}

// 10. Click al botón Upload Files
button.addEventListener('click', function(e) {
    e.preventDefault();
    input.click();
});

// 11. Gestiona los archivos seleccionados
input.addEventListener('change', function() {
    files = files.concat(Array.from(input.files));
    showFiles();
});

// Enviar datos al PHP
const form = document.querySelector('form'); // Asumiendo que existe un <form> en tu HTML
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const dataTransfer = new DataTransfer();
    files.forEach(file => {
        dataTransfer.items.add(file);
    });
    input.files = dataTransfer.files;
    form.submit();
});