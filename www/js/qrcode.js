var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    capturePhoto: function(){

        /*QRScanner.prepare(onDone); // show the prompt

        function onDone(err, status){
            if (err) {
                // here we can handle errors and clean up any loose ends.
                console.error(err);
            }
            if (status.authorized) {
                // W00t, you have camera access and the scanner is initialized.
                // QRscanner.show() should feel very fast.
            } else if (status.denied) {
                // The video preview will remain black, and scanning is disabled. We can
                // try to ask the user to change their mind, but we'll have to send them
                // to their device settings with `QRScanner.openSettings()`.
            } else {
                // we didn't get permission, but we didn't get permanently denied. (On
                // Android, a denial isn't permanent unless the user checks the "Don't
                // ask again" box.) We can ask again at the next relevant opportunity.
            }
        }*/

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            saveToPhotoAlbum: true
        });

        function onSuccess(imageData) {
            var image = document.getElementById('minhaImagem');
            image.style.display = "block";
            image.src = "data:image/jpeg;base64," + imageData;
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }

    }
};
app.initialize();