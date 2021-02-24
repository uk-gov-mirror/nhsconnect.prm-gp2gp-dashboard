import React, { FC } from "react";
import EmphasisBox from "../EmphasisBox";
import feedbackBannerContent from "../../data/content/feedbackBanner.json";

const FeedbackBanner: FC = () => (
  <EmphasisBox title={feedbackBannerContent.title}>
    <p>
      {feedbackBannerContent.text1}
      <a href={feedbackBannerContent.linkUrl}>
        {feedbackBannerContent.linkText}
      </a>
      {feedbackBannerContent.text2}
    </p>
  </EmphasisBox>
);
export default FeedbackBanner;