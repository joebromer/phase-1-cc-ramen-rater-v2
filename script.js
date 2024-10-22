const API_URL = ' http://localhost:3000';

// Fetch ramen dishes
async function fetchRamen() {
  try {
    const response = await fetch(`${API_URL}/ramen`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching ramen:', error);
    return [];
  }
}

// Fetch ratings for a specific ramen
async function fetchRatings(ramenId) {
  try {
    const response = await fetch(`${API_URL}/ratings?ramenId=${ramenId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return [];
  }
}

// Display ramen dishes
async function displayRamen() {
  const ramenList = document.getElementById('ramen-list');
  const ramenDishes = await fetchRamen();

  ramenDishes.forEach(ramen => {
    const ramenElement = document.createElement('div');
    ramenElement.className = 'ramen-item';
    ramenElement.innerHTML = `
      <h2>${ramen.name}</h2>
      <p>Restaurant: ${ramen.restaurant}</p>
      <p>Type: ${ramen.type}</p>
      <p>${ramen.description}</p>
      <img src="${ramen.image}" alt="${ramen.name}" width="200">
      <button onclick="showRatings(${ramen.id})">Show Ratings</button>
      <div id="ratings-${ramen.id}" class="ratings-container"></div>
      <form onsubmit="submitRating(event, ${ramen.id})">
        <input type="number" min="1" max="5" step="0.5" id="score-${ramen.id}" required>
        <textarea id="comment-${ramen.id}" required></textarea>
        <button type="submit">Submit Rating</button>
      </form>
    `;
    ramenList.appendChild(ramenElement);
  });
}

// Show ratings for a specific ramen
async function showRatings(ramenId) {
  const ratingsContainer = document.getElementById(`ratings-${ramenId}`);
  const ratings = await fetchRatings(ramenId);

  if (ratings.length === 0) {
    ratingsContainer.innerHTML = '<p>No ratings yet.</p>';
    return;
  }

  const averageRating = calculateAverageRating(ratings);
  let ratingsHTML = `<h3>Average Rating: ${averageRating.toFixed(1)}</h3>`;

  ratings.forEach(rating => {
    ratingsHTML += `
      <div class="rating">
        <p>Score: ${rating.score}</p>
        <p>Comment: ${rating.comment}</p>
        <p>Date: ${rating.date}</p>
      </div>
    `;
  });

  ratingsContainer.innerHTML = ratingsHTML;
}

// Calculate average rating
function calculateAverageRating(ratings) {
  const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
  return sum / ratings.length;
}

// Submit a new rating
async function submitRating(event, ramenId) {
  event.preventDefault();
  const score = document.getElementById(`score-${ramenId}`).value;
  const comment = document.getElementById(`comment-${ramenId}`).value;

  const newRating = {
    ramenId,
    userId: 1, 
    score: parseFloat(score),
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  try {
    const response = await fetch(`${API_URL}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRating),
    });

    if (response.ok) {
      alert('Rating submitted successfully!');
      showRatings(ramenId); // Refresh ratings
    } else {
      throw new Error('Failed to submit rating');
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    alert('Failed to submit rating. Please try again.');
  }
}

// Initialize the application
function init() {
  displayRamen();
}

// Call init when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);