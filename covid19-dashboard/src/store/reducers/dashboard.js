import * as A from "../actions/actionTypes";

const initialState = {
  connectionAlive: false,
  currentMonth: "",
  lastSevenDays_cases: [0, 0, 0, 0, 0, 0, 0],
  rate_cases: 0,
  rate_deaths: 0,
  today_cases: 0,
  today_deaths: 0,
  lastSevenDays_deaths: [0, 0, 0, 0, 0, 0, 0],
  months_cases: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  months_deaths: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  daysSinceStarted: 0,
  states: [
    ["AC", "0", "0", "0", "0"],
    ["AL", "0", "0", "0", "0"],
    ["AP", "0", "0", "0", "0"],
    ["AM", "0", "0", "0", "0"],
    ["BA", "0", "0", "0", "0"],
    ["CE", "0", "0", "0", "0"],
    ["DF", "0", "0", "0", "0"],
    ["ES", "0", "0", "0", "0"],
    ["GO", "0", "0", "0", "0"],
    ["MA", "0", "0", "0", "0"],
    ["MT", "0", "0", "0", "0"],
    ["MS", "0", "0", "0", "0"],
    ["MG", "0", "0", "0", "0"],
    ["PA", "0", "0", "0", "0"],
    ["PB", "0", "0", "0", "0"],
    ["PR", "0", "0", "0", "0"],
    ["PE", "0", "0", "0", "0"],
    ["PI", "0", "0", "0", "0"],
    ["RJ", "0", "0", "0", "0"],
    ["RN", "0", "0", "0", "0"],
    ["RS", "0", "0", "0", "0"],
    ["RO", "0", "0", "0", "0"],
    ["RR", "0", "0", "0", "0"],
    ["SC", "0", "0", "0", "0"],
    ["SP", "0", "0", "0", "0"],
    ["SE", "0", "0", "0", "0"],
    ["TO", "0", "0", "0", "0"],
  ],
  timeLastUpdated: 0,
  data: {},
};

function build_rate_cases(data, current_rate_cases) {
  const newCases = data.report.BR.new_cases;
  if (current_rate_cases == 0) {
    return newCases;
  } else {
    return (newCases / current_rate_cases) * 100;
  }
}

function build_rate_deaths(data, current_rate_deaths) {
  const newDeaths = data.report.BR.new_deaths;
  if (current_rate_deaths == 0) {
    return newDeaths;
  } else {
    return (newDeaths / current_rate_deaths) * 100;
  }
}

function build_lastSevenDays_cases(data, current_lastSevenDays_cases) {
  if (current_lastSevenDays_cases.length >= 7) {
    current_lastSevenDays_cases.shift();
    current_lastSevenDays_cases.push(data.report.BR.cases);
  } else {
    current_lastSevenDays_cases.push(data.report.BR.cases);
  }
  return current_lastSevenDays_cases;
}

function build_lastSevenDays_deaths(data, current_lastSevenDays_deaths) {
  if (current_lastSevenDays_deaths.length >= 7) {
    current_lastSevenDays_deaths.shift();
    current_lastSevenDays_deaths.push(data.report.BR.deaths);
  } else {
    current_lastSevenDays_deaths.push(data.report.BR.deaths);
  }
  return current_lastSevenDays_deaths;
}

function build_month_cases(data, current_month_cases) {
  const month = data.date.split("-")[1];
  current_month_cases[month] += data.report.BR.cases;
  return current_month_cases;
}

function build_month_deaths(data, current_month_deaths) {
  const month = data.date.split("-")[1];
  current_month_deaths[month] += data.report.BR.deaths;
  return current_month_deaths;
}

function buildStates(data, currentStates) {}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case A.FETCH_STREAM_DATA_START:
      return { ...state, connectionAlive: true };
    case A.FETCH_STREAM_DATA_ARRIVED:
      return {
        ...state,
        data: action.data,
        currentMonth: action.data.date.split("-")[1],
        rate_cases: build_rate_cases(action.data, state.rate_cases),
        rate_deaths: build_rate_deaths(action.data, state.rate_deaths),
        today_cases: action.data.report.BR.new_cases,
        today_deaths: action.data.report.BR.new_deaths,
        lastSevenDays_cases: build_lastSevenDays_cases(
          action.data,
          state.lastSevenDays_cases
        ),
        lastSevenDays_deaths: build_lastSevenDays_deaths(
          action.data,
          state.lastSevenDays_deaths
        ),
        months_cases: build_month_cases(action.data, state.months_cases),
        months_deaths: build_month_deaths(action.data, state.months_deaths),
        daysSinceStarted: state.days_since_started + 1,
        states: buildStates(action.data, state.states),
        timeLastUpdated: new Date(Date.now()),
      };
    default:
      return state;
  }
};

export default reducer;
