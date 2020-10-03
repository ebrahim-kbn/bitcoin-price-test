import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";

// define diffrent colors for simplicity changing colors
export const colorsType = {
  max: "rgba(35, 170, 119,1)",
  maxHover: "rgba(35, 170, 119,.5)",
  min: "rgba(242, 21, 21,1)",
  minHover: "rgba(242, 21, 21,.5)",
  ave: "rgb(229, 222, 11)",
  aveHover: "rgba(229, 222, 11,.5)",
};

// use Material-Ui for making Radio buttons
export const GreenRadio = withStyles({
  root: {
    color: colorsType.max,
    padding: 1,
    "&$checked": {
      color: colorsType.max,
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);
export const YellowRadio = withStyles({
  root: {
    color: colorsType.ave,
    padding: 1,
    "&$checked": {
      color: colorsType.ave,
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

export const RedRadio = withStyles({
  root: {
    color: colorsType.min,
    padding: 1,
    "&$checked": {
      color: colorsType.min,
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

// find minimum and maximum value of array with their index
export function findMinMaxRange(values) {
  let diff = [];
  for (let index = 1; index < values.length; index++) {
    diff.push(Math.abs(values[index] - values[index - 1]));
  }
  let sortedDiff = [...diff].sort((a, b) => a - b);
  const maxRange = sortedDiff[diff.length - 1];
  const minRange = sortedDiff[0];
  const maxIndex = diff.indexOf(maxRange);
  const minIndex = diff.indexOf(minRange);
  return {
    maxRange,
    minRange,
    maxIndex,
    minIndex,
  };
}
// format time data in hr:min
export const formatTimeData = (times) => {
  return times.map((tc) => {
    let d = new Date(tc);
    return `${d.getHours()}:${d.getMinutes()}`;
  });
};

// sort an array in descending format
export const sortData = (arrayData) => {
  return [...arrayData].sort((a, b) => a - b);
};
