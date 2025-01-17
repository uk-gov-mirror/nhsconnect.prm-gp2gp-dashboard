import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CcgPageContent } from "../";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";

describe("CcgPageContent component", () => {
  it("displays multiple valid practices", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "B12345", Name: "GP Practice 2" },
    ];
    const validPractices = [
      ...practiceMetricsMock,
      {
        odsCode: "B12345",
        name: "GP Practice 2",
        metrics: [
          {
            year: 2020,
            month: 1,
            requester: {
              integrated: {
                transferCount: 7,
                within3Days: 0,
                within8Days: 2,
                beyond8Days: 5,
                within3DaysPercentage: 0,
                within8DaysPercentage: 28.6,
                beyond8DaysPercentage: 71.4,
              },
            },
          },
        ],
      },
    ];

    const { getByText, getAllByRole } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    const allRows = getAllByRole("row");

    expect(getByText("GP Practice | A12345")).toBeInTheDocument();
    expect(getByText("GP Practice 2 | B12345")).toBeInTheDocument();
    expect(allRows[1]).toHaveTextContent("Successful integrations 7");
    expect(allRows[1]).toHaveTextContent("Within 3 days 0%");
    expect(allRows[1]).toHaveTextContent("Within 8 days 28.6%");
    expect(allRows[1]).toHaveTextContent("Beyond 8 days 71.4%");
  });

  it("filters out invalid practices", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "B12345", Name: "GP Practice 2" },
    ];

    const { queryByText, getByText } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("GP Practice | A12345")).toBeInTheDocument();
    expect(queryByText("GP Practice 2 | B12345")).not.toBeInTheDocument();
  });

  it("should display table heading with the month and year", () => {
    const ccgPractice = [{ OrgId: "B12345", Name: "GP Practice 2" }];

    const aPractice = [
      {
        odsCode: "B12345",
        name: "GP Practice 2",
        metrics: [
          {
            year: 2000,
            month: 2,
            requester: {
              integrated: {
                transferCount: 7,
                within3DaysPercentage: 0,
                within8DaysPercentage: 28.6,
                beyond8DaysPercentage: 71.4,
                within3Days: 0,
                within8Days: 2,
                beyond8Days: 5,
              },
            },
          },
        ],
      },
    ];

    const { getByText } = render(
      <CcgPageContent ccgPractices={ccgPractice} validPractices={aPractice} />
    );

    expect(
      getByText("Practice performance for February 2000")
    ).toBeInTheDocument();
  });

  it("displays a message if there are no valid practices", () => {
    const ccgPractices = [{ OrgId: "A12360", Name: "GP Practice" }];

    const { getByText } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("No GP practices found")).toBeInTheDocument();
  });

  it("displays practices ordered by Beyond 8 day Percentage SLA", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "A12346", Name: "Second GP Practice" },
      { OrgId: "A12347", Name: "Third GP Practice" },
      { OrgId: "A12348", Name: "Fourth GP Practice" },
      { OrgId: "A12349", Name: "Fifth GP Practice" },
      { OrgId: "A12350", Name: "Sixth GP Practice" },
    ];

    const { getAllByRole } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    const allRows = getAllByRole("row");

    expect(allRows[1]).toHaveTextContent("Beyond 8 days 47.6%");
    expect(allRows[2]).toHaveTextContent("Beyond 8 days 25%");
    expect(allRows[3]).toHaveTextContent("Beyond 8 days 8.8%");
    expect(allRows[4]).toHaveTextContent("Beyond 8 days 0%");
    expect(allRows[5]).toHaveTextContent("Beyond 8 days 0%");
    expect(allRows[6]).toHaveTextContent("Beyond 8 days n/a");
    expect(allRows.length).toBe(7);
  });

  it("navigates to a practice page when a link is clicked", () => {
    const ccgPractices = [{ OrgId: "A12345", Name: "GP Practice" }];

    const { getByRole } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    const practicePageLink = getByRole("link", {
      name: "GP Practice | A12345",
    });

    expect(practicePageLink.getAttribute("href")).toBe("/practice/A12345");
  });

  it("displays CCG 'About this data' header correctly", () => {
    const ccgPractices = [{ OrgId: "A12345", Name: "GP Practice" }];

    const { getByText } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("About this data")).toBeInTheDocument();
  });

  it("should display expander with the correct content", () => {
    const ccgPractices = [{ OrgId: "A12345", Name: "GP Practice" }];

    const { getByText } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    const expanderTitle = getByText("Why integrate within 8 days?");
    const expanderContent = getByText(
      "This increases the burden on both the sending and receiving",
      { exact: false }
    );
    expect(expanderTitle).toBeInTheDocument();
    expect(expanderContent).not.toBeVisible();

    userEvent.click(expanderTitle);
    expect(expanderContent).toBeVisible();
  });

  it("does not display 'About this data' and 8 Day SLA expander when there are no GP practices", () => {
    const ccgPractices = [{ OrgId: "A12360", Name: "GP Practice" }];

    const { getByText, queryByText } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("No GP practices found")).toBeInTheDocument();
    expect(queryByText("About this data")).not.toBeInTheDocument();

    const expanderTitle = "Why integrate within 8 days?";
    const expanderContent =
      "This increases the burden on both the sending and receiving";
    expect(queryByText(expanderTitle)).not.toBeInTheDocument();
    expect(queryByText(expanderContent)).not.toBeInTheDocument();
  });
});
