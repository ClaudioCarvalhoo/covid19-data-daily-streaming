import * as A from "../actions/actionTypes";

const initialState = {
  statePopulationLoading: false,
  statePopulation: {},
  connectionAlive: false,
  currentMonth: "",
  lastSevenDays_cases: [0, 0, 0, 0, 0, 0, 0],
  lastSevenDays_deaths: [0, 0, 0, 0, 0, 0, 0],
  lastSevenDays_newCases: [0, 0, 0, 0, 0, 0, 0],
  lastSevenDays_newDeaths: [0, 0, 0, 0, 0, 0, 0],
  rate_cases: 0,
  rate_deaths: 0,
  today_cases: 0,
  today_deaths: 0,
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
  const newCases = data.reports.BR.newCases;
  if (current_rate_cases === 0) {
    return newCases;
  } else {
    return Math.floor((newCases / current_rate_cases) * 100);
  }
}

function build_rate_deaths(data, current_rate_deaths) {
  const newDeaths = data.reports.BR.newDeaths;
  if (current_rate_deaths === 0) {
    return newDeaths;
  } else {
    return Math.floor((newDeaths / current_rate_deaths) * 100);
  }
}

function build_lastSevenDays_cases(data, current_lastSevenDays_cases) {
  if (current_lastSevenDays_cases.length >= 7) {
    current_lastSevenDays_cases.shift();
    current_lastSevenDays_cases.push(data.reports.BR.cases);
  } else {
    current_lastSevenDays_cases.push(data.reports.BR.cases);
  }
  return current_lastSevenDays_cases;
}

function build_lastSevenDays_deaths(data, current_lastSevenDays_deaths) {
  if (current_lastSevenDays_deaths.length >= 7) {
    current_lastSevenDays_deaths.shift();
    current_lastSevenDays_deaths.push(data.reports.BR.deaths);
  } else {
    current_lastSevenDays_deaths.push(data.reports.BR.deaths);
  }
  return current_lastSevenDays_deaths;
}

function build_lastSevenDays_newCases(data, current_lastSevenDays_newCases) {
  if (current_lastSevenDays_newCases.length >= 7) {
    current_lastSevenDays_newCases.shift();
    current_lastSevenDays_newCases.push(data.reports.BR.newCases);
  } else {
    current_lastSevenDays_newCases.push(data.reports.BR.newCases);
  }
  return current_lastSevenDays_newCases;
}
function build_lastSevenDays_newDeaths(data, current_lastSevenDays_newDeaths) {
  if (current_lastSevenDays_newDeaths.length >= 7) {
    current_lastSevenDays_newDeaths.shift();
    current_lastSevenDays_newDeaths.push(data.reports.BR.newDeaths);
  } else {
    current_lastSevenDays_newDeaths.push(data.reports.BR.newDeaths);
  }
  return current_lastSevenDays_newDeaths;
}
function build_month_cases(data, current_month_cases) {
  const month = data.date.split("-")[1];
  current_month_cases[parseInt(month) - 1] += data.reports.BR.newCases;
  return current_month_cases;
}

function build_month_deaths(data, current_month_deaths) {
  const month = data.date.split("-")[1];
  current_month_deaths[parseInt(month) - 1] += data.reports.BR.newDeaths;
  return current_month_deaths;
}

