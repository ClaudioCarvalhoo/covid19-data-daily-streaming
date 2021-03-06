// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import CardHeader from 'components/Card/CardHeader.js';
import GridContainer from 'components/Grid/GridContainer.js';
// core components
import GridItem from 'components/Grid/GridItem.js';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import interpolate from 'color-interpolate';
import ReactTooltip from 'react-tooltip';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
};

const useStyles = makeStyles(styles);

export default function Livemap() {
  const classes = useStyles();
  const geoUrl =
    'https://gist.githubusercontent.com/ruliana/1ccaaab05ea113b0dff3b22be3b4d637/raw/196c0332d38cb935cfca227d28f7cecfa70b412e/br-states.json';

  const [content, setContent] = useState('');
  const [selectedOption, setSelectedOption] = useState('casos');

  const data = useSelector(state => state.dashboard);

  console.log(data.statePopulation);

  console.log(data);
  let colormap = interpolate([
    '#FED3C4',
    '#FEACA3',
    '#FE9388',
    '#A80100',
    '#530103',
  ]);

  function makeFillForState(state_acro) {
    let n = 10;

    if (selectedOption === 'casos') {
      n = data.data.reports ? data.data.reports[state_acro].cases : 10;
      return colormap(n / 1000000);
    }
    if (selectedOption === 'mortes') {
      n = data.data.reports ? data.data.reports[state_acro].deaths : 10;
      return colormap(n / 100000);
    }

    if (selectedOption === 'casos-proporcional') {
      n =
        data.data.reports && data.statePopulation[state_acro]
          ? data.data.reports[state_acro].cases /
            data.statePopulation[state_acro].population
          : 0;
      return colormap(n * 10);
    }

    if (selectedOption === 'mortes-por-caso') {
      n = data.data.reports
        ? data.data.reports[state_acro].deaths /
          data.data.reports[state_acro].cases
        : 0;
      return colormap(n * 7 || 0);
    }

    if (selectedOption === 'mortes-proporcional') {
      n =
        data.data.reports && data.statePopulation[state_acro]
          ? data.data.reports[state_acro].deaths /
            data.statePopulation[state_acro].population
          : 0;
      return colormap(n * 500);
    }
    return colormap(n / 1000000);
  }

  function makeContentForState(state_acro) {
    let name = state_acro;
    let cases = data.data.reports ? data.data.reports[state_acro].cases : '';
    let deaths = data.data.reports ? data.data.reports[state_acro].deaths : '';
    let pop = data.statePopulation[state_acro]
      ? data.statePopulation[state_acro].population
      : '';
    setContent(
      `${name}\n Cases: ${cases}\n Deaths: ${deaths} Population: ${pop}`
    );
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color='primary'>
              <h4 className={classes.cardTitleWhite}>Mapa ao vivo</h4>
              <p className={classes.cardCategoryWhite}>
                Percentual de casos por população de cada estado
              </p>
            </CardHeader>
            <CardBody>
              <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={selectedOption}
                  onChange={event => {
                    setSelectedOption(event.target.value);
                  }}
                  label='Tipo'
                >
                  <MenuItem value={'casos'}>Casos</MenuItem>
                  <MenuItem value={'mortes'}>Mortes</MenuItem>
                  <MenuItem value={'casos-proporcional'}>
                    Casos Proporcional
                  </MenuItem>
                  <MenuItem value={'mortes-proporcional'}>
                    Mortes Proporcional
                  </MenuItem>
                  <MenuItem value='mortes-por-caso'>Mortes por Caso</MenuItem>
                </Select>
              </FormControl>
              <ComposableMap
                data-tip=''
                projection='geoMercator'
                projectionConfig={{
                  rotate: [54.0, 14.0, 0],
                  scale: 900,
                }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map(geo => {
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={makeFillForState(geo.id)}
                          onMouseEnter={() => {
                            makeContentForState(geo.id);
                          }}
                          onMouseLeave={() => {
                            setContent('');
                          }}
                          style={{
                            hover: { fill: '#F53', outline: '#333 4px' },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </CardBody>
            <CardFooter>
              <ReactTooltip>{content}</ReactTooltip>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
