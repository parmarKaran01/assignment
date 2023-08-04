import { useCallback, useMemo, useState } from "react";
import "./App.css";
import Highcharts, { dateFormat } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { messageCountList, channels } from "./helper";

const engagementMessageOverTimeChartOptions = (messageCountList, channels) => {
  //defining map that contains the id as the key and the array of objects that has the same key from the messageList
  //since we know the timestamp must be unique for unique channelId
  const map = {};
  let finalKeys = [];
  console.log("running");
  messageCountList.map((item) => {
    //checking if the map already has the id if not then we add the id and add the object
    if (!map[item.channelId]) {
      map[item.channelId] = {
        occur: [item],
      };
    } else {
      map[item.channelId].occur.push(item);
    }
  });

  //adding the keys of the object that has messages on more than one dates
  Object.entries(map).filter(([key, val], i) => {
    if (val.occur.length > 1) {
      finalKeys.push(key);
    }
  });

  //calculating the final series data using the ids and map created
  const seriesData = finalKeys.map((key) => {
    //this is the data array calculated for the individual id
    const cald = map[key].occur.map((val) => [
      new Date(val.timeBucket).getTime(),
      parseInt(val.count),
    ]);
    return {
      name: channels.find((item) => item.id === key)?.name
        ? channels.find((item) => item.id === key)?.name
        : "not defined",
      data: cald,
    };
  });

  //returning the options
  return {
    chart: {
      backgroundColor: "rgb(35,35,44)",
      type: "spline",
      height: "350px",
      style: {
        color: "white",
      },
    },
    credits: {
      enabled: false,
    },
    colors: ["rgb(0, 141,143)"],
    xAxis: {
      type: "datetime",
      gridLineWidth: 0,
      tickInterval: 24 * 3600 * 1000,
      style: {
        color: "white",
      },
      labels: {
        style: {
          color: "white",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      tickInterval: 1,
      gridLineWidth: 0,
      labels: {
        style: {
          color: "white",
        },
      },
    },
    title: {
      text: "Mercle Assignment",
      style: {
        color: "white",
      },
    },
    plotOptions: {
      series: {
        lineWidth: 2,
        marker: {
          enabled: false,
        },
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.point.name;
          },
        },
      },
    },
    series: seriesData,
    tooltip: {
      backgroundColor: "rgb(35,35,44)",
      borderColor: "rgb(0, 141,143)",
      borderRadius: 10,
      borderWidth: 1,
      style: {
        color: "white",
      },

      formatter: function () {
        return `<div>
          <h4 style={{ color: "red"}}>
              ${this.series.name} 
              </h4>
              <div>
              <b> ${this.y} </b> messages on ${dateFormat("%e %b", this.x)}
              </div>
              </div>`;
      },
    },

    legend: {
      itemStyle: {
        // Styling for the legend items (e.g., the text)
        color: "white",
        fontWeight: "normal",
      },
      itemHoverStyle: {
        // Styling for the legend items on hover
        color: "white",
      },
      itemHiddenStyle: {
        // Styling for the legend items when they are hidden
        color: "#999999",
      },
      backgroundColor: "black", // Background color for the legend
      borderRadius: " 5px"
    },
  };
};

function App() {
  const options = useMemo(
    () => engagementMessageOverTimeChartOptions(messageCountList, channels),
    [messageCountList, channels]
  );

  return (
    <div style={{ width: "70vw" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default App;
