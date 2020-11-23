import * as A from "./actionTypes";

export const fetchStreamDataStart = () => {
  return {
    type: A.FETCH_STREAM_DATA_START,
  };
};

export const streamDataArrived = (data) => {
  return {
    type: A.FETCH_STREAM_DATA_ARRIVED,
    data: data,
  };
};

export const fetchStatePopulationStart = () => {
  return {
    type: A.FETCH_STATE_POPULATION_START,
  };
};

export const fetchStatePopulationSuccess = (data) => {
  return {
    type: A.FETCH_STATE_POPULATION_SUCCESS,
    statePopulation: data,
  };
};

export const fetchRetroativeDataStart = () => {
  return {
    type: A.FETCH_RETROATIVE_DATA_START,
  };
};

export const fetchRetroativeDataSuccess = (response) => {
  console.log(response);
  return {
    type: A.FETCH_RETROATIVE_DATA_SUCCESS,
    retroativeData: response,
  };
};

export const fetchRetroativeDataFail = () => {
  return {
    type: A.FETCH_RETROATIVE_DATA_FAIL,
  };
};

let oneTime = false;
export const fetchStreamData = () => {
  return (dispatch) => {
    dispatch(fetchStreamDataStart());
    const source = new EventSource("http://localhost:9090");
    console.log("listening");
    source.onmessage = (event) => {
      let data = JSON.parse(event.data);
      console.log(data);
      dispatch(streamDataArrived(data));
      if (!oneTime) {
        dispatch(fetchRetroativeData(data.date));
        oneTime = true;
      }
    };

    source.onerror = () => {
      console.log("error");
    };
  };
};

export const fetchStatePopulation = () => {
  return (dispatch) => {
    dispatch(fetchStatePopulationStart());
    fetch("http://localhost:8080/states")
      .then((response) => {
        response.json().then((res) => {
          console.log(res);
          dispatch(fetchStatePopulationSuccess(res));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const fetchRetroativeData = (date) => {
  return (dispatch) => {
    dispatch(fetchRetroativeDataStart());
    let url = new URL("http://localhost:8080/months-report");
    url.search = new URLSearchParams({
      date: date,
    });
    fetch(url)
      .then((response) => {
        response.json().then((res) => {
          dispatch(fetchRetroativeDataSuccess(res));
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(fetchRetroativeDataFail());
      });
  };
};