function buildStates(data) {
  return [
    [
      "AC",
      data.reports.AC.cases,
      data.reports.AC.deaths,
      data.reports.AC.newCases,
      data.reports.AC.newDeaths,
    ],
    [
      "AL",
      data.reports.AL.cases,
      data.reports.AL.deaths,
      data.reports.AL.newCases,
      data.reports.AL.newDeaths,
    ],
    [
      "AP",
      data.reports.AP.cases,
      data.reports.AP.deaths,
      data.reports.AP.newCases,
      data.reports.AP.newDeaths,
    ],
    [
      "AM",
      data.reports.AM.cases,
      data.reports.AM.deaths,
      data.reports.AM.newCases,
      data.reports.AM.newDeaths,
    ],
    [
      "BA",
      data.reports.BA.cases,
      data.reports.BA.deaths,
      data.reports.BA.newCases,
      data.reports.BA.newDeaths,
    ],
    [
      "CE",
      data.reports.CE.cases,
      data.reports.CE.deaths,
      data.reports.CE.newCases,
      data.reports.CE.newDeaths,
    ],
    [
      "GO",
      data.reports.GO.cases,
      data.reports.GO.deaths,
      data.reports.GO.newCases,
      data.reports.GO.newDeaths,
    ],
    [
      "MA",
      data.reports.MA.cases,
      data.reports.MA.deaths,
      data.reports.MA.newCases,
      data.reports.MA.newDeaths,
    ],
    [
      "MT",
      data.reports.MT.cases,
      data.reports.MT.deaths,
      data.reports.MT.newCases,
      data.reports.MT.newDeaths,
    ],
    [
      "MS",
      data.reports.MS.cases,
      data.reports.MS.deaths,
      data.reports.MS.newCases,
      data.reports.MS.newDeaths,
    ],
    [
      "MG",
      data.reports.MG.cases,
      data.reports.MG.deaths,
      data.reports.MG.newCases,
      data.reports.MG.newDeaths,
    ],
    [
      "PA",
      data.reports.PA.cases,
      data.reports.PA.deaths,
      data.reports.PA.newCases,
      data.reports.PA.newDeaths,
    ],
    [
      "PB",
      data.reports.PB.cases,
      data.reports.PB.deaths,
      data.reports.PB.newCases,
      data.reports.PB.newDeaths,
    ],
    [
      "PR",
      data.reports.PR.cases,
      data.reports.PR.deaths,
      data.reports.PR.newCases,
      data.reports.PR.newDeaths,
    ],
    [
      "PE",
      data.reports.PE.cases,
      data.reports.PE.deaths,
      data.reports.PE.newCases,
      data.reports.PE.newDeaths,
    ],
    [
      "PI",
      data.reports.PI.cases,
      data.reports.PI.deaths,
      data.reports.PI.newCases,
      data.reports.PI.newDeaths,
    ],
    [
      "RJ",
      data.reports.RJ.cases,
      data.reports.RJ.deaths,
      data.reports.RJ.newCases,
      data.reports.RJ.newDeaths,
    ],
    [
      "RN",
      data.reports.RN.cases,
      data.reports.RN.deaths,
      data.reports.RN.newCases,
      data.reports.RN.newDeaths,
    ],
    [
      "RS",
      data.reports.RS.cases,
      data.reports.RS.deaths,
      data.reports.RS.newCases,
      data.reports.RS.newDeaths,
    ],
    [
      "RO",
      data.reports.RO.cases,
      data.reports.RO.deaths,
      data.reports.RO.newCases,
      data.reports.RO.newDeaths,
    ],
    [
      "RR",
      data.reports.RR.cases,
      data.reports.RR.deaths,
      data.reports.RR.newCases,
      data.reports.RR.newDeaths,
    ],
    [
      "SC",
      data.reports.SC.cases,
      data.reports.SC.deaths,
      data.reports.SC.newCases,
      data.reports.SC.newDeaths,
    ],
    [
      "SP",
      data.reports.SP.cases,
      data.reports.SP.deaths,
      data.reports.SP.newCases,
      data.reports.SP.newDeaths,
    ],
    [
      "SE",
      data.reports.SE.cases,
      data.reports.SE.deaths,
      data.reports.SE.newCases,
      data.reports.SE.newDeaths,
    ],
    [
      "TO",
      data.reports.TO.cases,
      data.reports.TO.deaths,
      data.reports.TO.newCases,
      data.reports.TO.newDeaths,
    ],
  ];
}

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
        today_cases: action.data.reports.BR.newCases,
        today_deaths: action.data.reports.BR.newDeaths,
        lastSevenDays_cases: build_lastSevenDays_cases(
          action.data,
          state.lastSevenDays_cases
        ),
        lastSevenDays_deaths: build_lastSevenDays_deaths(
          action.data,
          state.lastSevenDays_deaths
        ),
        lastSevenDays_newCases: build_lastSevenDays_newCases(
          action.data,
          state.lastSevenDays_newCases
        ),
        lastSevenDays_newDeaths: build_lastSevenDays_newDeaths(
          action.data,
          state.lastSevenDays_newDeaths
        ),
        months_cases: build_month_cases(action.data, state.months_cases),
        months_deaths: build_month_deaths(action.data, state.months_deaths),
        daysSinceStarted: state.daysSinceStarted + 1,
        states: buildStates(action.data),
        timeLastUpdated: new Date(Date.now()),
      };
    case A.FETCH_STATE_POPULATION_START:
      return { ...state, statePopulationLoading: true };
    case A.FETCH_STATE_POPULATION_SUCCESS:
      return {
        ...state,
        statePopulationLoading: false,
        statePopulation: action.statePopulation,
      };
    default:
      return state;
  }
};

export default reducer;
