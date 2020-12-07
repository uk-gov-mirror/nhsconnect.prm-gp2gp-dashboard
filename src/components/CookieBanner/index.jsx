import React, { useState } from "react";
import { useCookies } from "react-cookie";
import cookieBannerContent from "../../data/content/cookieBanner.json";
import Button from "../Button";
import "./index.scss";

const AcceptCookies = ({ handleAgree, handleDisagree }) => (
  <div aria-label="Accept cookies" className="gp2gp-cookie-banner">
    <div className="nhsuk-width-container">
      <h2 className="nhsuk-heading-s">{cookieBannerContent.heading}</h2>
      <p>{cookieBannerContent.text1}</p>
      <p>{cookieBannerContent.text2}</p>
      <p>
        {cookieBannerContent.text3} You can{" "}
        <a href="#">read more about our cookies</a> before you choose.
      </p>
      <Button className="nhsuk-u-margin-right-4" onClick={handleAgree}>
        {cookieBannerContent.agreeButton}
      </Button>
      <Button onClick={handleDisagree}>
        {cookieBannerContent.disagreeButton}
      </Button>
    </div>
  </div>
);

const CookieBanner = () => {
  const [cookies, setCookie] = useCookies(["nhsuk-cookie-consent"]);
  const [isClicked, setIsClicked] = useState(false);

  const handleAgree = () => {
    setCookie("nhsuk-cookie-consent", "true");
    setIsClicked(true);
  };
  const handleDisagree = () => {
    setCookie("nhsuk-cookie-consent", "false");
    setIsClicked(true);
  };

  return (
    <>
      {isClicked && (
        <div className="gp2gp-success-banner">
          <div className="nhsuk-width-container">
            <p>
              You can change your cookie settings at any time using our{" "}
              <a href="#">cookies page</a>.
            </p>
          </div>
        </div>
      )}
      {!cookies["nhsuk-cookie-consent"] ? (
        <AcceptCookies
          handleAgree={handleAgree}
          handleDisagree={handleDisagree}
        />
      ) : null}
    </>
  );
};

export default CookieBanner;
