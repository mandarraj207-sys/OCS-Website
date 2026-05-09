const validUsername = "admin";
const validPassword = "1234";


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



let bookings = JSON.parse(localStorage.getItem("bookings")) || [];


window.onload = function () {

    const isLoggedIn = localStorage.getItem("loggedIn");

    if (isLoggedIn === "true") {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainPage").style.display = "block";
    }

    loadRooms();
    displayBookings();
};


function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("loginMessage");

    if ( username === validUsername && password === validPassword) {
        localStorage.setItem( "loggedIn", "true" );

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainPage").style.display = "block";
    }

    else {
        loginMessage.innerHTML = `
            <p class="error">
                Invalid Username or Password
            </p>
        `;
    }
}


function logout() {
    localStorage.removeItem("loggedIn");
    location.reload();
}



function loadRooms() {

    const roomSelect = document.getElementById("room");

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


function showTab(tabId) {
    document.getElementById("bookingTab").style.display = "none";
    document.getElementById("viewTab").style.display = "none";
    document.getElementById(tabId).style.display = "block";

    if (tabId === "viewTab") {
        bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        displayBookings();
    }
}


function displayBookings(data = bookings) {
    const container = document.getElementById("bookingsContainer");

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
                    ${booking.startTime}-${booking.endTime}
                </p>
                <p>
                    <b>Participants:</b>
                    ${booking.participants}
                </p>

                <button
                    class="delete-btn"
                    onclick="deleteBooking(${booking.id})"
                >
                    Remove Booking
                </button>

            </div>
        `;
    });
}


function filterBookings() {
    const selectedPurpose = document.getElementById("filterPurpose").value;

    if (selectedPurpose === "All") {
        displayBookings();
        return;
    }

    const filtered = bookings.filter(booking => {
            return booking.purpose === selectedPurpose;
        });

    displayBookings(filtered);
}


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


function deleteBooking(id) {

    const confirmDelete = confirm("Delete this booking?");

    if (!confirmDelete) {
        return;
    }

    bookings = bookings.filter(booking => {
            return booking.id !== id;
        });

    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );

    displayBookings();
}


function bookRoom() {

    const room = document.getElementById("room").value;
    const purpose = document.getElementById("purpose").value;
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const participants = Number( document.getElementById("participants").value );
    const message = document.getElementById("message");
    message.innerHTML = "";

    if (
        !room ||
        !purpose ||
        !date ||
        !startTime ||
        !endTime ||
        !participants
    ) {
        message.innerHTML = `
            <p class="error">
                Fill all fields
            </p>
        `;
        return;
    }

    if (endTime <= startTime) {

        message.innerHTML = `
            <p class="error">
                Invalid Time
            </p>
        `;

        return;
    }

    const selectedRoom = rooms.find(r => r.name === room);

    if (participants > selectedRoom.capacity) {

        message.innerHTML = `
            <p class="error">
                Capacity Exceeded
            </p>
        `;
        return;
    }

    const newBooking = {

        id: Date.now(),
        room,
        purpose,
        date,
        startTime,
        endTime,
        participants
    };

    if (hasConflict(newBooking)) {
        message.innerHTML = `
            <p class="error">
                Time Conflict Detected
            </p>
        `;

        return;
    }



    bookings.push(newBooking);

    localStorage.setItem( "bookings", JSON.stringify(bookings) );

    message.innerHTML = `
        <p class="success">
            Booking Successful
        </p>
    `;

    document.getElementById("bookingForm").reset();

    displayBookings();
}