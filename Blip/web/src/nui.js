/**
 * A utility to handle NUI callbacks to the FiveM client.
 */

// The resource name must match the name of the resource folder.
const resourceName = 'Blip';

/**
 * A wrapper around fetch to make NUI callbacks.
 * @param {string} eventName - The name of the NUI callback.
 * @param {object} data - The data to send to the callback.
 * @returns {Promise<any>} - A promise that resolves with the response from the client.
 */
async function post(eventName, data = {}) {
  try {
    const response = await fetch(`https://${resourceName}/${eventName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`Failed to post NUI event ${eventName}:`, error);
    // Return a resolved promise with an error state to prevent crashes
    return { ok: false, error: `Failed to post NUI event ${eventName}` };
  }
}

// Exported functions that components can call
export const nui = {
  /**
   * Closes the NUI frame.
   */
  close: () => post('close'),

  /**
   * Creates a new blip.
   * @param {object} blipData - { name, sprite, color }
   */
  createBlip: (blipData) => post('createBlip', blipData),

  /**
   * Updates an existing blip.
   * @param {object} blipData - { id, name, sprite, color, size }
   */
  updateBlip: (blipData) => post('updateBlip', blipData),

  /**
   * Deletes a blip.
   * @param {number} blipId - The ID of the blip to delete.
   */
  deleteBlip: (blipId) => post('deleteBlip', { id: blipId }),

  /**
   * Fetches the list of all blips from the client.
   */
  getBlips: () => post('getBlips'),
};
