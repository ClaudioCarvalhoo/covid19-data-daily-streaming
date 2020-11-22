import * as A from "./actionTypes";
import * as actions from "./index";

export const fetchStreamDataStart = () => {
  return {
    type: A.FETCH_STREAM_DATA_START,
  };
};

export const streamDataArrived = (data) => {
  return {
    type: A.FETCH_STREAM_DATE_ARRIVED,
    data: data,
  };
};

export const fetchStreamData = () => {
  return (dispatch) => {
    dispatch(fetchStreamData());
    const source = new EventSource("http://localhost:9090");
    source.onmessage = (event) => {
      dispatch(streamDataArrived(event));
    };
  };
};
