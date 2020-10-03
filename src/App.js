import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import {
  colorsType,
  findMinMaxRange,
  GreenRadio,
  RedRadio,
  YellowRadio,
} from "./utils";
import BarGraphPrice from "./BarGraphPrice";
import BarGraphVolume from "./BarGraphVolume";

function App() {
  const [showHigherValue, setShowHigherValue] = useState(true);
  const [showMinValue, setShowMinValue] = useState(true);
  const [showAveValue, setShowAveValue] = useState(true);

  const [maxValues, setMaxValues] = useState([
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
    100,
  ]);
  const [minValues, setMinValues] = useState([
    70,
    80,
    65,
    45,
    78,
    78,
    89,
    45,
    35,
    78,
  ]);
  const [aveValues, setAveValues] = useState([
    88,
    67,
    89,
    79,
    79,
    98,
    67,
    88,
    77,
    66,
  ]);
  const [timeValues, setTimeValues] = useState([
    88,
    67,
    89,
    79,
    79,
    98,
    67,
    88,
    77,
    66,
  ]);

  //sending request
  function fetchData() {
    axios
      .get(
        "https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=9"
      )
      .then((res) => {
        console.log("server data", res.data);
        const timeData = res.data.Data.Data.map((item) => item.time * 1000);
        const highValues = res.data.Data.Data.map((item) => item.high);
        const lowValues = res.data.Data.Data.map((item) => item.low);
        const averageValues = res.data.Data.Data.map(
          (item) => (item.high + item.low) / 2
        );

        setTimeValues(timeData);
        setMaxValues(highValues);
        setMinValues(lowValues);
        setAveValues(averageValues);

        localStorage.setItem(
          "priceData",
          JSON.stringify({
            time: Date.now(),
            timeData,
            highValues,
            lowValues,
            averageValues,
          })
        );
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (localStorage.getItem("priceData")) {
      const priceData = JSON.parse(localStorage.getItem("priceData"));
      const {
        time,
        timeData,
        highValues,
        lowValues,
        averageValues,
      } = priceData;
      const cuurentTime = Date.now();
      if (cuurentTime - time < 120000) {
        console.log("cached data", priceData);
        setTimeValues(timeData);
        setMaxValues(highValues);
        setMinValues(lowValues);
        setAveValues(averageValues);
      } else {
        fetchData();
      }
    } else {
      fetchData();
    }
    return () => {};
  }, []);

  let timeConstanst = timeValues.map((tc) => {
    let d = new Date(tc);
    return `${d.getHours()}:${d.getMinutes()}`;
  });
  const minMaxRange = findMinMaxRange(maxValues);
  return (
    <div className="app">
      <div className="app__top">
        <div className="graph__container__volume">
          <BarGraphVolume />
        </div>
        <div className="graph__container__price">
          <BarGraphPrice
            showHigherValue={showHigherValue}
            setShowHigherValue={setShowHigherValue}
            showMinValue={showMinValue}
            setShowMinValue={setShowMinValue}
            showAveValue={showAveValue}
            setShowAveValue={setShowAveValue}
            maxValues={maxValues}
            minValues={minValues}
            aveValues={aveValues}
            timeValues={timeValues}
          />
        </div>
      </div>

      <div className="app__bottom">
        <h3>Indexes</h3>
        <div className="graph__container__index">
          <div className="graph__container__index__select">
            <div className="graph__container__index__select__option">
              <GreenRadio
                checked={showHigherValue}
                onChange={() => setShowHigherValue(!showHigherValue)}
                name="radio-button-higher"
                inputProps={{ "aria-label": `111` }}
                onClick={() => setShowHigherValue(!showHigherValue)}
              />
              Higher
            </div>
            <div className="graph__container__index__select__option">
              <YellowRadio
                checked={showAveValue}
                onChange={() => setShowAveValue(!showAveValue)}
                name="radio-button-ave"
                inputProps={{ "aria-label": `112` }}
                onClick={() => setShowAveValue(!showAveValue)}
              />
              Average
            </div>
            <div className="graph__container__index__select__option">
              <RedRadio
                checked={showMinValue}
                onChange={() => setShowMinValue(!showMinValue)}
                onClick={() => setShowMinValue(!showMinValue)}
                name="radio-button-red"
                inputProps={{ "aria-label": `113` }}
              />
              Lower
            </div>
          </div>
          <div
            className="graph__container__index__info"
            style={{ color: colorsType.min }}
          >
            <h5>Maximum range:</h5>
            <h5>
              {timeConstanst[minMaxRange.maxIndex]} to{" "}
              {timeConstanst[minMaxRange.maxIndex + 1]}
            </h5>
          </div>
          <div
            className="graph__container__index__info"
            style={{ color: colorsType.max }}
          >
            <h5>Minimum range:</h5>
            <h5>
              {timeConstanst[minMaxRange.minIndex]} to{" "}
              {timeConstanst[minMaxRange.minIndex + 1]}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
