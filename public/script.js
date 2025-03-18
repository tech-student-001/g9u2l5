console.log("Script uploaded successfully"); // debugging check

document.addEventListener("DOMContentLoaded", async function () {
    const artworkContainer = document.getElementById("artwork-container");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (artworkContainer) {
        let artworks = [];
        let index = 0;

        async function fetchArtworks() {
            try {
                const response = await fetch("http://localhost:3000/api/artworks");
                artworks = await response.json();
                updateGallery();
            } catch (error) {
                console.error("Error fetching artworks:", error);
                artworkContainer.innerHTML = "<p class='text-red-500'>Failed to load artworks.</p>";
            }
        }

        function updateGallery() {
            if (artworks.length > 0) {
                const artwork = artworks[index];
                artworkContainer.innerHTML = `
                    <h3 class="text-xl font-medium p-8">${artwork.title}</h3>
                    <img src="${artwork.image}" class="w-[600px] h-[400px] rounded-3xl object-cover" alt="${artwork.title}">
                    <h4 class="text-gray-600">Style: ${artwork.style}</h4>
                `;
            }
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener("click", function () {
                index = (index > 0) ? index - 1 : artworks.length - 1;
                updateGallery();
            });

            nextBtn.addEventListener("click", function () {
                index = (index < artworks.length - 1) ? index + 1 : 0;
                updateGallery();
            });
        }

        fetchArtworks();
    }
});

// Handle Contact Form Submission
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            message: document.getElementById("message").value
        };

        try {
            const response = await fetch("http://localhost:3000/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                document.getElementById("response-message").classList.remove("hidden");
                contactForm.reset();
            } else {
                alert("Failed to submit message.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    });
}

// Fetching Contacts for Manage Contact Page
document.addEventListener("DOMContentLoaded", function () {
    const contactTable = document.getElementById("contact-table");

    if (contactTable) {
        async function fetchContacts() {
            try {
                const response = await fetch("http://localhost:3000/api/contacts");
                if (!response.ok) throw new Error("Failed to load contacts");

                const contacts = await response.json();
                contactTable.innerHTML = "";

                contacts.forEach(contact => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td class="p-2 border">${contact.name}</td>
                        <td class="p-2 border">${contact.email}</td>
                        <td class="p-2 border">${contact.phone}</td>
                        <td class="p-2 border">${contact.message}</td>
                    `;
                    contactTable.appendChild(row);
                });
            } catch (error) {
                console.error("Error fetching contacts:", error);
                document.getElementById("error-message").classList.remove("hidden");
            }
        }

        fetchContacts();
    }
});
