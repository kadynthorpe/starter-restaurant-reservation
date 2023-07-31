// api.js

/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:5001";


/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");


/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Function to create a new reservation
 * @param reservation
 * @param signal
 * @returns {Promise<reservation>}
 *  a promise that resolves to the newly created reservation data.
 */
export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Function to create a new table
 * @param table
 * @param signal
 * @returns {Promise<table>}
 *  a promise that resolves to the newly created table data.
 */
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Function to retrieve all tables
 * @param signal
 * @returns {Promise<[table]>}
 *  a promise that resolves to an array of all tables.
 */
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Function to update the status of a reservation
 * @param data
 * @param reservation_id
 * @param signal
 * @returns {Promise<reservation>}
 *  a promise that resolves to the updated reservation data.
 */
export async function updateReservationStatus(data, reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
    signal,
  };

  return await fetchJson(url, options);
}

/**
 * Function to update the seating of a table with a reservation
 * @param table_id
 * @param reservation_id
 * @param signal
 * @returns {Promise<table>}
 *  a promise that resolves to the updated table data.
 */
export async function updateSeating(table_id, reservation_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Function to remove a reservation from a table
 * @param table_id
 * @param signal
 * @returns {Promise<table>}
 *  a promise that resolves to the updated table data.
 */
export async function deleteTableReservation(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({ data: { table_id } }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Function to finish a table (removing any reservation associated with it)
 * @param table_id
 * @returns {Promise<any>}
 *  a promise that resolves to the response data from the server.
 */
export async function finishTable(table_id) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "DELETE",
    headers,
  };
  return await fetchJson(url, options, {});
}

/**
 * Function to retrieve a specific reservation by ID
 * @param reservation_id
 * @param signal
 * @returns {Promise<reservation>}
 *  a promise that resolves to the reservation data.
 */
export async function readReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Function to update a specific reservation
 * @param reservationId
 * @param reservation
 * @param signal
 * @returns {Promise<reservation>}
 *  a promise that resolves to the updated reservation data.
 */
export async function updateReservation(reservationId, reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Function to cancel a specific reservation
 * @param reservation_id
 * @param signal
 * @returns {Promise<any>}
 *  a promise that resolves to the response data from the server.
 */
export async function cancelReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "cancelled" } }),
    signal,
  };
  return await fetchJson(url, options);
}

