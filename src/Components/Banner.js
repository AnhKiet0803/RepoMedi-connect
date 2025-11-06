import React from "react";
import "./Component.css";

const Banner = () => {
  const bannerImg = {
    imgPc: "../img/3.jpg",
    imgMb: "../img/3.jpg", 
  };

  return (
    <section className="banner-homepage">
      <div className="banner-slider">
        <div className="slide">
          <picture>
            <source media="(max-width: 768px)" srcSet={bannerImg.imgMb} />
            <img src={bannerImg.imgPc} alt="Medical Banner" className="banner-image"/>
          </picture>
        </div>
      </div>
    </section>
  );
};
export default Banner;
