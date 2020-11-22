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
    statePopulaion: data,
  };
};

export const fetchStreamData = () => {
  return (dispatch) => {
    dispatch(fetchStreamDataStart());
    const source = new EventSource("http://localhost:9090");
    console.log("listening");
    source.onmessage = (event) => {
      console.log(JSON.parse(event.data));
      dispatch(streamDataArrived(JSON.parse(event.data)));
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
        console.log(response);
        dispatch(fetchStatePopulationSuccess(response));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
