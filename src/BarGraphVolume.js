import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import numeral from "numeral";
import "./BarGraphVolume.css";
import { colorsType, GreenRadio, sortData } from "./utils";

//make an array of length fa-rotate-180
const indexArray = [...Array(10).keys()];

const BarGraphVolume = () => {
  const [aveVolumes, setAveVolumes] = useState([
    30,
    40,
    10,
    30,
    56,
    35,
    57,
    98,
    100,
    40,
  ]);
  const [timeValues, setTimeValues] = useState([
    30,
    40,
    10,
    30,
    56,
    35,
    57,
    98,
    100,
    40,
  ]);

  let timeConstanst = timeValues.map((tc) => {
    let d = new Date(tc);
    return `${d.getHours()}:${d.getMinutes()}`;
  });
  const [index, setIndex] = useState(aveVolumes.length - 1);
  const sortedVolumes = sortData(aveVolumes);
  const maxVolume = sortedVolumes[aveVolumes.length - 1];
  //const minVolume = sortedVolumes[0];

  function fetchData() {
    fetch(
      "https://min-api.cryptocompare.com/data/exchange/histohour?tsym=BTC&limit=9"
    )
      .then((res) => res.json())
      .then((res) => {
        console.log("server data", res.Data);
        const timeData = res.Data.map((item) => item.time * 1000);
        const volumeData = res.Data.map((item) => item.volume);
        setTimeValues(timeData);
        setAveVolumes(volumeData);
        localStorage.setItem(
          "marketVolume",
          JSON.stringify({ time: Date.now(), timeData, volumeData })
        );
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (localStorage.getItem("marketVolume")) {
      const marketVolume = JSON.parse(localStorage.getItem("marketVolume"));
      const { time, timeData, volumeData } = marketVolume;
      const cuurentTime = Date.now();
      if (cuurentTime - time < 120000) {
        console.log("cache", marketVolume);
        setTimeValues(timeData);
        setAveVolumes(volumeData);
      } else {
        fetchData();
      }
    } else {
      fetchData();
    }

    return () => {};
  }, []);
  return (
    <div className="barGraphVolume">
      <Bar
        width={20}
        height={18}
        data={{
          datasets: [
            {
              categoryPercentage: 0.1,
              barPercentage: 0.6,
              label: `Market valume of ${timeConstanst[index]}`,
              backgroundColor: colorsType.max,
              borderColor: colorsType.max,
              borderWidth: 1,
              hoverBackgroundColor: colorsType.maxHover,
              hoverBorderColor: colorsType.maxHover,
              data: [aveVolumes[index]],
            },
          ],
        }}
        options={{
          legend: {
            onClick: function () {
              return;
            },
            labels: {
              boxWidth: 0,
              fontSize: 15,
              fontStyle: "bold",
            },
          },
          tooltips: {
            displayColors: false,

            callbacks: {
              title: function (tooltipItem, data) {
                //console.log(tooltipItem);
                //console.log(data);
                return (
                  "Market valume: " +
                  numeral(tooltipItem[0].value).format("0,0.00")
                );
              },
              label: function (tooltipItem, data) {
                return "";
              },
            },
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  max: Math.round(maxVolume * 1.01),
                  beginAtZero: true,
                  stepSize: Math.round(maxVolume / 3),
                },
              },
            ],
          },
        }}
      />
      <div className="map-footer">
        {indexArray.map((idx) => (
          <GreenRadio
            key={idx}
            checked={index === idx}
            onChange={() => setIndex(idx)}
            name="radio-button-demo"
            inputProps={{ "aria-label": `${idx}` }}
            size="small"
          />
        ))}
      </div>
    </div>
  );
};

export default BarGraphVolume;
