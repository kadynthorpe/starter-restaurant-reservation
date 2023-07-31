import React from "react";
import { useHistory, Link } from "react-router-dom";

import { cancelReservation } from "../../utils/api";

function ReservationsList({ reservationParam }) {
  const history = useHistory();
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = reservationParam;

  const cancelHandler = () => {
  const confirmBox = window.confirm(
    "Do you want to cancel this reservation? This cannot be undone."
  );

  if (confirmBox === true) {
    cancelReservation(reservation_id)
      .then(() => history.go())
      .catch((error) => console.log("error", error));
  }

  return null;
};
By making this change, the cancelReservation function should receive the correct reservation_id and successfully cancel the reservation on the server. Remember to make sure that the reservation_id passed to the cancelReservation function is a valid integer and corresponds to the reservation you want to cancel.

Additionally, after canceling the reservation, the code uses history.go() to reload the page. This might not be necessary if your page is set up to automatically refresh or re-render after an API call. You can try removing the history.go() line if it's not needed for your specific use case.






  return (
    <>
      <tr>
        <th scope="row"> {reservation_id}</th>
        <td>{first_name}</td>
        <td> {last_name} </td>
        <td> {people} </td>
        <td> {mobile_number} </td>
        <td> {reservation_date} </td>
        <td> {reservation_time} </td>
        <td data-reservation-id-status={reservation_id}>{status}</td>
        <td>
          {status === "booked" ? (
            <Link to={`/reservations/${reservation_id}/seat`}>
              <button className="btn btn-primary"> Seat </button>
            </Link>
          ) : (
            <div></div>
          )}
        </td>
        <td>
          {status === "booked" ? (
            <Link to={`/reservations/${reservation_id}/edit`}>
              <button className="btn btn-primary "> Edit </button>
            </Link>
          ) : (
            <></>
          )}
        </td>
        <td data-reservation-id-cancel={reservation_id}>
          {status === "booked" ? (
            <button className="btn btn-danger ml-2" onClick={cancelHandler}>
              {" "}
              Cancel{" "}
            </button>
          ) : (
            <></>
          )}
        </td>
      </tr>
    </>
  );
}

export default ReservationsList;
