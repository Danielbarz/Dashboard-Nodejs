// This script is intended to be run in the browser's developer console.
// It retrieves the 'user' object from localStorage and displays it.

const userString = localStorage.getItem('user');
if (userString) {
  try {
    const user = JSON.parse(userString);
    console.log('User data from localStorage:', user);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    console.log('Raw user data string:', userString);
  }
} else {
  console.log('No user data found in localStorage.');
}