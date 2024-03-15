document.getElementById('myForm').addEventListener('submit', function(event) {
    var checkboxes = document.querySelectorAll('input[id="tech"]:checked');
    if (checkboxes.length === 0) {
        alert('at least one checkbox technologies must be selected!');
        event.preventDefault(); 
    }
});
