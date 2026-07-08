import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./GalleryStrip.css";

/* UPDATED ICONS */
import {
  IoChevronBack,
  IoChevronForward,
  IoClose,
} from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";

const Gallery = ({
  images = [],
  turfId,
  zoomIndex: propZoomIndex,
  setZoomIndex: propSetZoomIndex,
}) => {
  const [localZoomIndex, setLocalZoomIndex] = useState(null);

  const isControlled =
    propZoomIndex !== undefined && propSetZoomIndex !== undefined;

  const zoomIndex = isControlled
    ? propZoomIndex
    : localZoomIndex;

  const setZoomIndex = isControlled
    ? propSetZoomIndex
    : setLocalZoomIndex;

  const [animating, setAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);


  const touchStartX = useRef(0);
  const touchStartY = useRef(0);


  const getImageUrl = (img) => {
    if (!img) return "";

    return img.startsWith("http")
      ? img
      : `${(
        import.meta.env.VITE_API_BASE_URL ||
        "https://api.adugalam.com"
      ).replace(/\/$/, "")
      }${img}`;
  };


  useEffect(() => {
    if (zoomIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomIndex]);


  const animatedGo = useCallback(
    (direction) => {
      if (animating || images.length <= 1) return;

      setSlideDirection(direction);
      setAnimating(true);

      setTimeout(() => {
        setZoomIndex((prev) => {
          if (direction === "next") {
            return (prev + 1) % images.length;
          }

          return (prev - 1 + images.length) % images.length;
        });

        setSlideDirection(null);
        setAnimating(false);
      }, 250);
    },
    [animating, images.length]
  );

  const goNext = useCallback(
    () => animatedGo("next"),
    [animatedGo]
  );

  const goPrev = useCallback(
    () => animatedGo("prev"),
    [animatedGo]
  );


  useEffect(() => {
    if (zoomIndex === null) return;

    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "Escape") {
        setZoomIndex(null);
      }
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [zoomIndex, goNext, goPrev]);


  const handlePopupTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handlePopupTouchEnd = (e) => {
    const diffX =
      touchStartX.current - e.changedTouches[0].clientX;

    const diffY =
      touchStartY.current - e.changedTouches[0].clientY;

    if (
      Math.abs(diffX) > 50 &&
      Math.abs(diffX) > Math.abs(diffY)
    ) {
      if (diffX > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    if (
      Math.abs(diffY) > 80 &&
      Math.abs(diffY) > Math.abs(diffX)
    ) {
      setZoomIndex(null);
    }
  };

  if (!images.length) return null;

  return (
    <div className="gs-wrapper">

      <div className="gs-header">
        <h3 className="gp-section-title4">
          Gallery
        </h3>
      </div>


      <div className="gs-row">
        {images.slice(0, 6).map((src, idx) => (
          <div className="gs-item" key={idx}>
            <img
              src={getImageUrl(src)}
              alt={`gallery-${idx}`}
              className="gs-img"
              onClick={() => setZoomIndex(idx)}
            />
          </div>
        ))}

        {images.length > 6 && (
          <div
            className="gs-item gs-view-all-tile"
            onClick={() => setZoomIndex(6)}
          >
            <span>
              +{images.length - 6}
            </span>
          </div>
        )}
      </div>


      {zoomIndex !== null &&
        createPortal(
          <div
            className="gz-overlay"
            onClick={() => setZoomIndex(null)}
            onTouchStart={handlePopupTouchStart}
            onTouchEnd={handlePopupTouchEnd}
          >

            {images.length > 1 && (
              <button
                type="button"
                className="gz-popup-arrow gz-popup-arrow--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous image"
              >
                {/* <IoChevronBack /> */}  ←
              </button>
            )}


            <div
              className="gz-popup-card"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                type="button"
                className="gz-popup-close"
                onClick={() =>
                  setZoomIndex(null)
                }
                aria-label="Close popup"
              >  X
              </button>


              <div className="gz-popup-image-wrapper">
                <img
                  src={getImageUrl(
                    images[zoomIndex]
                  )}
                  alt={`Zoom ${zoomIndex + 1}`}
                  className={`gz-popup-img ${slideDirection === "next"
                    ? "gz-slide-left"
                    : ""
                    } ${slideDirection === "prev"
                      ? "gz-slide-right"
                      : ""
                    }`}
                  draggable={false}
                />
              </div>


              <span className="gz-popup-counter-text">
                {zoomIndex + 1} /{" "}
                {images.length}
              </span>
            </div>


            {images.length > 1 && (
              <button
                type="button"
                className="gz-popup-arrow gz-popup-arrow--next"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
              >
                {/* <FiArrowRight /> */}   →
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Gallery;