/**
 * A utility to handle NUI callbacks to the FiveM client.
 * This version uses XMLHttpRequest as it can be more reliable than fetch in the FiveM NUI environment.
 */

// The resource name must match the name of the resource folder.
const resourceName = 'blips_creator';

/**
 * A wrapper to make NUI callbacks using XMLHttpRequest.
 * @param {string} eventName - The name of the NUI callback.
 * @param {object} data - The data to send to the callback.
 * @returns {Promise<any>} - A promise that resolves with the response from the client.
 */
function post(eventName, data = {}) {
  return new Promise((resolve, reject) => {
    const url = `https://${resourceName}/${eventName}`;
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // 4 = DONE
        if (xhr.status === 200) { // 200 = OK
          try {
            // Try to parse the response as JSON, but default to an empty object if it fails
            const responseData = xhr.responseText ? JSON.parse(xhr.responseText) : {};
            resolve(responseData);
          } catch (e) {
            // Handle cases where the response is not valid JSON
            console.error(`Error parsing JSON response for ${eventName}:`, e);
            resolve({}); // Resolve with empty object to prevent crashes
          }
        } else {
          // Handle HTTP errors
          console.error(`NUI callback ${eventName} failed with status ${xhr.status}`);
          reject({ status: xhr.status, statusText: xhr.statusText });
        }
      }
    };

    xhr.onerror = function () {
      // Handle network errors
      console.error(`NUI callback ${eventName} network error`);
      reject({ status: 0, statusText: 'Network Error' });
    };

    xhr.send(JSON.stringify(data));
  });
}

// Exported functions that components can call
export const nui = {
  close: () => post('close'),
  createBlip: (blipData) => post('createBlip', blipData),
  updateBlip: (blipData) => post('updateBlip', blipData),
  deleteBlip: (blipId) => post('deleteBlip', { id: blipId }),
  getBlips: () => post('getBlips'),
};
