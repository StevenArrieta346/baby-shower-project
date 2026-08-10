// ========================================
// BABY SHOWER READING CORNER
// Main JavaScript
// ========================================


// ----------------------------------------
// BOOK INFORMATION
// ----------------------------------------

const books = {
    1: "Book One",
    2: "Book Two",
    3: "Book Three",
    4: "Book Four",
    5: "Book Five",
    6: "Book Six",
    7: "Book Seven"
};


// ----------------------------------------
// GET SELECTED BOOK FROM URL
// ----------------------------------------

const urlParameters = new URLSearchParams(window.location.search);

const selectedBookNumber = urlParameters.get("book");

const bookTitle = document.getElementById("book-title");

if (selectedBookNumber && books[selectedBookNumber]) {
    bookTitle.textContent = books[selectedBookNumber];
}


// ----------------------------------------
// RECORDING VARIABLES
// ----------------------------------------

const recordButton = document.getElementById("record-button");

const recordingStatus = document.getElementById("recording-status");

const audioPreview = document.getElementById("audio-preview");

let mediaRecorder;

let audioChunks = [];

let audioBlob;


// ----------------------------------------
// START / STOP RECORDING
// ----------------------------------------

recordButton.addEventListener("click", async function () {

    // If recording has not started yet
    if (!mediaRecorder || mediaRecorder.state === "inactive") {

        try {

            // Ask for microphone permission
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });


            // Create recorder
            mediaRecorder =
                new MediaRecorder(stream);


            audioChunks = [];


            // Collect audio while recording
            mediaRecorder.addEventListener(
                "dataavailable",
                function (event) {

                    audioChunks.push(event.data);

                }
            );


            // When recording stops
            mediaRecorder.addEventListener(
                "stop",
                function () {

                    audioBlob =
                        new Blob(
                            audioChunks,
                            {
                                type: mediaRecorder.mimeType
                            }
                        );


                    const audioURL =
                        URL.createObjectURL(audioBlob);


                    // Show audio player
                    audioPreview.innerHTML = "";


                    const audioPlayer =
                        document.createElement("audio");


                    audioPlayer.controls = true;

                    audioPlayer.src = audioURL;


                    audioPreview.appendChild(audioPlayer);


                    recordingStatus.textContent =
                        "Recording complete. Listen before saving.";


                    recordButton.textContent =
                        "Record Again";

                }
            );


            // Begin recording
            mediaRecorder.start();


            recordButton.textContent =
                "Stop Recording";


            recordingStatus.textContent =
                "Recording... read your story aloud.";

        }

        catch (error) {

            recordingStatus.textContent =
                "Microphone access was not allowed.";

            console.error(error);

        }

    }

    else {

        // Stop recording
        mediaRecorder.stop();


        // Stop microphone
        mediaRecorder.stream
            .getTracks()
            .forEach(function (track) {

                track.stop();

            });

    }

});
