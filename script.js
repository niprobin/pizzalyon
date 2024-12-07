const form = document.getElementById('pizzeriaForm');
form.addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the form from submitting the default way

  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = key === "rating" ? parseInt(value) : value; // Convert rating to number
  });

  // Send data to the Netlify function
  try {
    const response = await fetch('/.netlify/functions/update-pizzeria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result); // You can log the result or handle it as needed
    alert(result.message || "Data saved successfully!");
  } catch (err) {
    console.error(err);
    alert('Error submitting form!');
  }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("pizzeria-form");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {
        name: formData.get("name"),
        rating: formData.get("rating"),
        address: formData.get("address"),
        comment: formData.get("comment"),
      };

      // Your form submission logic here, like making the API call
      console.log(data);
    });
  });