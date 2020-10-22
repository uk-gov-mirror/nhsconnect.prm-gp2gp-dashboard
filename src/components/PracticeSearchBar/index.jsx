import React, { useState } from "react";
import Autosuggest from "react-autosuggest";

import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";
import Input from "../Input";
import "./index.scss";

const PracticeSearchBar = ({
  inputError,
  setInputValue,
  testid,
  inputLabelText,
  renderSuggestion,
  getSuggestionValue,
  search,
}) => {
  const newSearch = useFeatureToggle("F_PRACTICE_NAME_SEARCH");
  const [autosuggestValue, setAutosuggestValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(search.search(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    value: autosuggestValue,
    onChange: (_, { newValue }) => {
      setAutosuggestValue(newValue);
    },
  };

  return (
    <label date-testid={`${testid}-label`}>
      <span className="nhsuk-hint" data-testid={`${testid}-hint`}>
        {inputLabelText}
      </span>
      {inputError && (
        <span
          className="nhsuk-error-message"
          data-testid={`${testid}-error`}
          role="alert"
        >
          {inputError}
        </span>
      )}
      {newSearch ? (
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      ) : (
        <Input
          error={inputError}
          className="nhsuk-input--width-10"
          testid={testid}
          onChange={e => setInputValue(e.currentTarget.value)}
        />
      )}
    </label>
  );
};

export default PracticeSearchBar;
