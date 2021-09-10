import React from "react";
import "./TopSearch.scss";
import searchico from "../../../../assets/images/search_magnifier.svg";
import fetch from "cross-fetch";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";
import { useTheme } from "../../ContextHooks/ThemeProvider";
import UserAvatar from "./UserAvatar/UserAvatar";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const TopSearch = (props) => {
  //useThemeDisabledContext,
  //const diabledMode = useThemeDisabledContext();
  const diabledMode = true;
  const darkMode = useTheme();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await fetch("");
      ////opentdb.com/api.php?amount=50
      await sleep(1e3); // For demo purposes.
      const countries = await response.json();
      // const util = require("util");

      if (active) {
        setOptions(countries.results);

        // setOptions(Object.keys(name).map((key) => name.data.AF.country));
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  let history = useHistory();
  function NavigateToPage(value) {
    history.push("/home/topics/" + value);
  }

  return (
    <>
      <div>
        <div
          className={`top_search_wrapper ${
            darkMode === true ? "dark_mode" : ""
          }`}
        >
          <UserAvatar />
          <div className="search_bar_inner">
            <div className="field_wrapper d-flex mb-4">
              <div
                className="left_ico"
                style={diabledMode === true ? { pointerEvents: "none" } : {}}
              >
                <img src={searchico} alt="Searchbar Icon" />
              </div>
              <div
                className="fields_wrapper_design w-100"
                style={diabledMode === true ? { pointerEvents: "none" } : {}}
              >
                <Autocomplete
                  onChange={(event, value) =>
                    NavigateToPage(
                      value !== null ? value.question : history.goBack()
                    )
                  }
                  id="asynchronous-demo"
                  // style={{ width: 300 }}
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  getOptionSelected={(option, value) =>
                    option.category === value.category
                  }
                  getOptionLabel={(option) => option.category}
                  options={options}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search topic, syllabus, test questions"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TopSearch;
