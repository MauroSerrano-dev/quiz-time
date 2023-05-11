/**
 * Function that checks if a code contains only letters, numbers, spaces, and/or "-".
 * Returns true if it does, otherwise returns false.
 * @param {string} code - The code to validate
 */
export function validateCodeCharacters(code) {
    // Check if code contains only letters, numbers, spaces, and/or "-"
    const LETTERS_NUMBERS_SPACES_AND_DASH_REGEX = /^[a-zA-Z0-9\s-]*$/;
    return LETTERS_NUMBERS_SPACES_AND_DASH_REGEX.test(code);
}

/**
 * Function that checks if a code contains at least 3 letters or numbers.
 * Returns true if it does, otherwise returns false.
 * @param {string} code - The code to validate
 */
export function validateCodeLength(code) {
    // Count the number of letters and numbers in the code
    const LETTERS_AND_NUMBERS_REGEX = /[a-zA-Z0-9]/g;
    const matches = code.match(LETTERS_AND_NUMBERS_REGEX);
    const count = matches ? matches.length : 0;

    // Check if the code contains at least 3 letters or numbers
    return count >= 3;
}