document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('blip-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const sprite = document.getElementById('sprite').value;
        const color = document.getElementById('color').value;

        if (!name || !sprite || !color) {
            return;
        }

        fetch(`https://blips_creator/createBlip`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                name: name,
                sprite: parseInt(sprite),
                color: parseInt(color)
            })
        }).then(resp => resp.json()).then(resp => {
            console.log(resp);
        });

        closeUI();
    });

    window.addEventListener('message', function (event) {
        if (event.data.action === 'open') {
            document.body.style.display = 'flex';
        }
    });

    function closeUI() {
        document.body.style.display = 'none';
        fetch(`https://blips_creator/close`, {
            method: 'POST'
        });
    }

    document.onkeyup = function (data) {
        if (data.which == 27) { // Escape key
            closeUI();
        }
    };
});
