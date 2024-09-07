// Client-side code
// Assume you have an element with the ID "totalSum"
const totalSumElement = document.getElementById('totalSum');

// Function to fetch and update the total sum
async function updateTotalSum() {
  try {
    const response = await fetch('/api/totalSum');
    const data = await response.json();
    totalSumElement.textContent = data.totalSum || 0;
  } catch (error) {
    console.error('Error fetching total sum:', error);
    // Handle error if necessary
  }
}

// Call the function to fetch and display the initial total sum
updateTotalSum();
// Call the function initially and then set up periodic fetching
const scaleButtonHeights = (percentage) => {
  const buttonContainer = document.querySelector('.button-container');
  const buttons = buttonContainer.querySelectorAll('button');

  buttons.forEach(button => {
    const currentHeight = button.clientHeight;
    const newHeight = currentHeight * (1 + percentage / 100);
    const minHeight = 20;
    const finalHeight = Math.max(minHeight, newHeight);
    const scaleFactor = finalHeight / currentHeight;

    button.style.transition = 'transform 0.5s ease';
    button.style.transform = `scale(1.5, ${scaleFactor})`;

    button.style.height = `${finalHeight}px`;
  });
};

const translateButtonContainer = (distance) => {
  const btnContainer = document.querySelector('.button-container');
  btnContainer.style.transition = 'transform 0.5s ease';
  btnContainer.style.transform = `translateY(-${distance}px)`;
};

const updateButtonAppearance = (buttonId, percentage) => {
  const button = document.getElementById(buttonId);
  const otherButtonId = buttonId === 'Yes-btn' ? 'No-btn' : 'Yes-btn';
  const otherButton = document.getElementById(otherButtonId);
  const totalHeight = button.clientHeight + otherButton.clientHeight;
  const buttonHeight = (totalHeight * percentage) / 100;

  // Set a minimum button height
  const minHeight = 20; // Adjust this value as needed

  // Ensure the button heights are above the minimum height
  const actualButtonHeight = Math.max(minHeight, buttonHeight);

  button.style.height = `${actualButtonHeight}px`;

  // Calculate the scaling factor based on the button's height
  const scale = actualButtonHeight / button.clientHeight;

  button.style.transition = 'transform 0.5s ease';
  button.style.transform = `scale(1.5, ${scale})`;

  translateButtonContainer(100);

  // Set the color of the non-clicked button
  if (buttonId === 'Yes-btn') {
    otherButton.style.backgroundColor = '#3D52D5';
    button.style.backgroundColor = '#B4C5E4'; // Reset to default
  } else {
    button.style.backgroundColor = '#B4C5E4';
    otherButton.style.backgroundColor = '#3D52D5'; // Reset to default
  }
};

const updateButtonText = (buttonId, buttonText, count, percentage) => {
  const button = document.getElementById(buttonId);
  button.innerText = `${buttonText} ${percentage}% (${count})`;

  // Update button appearance based on the percentage
  updateButtonAppearance(buttonId, percentage);
  scaleButtonHeights(20);

//  Calculate and display the total sum of clicks

};

const handleButtonClick = (answer) => {
  const otherAnswer = answer === 'Yes' ? 'No' : 'Yes';

  fetch(`/api/clicks/${answer}`, {
    method: 'POST',
  })
    .then((response) => response.json())
    .then(({ [answer]: currentCount, [otherAnswer]: otherCount, total }) => {
      const percentage = ((currentCount / total) * 100).toFixed(2);

      updateButtonText(`${answer}-btn`, answer, currentCount, percentage);
      updateButtonText(`${otherAnswer}-btn`, otherAnswer, otherCount, (100 - percentage).toFixed(2));
updateTotalSum();
      const buttons = document.querySelectorAll('.percent');
      for (const button of buttons) {
        button.disabled = true;
      }

    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
const buttons = document.querySelectorAll('.button-container button');
const captextDiv = document.querySelector('.captext');
const iconContainerDiv = document.querySelector('.icon-container');
const textContainerDiv = document.querySelector('.text-container');
const textParagraphs = document.querySelectorAll('.text-container p');
const elementToHide = document.querySelector('.inv');
const component1 = document.getElementById('inv');
const component2 = document.getElementById('vis');

  // Hide the element by setting its display to 'none'
buttons.forEach(button => {
  button.addEventListener('click', () => {

    // Add CSS classes to divs
    captextDiv.classList.add('captext-final');
    iconContainerDiv.classList.add('icon-container-final');
    textContainerDiv.classList.add('text-container-final');
    elementToHide.style.display = 'none';
    textParagraphs.forEach(paragraph => {
    paragraph.style.display = 'inline';
  });
  if (component1.style.display === 'none') {
    component1.style.display = 'block';
    component2.style.display = 'none';
  } else {
    component1.style.display = 'none';
    component2.style.display = 'block';
}

});
});
// sum
 
