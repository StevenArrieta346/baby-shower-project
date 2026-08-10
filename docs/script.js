// ========================================
// BABY SHOWER READING CORNER
// Recording System
// ========================================



// ========================================
// BOOK INFORMATION
// ========================================

const books = {

    1: "I Wish You Happiness",

    2: "Love You Forever",

    3: "Where the Wild Things Are",

    4: "Dragons Love Tacos",

    5: "The Very Hungry Caterpillar",

    6: "I Love You to the Moon and Back",

    7: "Guess How Much I Love You"

};



// ========================================
// FIND SELECTED BOOK
// ========================================

const parameters =
    new URLSearchParams(
        window.location.search
    );


const selectedBook =
    parameters.get("book");


const bookTitle =
    document.getElementById(
        "book-title"
    );


if (
    selectedBook &&
    books[selectedBook]
) {

    bookTitle.textContent =
        books[selectedBook];

}



// ========================================
// PAGE ELEMENTS
// ========================================

const recordButton =
    document.getElementById(
        "record-button"
    );


const recordingStatus =
    document.getElementById(
        "recording-status"
    );


const audioPreview =
    document.getElementById(
        "audio-preview"
    );


const readerName =
    document.getElementById(
        "reader-name"
    );



// ========================================
// RECORDING VARIABLES
// ========================================

let mediaRecorder;

let audioChunks = [];

let audioBlob;

let microphoneStream;



// ========================================
// RECORD BUTTON
// ========================================

recordButton.addEventListener(
    "click",

    async function () {


        // --------------------------------
        // START RECORDING
        // --------------------------------

        if (
            !mediaRecorder ||
            mediaRecorder.state === "inactive"
        ) {


            // Require a reader name first

            if (
                readerName.value.trim() === ""
            ) {

                recordingStatus.textContent =
                    "Please enter your name before recording.";

                readerName.focus();

                return;

            }


            try {


                // Ask for microphone access

                microphoneStream =
                    await navigator
                        .mediaDevices
                        .getUserMedia({

                            audio: true

                        });



                // Create the recorder

                mediaRecorder =
                    new MediaRecorder(
                        microphoneStream
                    );


                audioChunks = [];



                // --------------------------------
                // COLLECT AUDIO
                // --------------------------------

                mediaRecorder.addEventListener(
                    "dataavailable",

                    function (event) {


                        if (
                            event.data.size > 0
                        ) {

                            audioChunks.push(
                                event.data
                            );

                        }


                    }

                );



                // --------------------------------
                // RECORDING FINISHED
                // --------------------------------

                mediaRecorder.addEventListener(
                    "stop",

                    function () {


                        audioBlob =
                            new Blob(
                                audioChunks,
                                {
                                    type:
                                        mediaRecorder
                                            .mimeType
                                }
                            );


                        const audioURL =
                            URL.createObjectURL(
                                audioBlob
                            );


                        // Clear old preview

                        audioPreview.innerHTML =
                            "";



                        // Create audio player

                        const audioPlayer =
                            document.createElement(
                                "audio"
                            );


                        audioPlayer.controls =
                            true;


                        audioPlayer.src =
                            audioURL;


                        audioPreview.appendChild(
                            audioPlayer
                        );



                        // Update status

                        recordingStatus.textContent =
                            "Recording complete. Listen to it before saving.";



                        recordButton.textContent =
                            "Record Again";


                    }

                );



                // --------------------------------
                // BEGIN RECORDING
                // --------------------------------

                mediaRecorder.start();


                recordButton.textContent =
                    "Stop Recording";


                recordingStatus.textContent =
                    "Recording... read your story aloud.";


            }


            catch (error) {


                recordingStatus.textContent =
                    "Microphone access was not allowed.";


                console.error(
                    "Microphone Error:",
                    error
                );


            }


        }


        // --------------------------------
        // STOP RECORDING
        // --------------------------------

        else {


            mediaRecorder.stop();


            microphoneStream
                .getTracks()
                .forEach(

                    function (track) {

                        track.stop();

                    }

                );


        }


    }

);
