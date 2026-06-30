import React from "react";
import "./ClubPolicy.css";
import { useNavigate } from "react-router-dom";
import { VscChevronLeft } from "react-icons/vsc";

const ClubPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="club-policy-container">
      {/* HEADER */}
      <div className="policy-headerr">
        <button
          className="animated-back-btn"
          data-text="Back to Booking"
          onClick={() => navigate(-1)}
        >
          <VscChevronLeft className="animated-back-icon" />
        </button>
      </div>

      <p className="club-policy-title" style={{ marginTop: '80px' }}>
        <strong>Turf Policy:</strong>
      </p>

      <ul className="club-policy-list">
        <li>Eatables not allowed inside the premises.</li>

        <li>
          Consumption of Food, Alcohol and Smoking inside the premises is
          prohibited.
        </li>

        <li>
          Yelling or Shouting inside the premises is strictly prohibited.
          Unsolicited criticism, disruptive behavior, offensive language,
          obscene gestures or poor sportsmanship will not be tolerated.
        </li>

        <li>The booked slot timings must be followed strictly.</li>

        <li>
          Please report to the venue at least 5 minutes prior to the booked slot.
        </li>

        <li>
          Please use the Inquire option or reach out to contact@playo.co or
          +918095514666 for corporate bookings. Corporate bookings will not be
          allowed through the app. Any such bookings made will be canceled
          without prior intimation & with no refund.
        </li>

        <li>
          Prior permission from the venue is required to conduct tournaments or
          coaching at the venue. Please use the Inquire option or reach out to
          contact@playo.co or +918095514666 for help with this. Bookings for
          Tournaments & Coaching at the venue will not be allowed through the
          app. Any such bookings made will be canceled without prior intimation &
          with no refund.
        </li>

        <li>
          100% of the slot fee will be charged for cancellations of bulk bookings.
        </li>

        <li>
          Management is not responsible for loss of personal belongings & any
          injuries caused during the matches. Please buy insurance for your
          booked slot at the checkout page for the same. T&Cs apply.
        </li>

        <li>
          Please use the dustbin to dump your waste. Littering the club premises
          could result in a permanent ban from the club.
        </li>

        <li>
          Willful damage to the club’s equipment, or the facility, will not be
          tolerated. Any person(s) causing damage to the equipment or property of
          the venue shall be held accountable and would be charged accordingly.
        </li>

        <li>
          The venue reserves the right to discontinue any offer for any service
          or change its policies at any time without due notice.
        </li>

        <li>
          The venue reserves the right to refuse anyone entry to the venue at
          their discretion and failure to follow the above rules could result in
          suspension, or termination, of the player’s privilege to play, at the
          discretion of the venue.
        </li>
      </ul>
    </div>
  );
};

export default ClubPolicy;