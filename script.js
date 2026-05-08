// ======================
// ROOM DATA
// ======================

const rooms = [

    {
        id: 1,
        block: "LHC",
        name: "LHC-01",
        capacity: 72
    },

    {
        id: 2,
        block: "LHC",
        name: "LHC-04",
        capacity: 200
    },

    {
        id: 3,
        block: "A",
        name: "A-Class Room 320",
        capacity: 80
    },

    {
        id: 4,
        block: "CSE",
        name: "CSE-LH-01",
        capacity: 70
    }

];


// ======================
// BOOKINGS STORAGE
// ======================

let bookings =
    JSON.parse(localStorage.getItem("bookings")) || [];


// ======================
// LOAD ROOM DROPDOWN
// ======================

function loadRooms() {

    const roomSelect =
        document.getElementById("room");

    roomSelect.innerHTML = "";

    rooms.forEach(room => {

        roomSelect.innerHTML += `

            <option value="${room.name}">

                ${room.name}
                (${room.capacity})

            </option>

        `;

    });
}


// ======================
// SHOW TABS
// ======================

function showTab(tabId) {

    document.getElementById("bookingTab")
        .style.display = "none";

    document.getElementById("viewTab")
        .style.display = "none";

    document.getElementById(tabId)
        .style.display = "block";
}


// ======================
// DISPLAY BOOKINGS
// ======================

function displayBookings(data = bookings) {

    const container =
        document.getElementById("bookingsContainer");

    container.innerHTML = "";

    if (data.length === 0) {

        container.innerHTML = `

            <p>No bookings found</p>

        `;

        return;
    }

    data.forEach((booking) => {

        container.innerHTML += `

            <div class="booking-card">

                <h3>${booking.room}</h3>

                <p>
                    <b>Purpose:</b>
                    ${booking.purpose}
                </p>

                <p>
                    <b>Date:</b>
                    ${booking.date}
                </p>

                <p>
                    <b>Time:</b>
                    ${booking.startTime}
                    -
                    ${booking.endTime}
                </p>

                <p>
                    <b>Participants:</b>
                    ${booking.participants}
                </p>

            </div>

        `;
    });
}


// ======================
// FILTER BOOKINGS
// ======================

function filterBookings() {

    const selectedPurpose =
        document.getElementById("filterPurpose")
        .value;

    if (selectedPurpose === "All") {

        displayBookings();

        return;
    }

    const filtered = bookings.filter(booking => {

        return booking.purpose === selectedPurpose;

    });

    displayBookings(filtered);
}


// ======================
// CONFLICT CHECK
// ======================

function hasConflict(newBooking) {

    return bookings.some(existing => {

        return (

            existing.room === newBooking.room &&
            existing.date === newBooking.date &&

            newBooking.startTime < existing.endTime &&
            newBooking.endTime > existing.startTime

        );

    });
}


// ======================
// BOOK ROOM
// ======================

function bookRoom() {

    const room =
        document.getElementById("room").value;

    const purpose =
        document.getElementById("purpose").value;

    const date =
        document.getElementById("date").value;

    const startTime =
        document.getElementById("startTime").value;

    const endTime =
        document.getElementById("endTime").value;

    const participants =
        Number(
            document.getElementById("participants").value
        );

    const message =
        document.getElementById("message");

    message.innerHTML = "";


    // ======================
    // TIME VALIDATION
    // ======================

    if (endTime <= startTime) {

        message.innerHTML = `

            <p class="error">
                End time must be greater than start time
            </p>

        `;

        return;
    }


    // ======================
    // ROOM VALIDATION
    // ======================

    const selectedRoom =
        rooms.find(r => r.name === room);

    if (participants > selectedRoom.capacity) {

        message.innerHTML = `

            <p class="error">
                Room capacity exceeded
            </p>

        `;

        return;
    }


    // ======================
    // CREATE BOOKING
    // ======================

    const newBooking = {

        room,
        purpose,
        date,
        startTime,
        endTime,
        participants

    };


    // ======================
    // CONFLICT VALIDATION
    // ======================

    if (hasConflict(newBooking)) {

        message.innerHTML = `

            <p class="error">
                Time slot conflict detected
            </p>

        `;

        return;
    }


    // ======================
    // SAVE BOOKING
    // ======================

    bookings.push(newBooking);

    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );


    // ======================
    // SUCCESS
    // ======================

    message.innerHTML = `

        <p class="success">
            Booking Successful
        </p>

    `;


    // ======================
    // REFRESH BOOKINGS
    // ======================

    displayBookings();
}


// ======================
// INITIAL LOAD
// ======================

loadRooms();

displayBookings();