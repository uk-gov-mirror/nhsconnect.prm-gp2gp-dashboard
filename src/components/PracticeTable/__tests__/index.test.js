import React from "react";
import { render } from "@testing-library/react";
import PracticeTable from "../index";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";

describe("PracticeTable component", () => {
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
            requester: {
              timeToIntegrateSla: {
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
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    expect(getByText("GP Practice | A12345")).toBeInTheDocument();
    expect(getByText("GP Practice 2 | B12345")).toBeInTheDocument();
  });

  it("filters out invalid practices", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "B12345", Name: "GP Practice 2" },
    ];

    const { queryByText, getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("GP Practice | A12345")).toBeInTheDocument();
    expect(queryByText("GP Practice 2 | B12345")).not.toBeInTheDocument();
  });

  it("displays a message if there are no valid practices", () => {
    const ccgPractices = [{ OrgId: "B12345", Name: "GP Practice 2" }];
    const validPractices = [{ odsCode: "A12345", name: "GP Practice" }];

    const { getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    expect(getByText("No GP practices found")).toBeInTheDocument();
  });

  it("displays table headers", () => {
    const ccgPractices = [{ OrgId: "A12345", Name: "GP Practice" }];

    const { getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("Practice name")).toBeInTheDocument();
    expect(getByText("Within 3 days")).toBeInTheDocument();
    expect(getByText("Within 8 days")).toBeInTheDocument();
    expect(getByText("Beyond 8 day target")).toBeInTheDocument();
  });
});
