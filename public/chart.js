function chart_data() {
  var nuoc = 50;
  var temperature = nhiet_do;
  var humidity = do_am;
  var lux = anh_sang;
  var xValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  new Chart("myChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "Temperature",
          data: temperature,
          backgroundColor: "red",
          fill: false,
        },
        {
          label: "Humidity",
          data: humidity,
          backgroundColor: "blue",
          fill: false,
        },
      ],
    },
    options: {
      legend: { display: true },
      title: {
        display: true,
        text: "BIỂU ĐỒ DỮ LIỆU CẢM BIẾN NHIỆT ĐỘ, ĐỘ ẨM",
      },
    },
  });

  new Chart("myCh", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "Lux",
          data: lux,
          borderColor: "yellow",
          fill: false,
        },
      ],
    },
    options: {
      legend: { display: true },
      title: {
        display: true,
        text: "BIỂU ĐỒ DỮ LIỆU CẢM BIẾN ÁNH SÁNG",
      },
    },
  });
}
