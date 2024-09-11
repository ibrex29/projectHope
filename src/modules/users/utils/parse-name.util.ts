export function extractNames(fullName) {
  // Split the full name into an array of words
  const namesArray = fullName.trim().split(/\s+/);

  // Extract first name (first element)
  const firstName = namesArray[0];

  // Extract last name (last element)
  const lastName = namesArray[namesArray.length - 1];

  // Extract middle name (if available)
  let middleName = '';
  if (namesArray.length > 2) {
    // If there are more than 2 names, assume the middle name(s) exist
    middleName = namesArray.slice(1, namesArray.length - 1).join(' ');
  }

  // Return an object containing the extracted names
  return {
    firstName: firstName,
    lastName: lastName,
    middleName: middleName,
  };
}
