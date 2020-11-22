// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import React from "react";
import { useSelector } from "react-redux";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import interpolate from "color-interpolate";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  const geoUrl =
    "https://gist.githubusercontent.com/ruliana/1ccaaab05ea113b0dff3b22be3b4d637/raw/196c0332d38cb935cfca227d28f7cecfa70b412e/br-states.json";
  const data = useSelector((state) => state.dashboard);
  let colormap = interpolate([
    "#393A3C",
    "#5D5F5C",
    "#F07249",
    "#D22C2C",
    "#6E1B09",
  ]);
  function makeFillForState(state_acro) {
    let n = 10;
    return colormap(n / 1200000);
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Mapa ao vivo</h4>
              <p className={classes.cardCategoryWhite}>
                Percentual de casos por população de cada estado
              </p>
            </CardHeader>
            <CardBody>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  rotate: [54.0, 14.0, 0],
                  scale: 900,
                }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={makeFillForState(geo.id)}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
